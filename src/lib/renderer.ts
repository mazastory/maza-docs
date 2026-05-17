import { convertForTistory } from "./tistoryConverter";

export type Block =
  | { type: "title"; text?: string; content?: string }
  | { type: "date"; text?: string; content?: string; author?: string; status?: string }
  | { type: "authorBox"; name: string; role: string; description: string; image?: string }
  | { type: "image"; url: string; caption?: string; alt?: string }
  | { type: "summary" | "intro" | "conclusion"; text?: string; content?: string; items?: string[] }
  | { type: "section" | "heading"; text?: string; content?: string; level?: number }
  | { type: "paragraph" | "text"; text?: string; content?: string }
  | { type: "quote"; text?: string; content?: string; source?: string }
  | { type: "list" | "tips"; items: string[] }
  | { type: "steps"; items: string[] }
  | { type: "faq"; items?: { q: string; a: string }[]; title?: string; answer?: string }
  | { type: "callout"; title?: string; text?: string; content?: string; style?: 'info' | 'warning' | 'success' | 'error' | 'summary' | 'tip' | 'note' }
  | { type: "button"; text?: string; content?: string; url: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "insight" | "experience" | "summary" | "intro" | "conclusion"; text?: string; content?: string; items?: string[] }
  | { type: "links" | "relatedPosts"; items: { title: string; url: string }[] }
  | { type: "hashtags"; items: string[] }
  | { type: "toc"; items?: { id: string; text: string }[] }
  | { type: "summary_box" | "insight" | "experience"; text?: string; content?: string }
  | { type: "example_box"; situation?: string; bad?: string; good?: string; text?: string }
  | { type: "action"; text?: string; mission?: string; action?: string; input?: any };

export type RenderMode = "app" | "copy" | "markdown" | "text";
export type Platform = "tistory" | "wordpress" | "notion" | "generic";

const BASE_FONT_STYLE = "font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; word-break: keep-all; overflow-wrap: break-word;";
const BASE_TEXT_STYLE = `${BASE_FONT_STYLE} font-size: 18px; line-height: 1.9; color: #334155; letter-spacing: -0.02em;`;

export function detectPlatform(): Platform {
  if (typeof window === 'undefined') return "generic";
  const ua = navigator.userAgent.toLowerCase();
  const referrer = document.referrer.toLowerCase();
  if (referrer.includes("tistory") || window.location.href.includes("tistory")) return "tistory";
  if (referrer.includes("wordpress") || window.location.href.includes("wordpress")) return "wordpress";
  if (referrer.includes("notion") || window.location.href.includes("notion")) return "notion";
  return "generic";
}

function getText(block: any): string {
  if (!block) return "";
  return block.text || block.content || (typeof block === 'string' ? block : "");
}

function parseMicroFormats(text: string): string {
  if (!text) return "";
  let clean = String(text);
  
  // 1. 강조 효과 (형광펜 효과: linear-gradient)
  clean = clean.replace(/==(.*?)==/g, '<span style="background: linear-gradient(to top, #fff176 45%, transparent 45%); font-weight: 800; color: #000; padding: 0 2px;">$1</span>');

  // 2. 프리미엄 인용구 서식 (Table-based for stability)
  clean = clean.replace(/\[QUOTE\]([\s\S]*?)\[\/QUOTE\]/g, `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0; border: none; border-collapse: collapse;">
      <tr>
        <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 20px; border: none;">
            <p style="font-family: 'Nanum Myeongjo', serif; font-size: 20px; font-weight: 800; color: #1e293b; line-height: 1.6; font-style: italic; margin: 0;">
                "$1"
            </p>
        </td>
      </tr>
    </table>
  `);

  return clean;
}

function renderParagraphs(text: string, wrapInP: boolean = true) {
  if (!text) return "";
  const ps = String(text).split("\n").map(t => t.trim()).filter(Boolean);
  if (wrapInP) return ps.map(t => `<p style="${BASE_TEXT_STYLE} margin-bottom: 30px; text-align: left;">${parseMicroFormats(t)}</p>`).join("");
  return ps.map(t => parseMicroFormats(t)).join("\n\n");
}

export function renderCopyHtml(blocks: Block[], title?: string): string {
  let html = `<div style="max-width:720px; margin:0 auto; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">\n`;

  if (title) {
    html += `  <h1 style="font-size:26px; font-weight:800; margin-bottom:20px; line-height:1.4;">${parseMicroFormats(title)}</h1>\n`;
  }

  html += blocks.map((block, index) => {
    try {
      const t = getText(block);
      
      switch (block.type) {
        case "title": 
          if (index === 0 && t === title) return "";
          return `  <h1 style="font-size:26px; font-weight:800; margin-bottom:20px; line-height:1.4;">${parseMicroFormats(t)}</h1>\n`;
        
        case "intro":
          return `  <p style="font-size:15px; line-height:1.8; color:#333; margin-bottom:20px;">${parseMicroFormats(t)}</p>\n`;

        case "image": {
          const imgUrl = (block as any).url || (block as any).image;
          if (!imgUrl) return "";
          return `  <img src="${imgUrl}" style="width:100%; border-radius:12px; margin-bottom:20px;" alt="${block.alt || ""}" />\n`;
        }

        case "summary": {
          const items = (block as any).items || [];
          const content = t ? parseMicroFormats(t) : items.map((i: string) => `• ${parseMicroFormats(i)}<br/>`).join("");
          return `  <div style="background:#f3f4f6; padding:18px; border-radius:12px; margin:25px 0;">
    <strong style="display:block; margin-bottom:10px;">📌 요약</strong>
    <p style="font-size:14px; line-height:1.7; margin:0;">${content}</p>
  </div>\n`;
        }

        case "section":
        case "heading": 
          return `  <h2 style="font-size:20px; font-weight:700; margin:30px 0 10px;">✔ ${parseMicroFormats(t)}</h2>\n`;

        case "paragraph":
        case "text":
        case "quote":
        case "steps":
          // Flatten lists and quotes into standard paragraph format for ultimate compatibility
          let textContent = t;
          if (block.type === "steps" && block.items) {
            textContent = block.items.map((item, idx) => `${idx + 1}. ${item}`).join("<br/>");
          }
          return `  <p style="font-size:15px; line-height:1.8; color:#333; margin-bottom:20px;">${parseMicroFormats(textContent)}</p>\n`;

        case "faq": {
          const items = block.items || [];
          let faqHtml = `  <div style="margin-top:30px;">
    <h3 style="font-size:18px; font-weight:700; margin-bottom:15px;">💡 FAQ</h3>\n`;
          
          (items || []).forEach((i: any) => {
            if (!i) return;
            const question = i.q || i.question || "궁금한 점";
            const answer = i.a || i.answer || "상세 답변 준비 중입니다.";
            faqHtml += `    <div style="border:1px solid #e5e7eb; padding:15px; border-radius:10px; margin-bottom:10px;">
      <strong>Q. ${parseMicroFormats(question)}</strong>
      <p style="margin-top:8px; font-size:14px; line-height:1.7;">${parseMicroFormats(answer)}</p>
    </div>\n`;
          });
          faqHtml += `  </div>\n`;
          return faqHtml;
        }

        case "insight":
          return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0; background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 20px;">
  <tr>
    <td style="padding: 30px;">
      <strong style="display: block; color: #2563eb; font-size: 14px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.1em;">💡 Expert Insight</strong>
      <p style="font-size: 17px; font-weight: 700; color: #1e3a8a; line-height: 1.6; margin: 0; font-style: italic;">
        "${parseMicroFormats(t).replace(/<br\s*\/?>/gi, '<br/>')}"
      </p>
    </td>
  </tr>
</table>\n`;

        case "experience":
          return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0; border: 2px dashed #e5e7eb; border-radius: 20px;">
  <tr>
    <td style="padding: 30px; background-color: #fafafa;">
      <strong style="display: block; color: #4b5563; font-size: 14px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.1em;">✍️ Direct Experience</strong>
      <p style="font-size: 16px; color: #4b5563; line-height: 1.8; margin: 0;">
        ${parseMicroFormats(t).replace(/<br\s*\/?>/gi, '<br/>')}
      </p>
    </td>
  </tr>
</table>\n`;

        case "links":
        case "relatedPosts": {
          const items = (block as any).items || [];
          return `
<div style="margin: 40px 0; padding: 30px; background-color: #111827; border-radius: 24px; color: #fff;">
  <strong style="display: block; color: #60a5fa; font-size: 12px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.2em;">Related Knowledge</strong>
  <ul style="list-style: none; padding: 0; margin: 0;">
    ${(items || []).map((link: any) => {
      if (!link) return "";
      const linkTitle = link.title || link.text || "관련 정보 보기";
      const linkUrl = link.url || "#";
      return `
      <li style="margin-bottom: 12px;">
        <a href="${linkUrl}" style="color: #fff; text-decoration: none; font-weight: 700; font-size: 16px;">🔗 ${linkTitle}</a>
      </li>
    `}).join('')}
  </ul>
</div>\n`;
        }

        case "hashtags": {
          const items = (block as any).items || [];
          return `  <p style="font-size:14px; color:#64748b; margin-top:30px;">${items.map((h: string) => `#${h.replace(/#/g, '')}`).join(" ")}</p>\n`;
        }

        case "conclusion":
          return `  <h2 style="font-size: 24px; font-weight: 800; margin: 45px 0 20px; color: #111; border-bottom: 3px solid #f3f4f6; padding-bottom: 10px;">✔ 마치며</h2>
  <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">${parseMicroFormats(t).replace(/<br\s*\/?>/gi, '<br/>')}</p>\n`;

        default: 
          return t ? `  <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">${parseMicroFormats(t).replace(/<br\s*\/?>/gi, '<br/>')}</p>\n` : "";
      }
    } catch (err) {
      return "";
    }
  }).join("");
  
  html += `</div>`;
  
  return convertForTistory(html);
}

function renderAppBlock(block: Block): string {
  const text = getText(block);
  switch (block.type) {
    case "title": return `<h1 style="font-size: 30px; font-weight: 800; line-height: 1.4; margin-bottom: 12px; color: #000;">${text}</h1>`;
    case "date": return `<div style="font-size: 14px; color: #666; margin-bottom: 30px;">${text} ${block.author ? `| ${block.author}` : ""}</div>`;
    case "authorBox": {
      const authorName = block.name && String(block.name) !== "undefined" ? String(block.name) : "콘텐츠 전문가";
      const authorDesc = block.description && String(block.description) !== "undefined" ? String(block.description) : "신뢰할 수 있는 정보를 공유합니다.";
      const authorAvatar = block.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e2e8f0'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%2394a3b8'/%3E%3Cellipse cx='50' cy='80' rx='30' ry='22' fill='%2394a3b8'/%3E%3C/svg%3E";
      return `<div style="display: flex; align-items: center; gap: 20px; background: #f8fafc; padding: 25px; border-radius: 14px; margin: 40px 0; border: 1px solid #e2e8f0;"><div style="width: 65px; height: 65px; border-radius: 50%; overflow: hidden; border: 2px solid #fff; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.05);"><img src="${authorAvatar}" alt="${authorName}" style="width: 100%; height: 100%; object-fit: cover;" referrerPolicy="no-referrer"></div><div><div style="font-size: 17px; font-weight: 800; color: #1e293b; margin-bottom: 2px;">${authorName}</div><div style="font-size: 14px; color: #64748b; line-height: 1.5;">${authorDesc}</div></div></div>`;
    }
    case "image": {
      const imageUrl = (block as any).url || (block as any).image;
      if (!imageUrl) return '';
      return `<div style="margin: 30px 0;"><img src="${imageUrl}" alt="${block.alt || ""}" style="width: 100%; height: auto; border-radius: 12px; display: block; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" referrerPolicy="no-referrer">${block.caption ? `<p style="text-align: center; font-size: 14px; color: #888; margin-top: 12px;">${block.caption}</p>` : ""}</div>`;
    }
    case "summary":
    case "intro":
    case "conclusion": {
      if (block.type === "intro") return `<p style="color: #666; font-size: 17px; line-height: 1.75; margin-bottom: 35px;">${text}</p>`;
      const title = block.type === "summary" ? "📌 요약" : "🏁 맺음말";
      let body = text;
      if (block.type === "summary" && (block as any).items) {
        body = `<ul style="margin: 0; padding-left: 20px;">${(block as any).items.map((i: string) => `<li style="margin-bottom: 5px;">${i}</li>`).join("")}</ul>`;
      }
      return `<div style="background: #f1f5f9; padding: 25px; border-radius: 14px; margin: 30px 0; border: 1px solid #e2e8f0;"><div style="font-weight: 800; margin-bottom: 12px; font-size: 18px; color: #0f172a;">${title}</div><div style="font-size: 16px; line-height: 1.8; color: #334155;">${body}</div></div>`;
    }
    case "section":
    case "heading": {
      const level = (block as any).level || 2;
      const prefix = level === 2 ? "✔ " : "";
      const id = text.replace(/\s+/g, '-').toLowerCase();
      return `<h${level} id="${id}" style="font-size: ${level === 2 ? "24px" : "20px"}; font-weight: 800; margin: ${level === 2 ? "50px" : "35px"} 0 15px; color: #000; line-height: 1.4;">${prefix}${text}</h${level}>`;
    }
    case "paragraph":
    case "text": {
      const ps = text.split("\n").map(t => t.trim()).filter(Boolean);
      return ps.map(t => `<p style="margin-bottom: 25px; font-size: 17px; line-height: 1.8; color: #333; word-break: keep-all;">${t}</p>`).join("");
    }
    case "list": return `<ul style="padding-left: 20px; margin-bottom: 30px; line-height: 1.9; color: #444;">${block.items.map(i => `<li style="margin-bottom: 8px;">${i}</li>`).join("")}</ul>`;
    case "steps": return `<ol style="padding-left: 0; list-style-type: none; margin-bottom: 35px;">${block.items.map((i, idx) => `<li style="margin-bottom: 15px; font-size: 17px; line-height: 1.7; color: #333; display: flex; gap: 15px;"><span style="background: #4f6df5; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; flex-shrink: 0;">${idx + 1}</span><span style="padding-top: 2px;">${i}</span></li>`).join("")}</ol>`;
    case "faq": {
      const faqItems = block.items || (block.title && (block as any).answer ? [{ q: block.title, a: (block as any).answer }] : []);
      return `<div style="margin: 60px 0;"><h3 style="font-size: 22px; font-weight: 900; margin-bottom: 25px; color: #0f172a; border-left: 6px solid #4f6df5; padding-left: 15px;">💡 FAQ</h3>${faqItems.map(item => `<div style="background: #f5f7ff; padding: 28px; border-radius: 18px; margin-bottom: 24px; border: 1px solid #eef2ff;"><div style="display: flex; align-items: flex-start; margin-bottom: 16px;"><div style="background: #4f6df5; color: #fff; font-weight: 900; width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; font-size: 18px;">Q</div><div style="font-size: 19px; font-weight: 800; color: #0f172a; line-height: 1.4; padding-top: 4px;">${item.q}</div></div><div style="font-size: 17px; color: #333; line-height: 1.8; padding-left: 46px;"><b style="color: #4f6df5; margin-right: 5px;">A.</b> ${item.a}</div></div>`).join("")}</div>`;
    }
    case "hashtags": return `<div style="margin-top: 40px; display: flex; flex-wrap: wrap; gap: 10px;">${block.items.map(h => `<span style="font-size: 14px; color: #64748b; font-weight: 600;">#${h.replace(/#/g, '') }</span>`).join("")}</div>`;
    default: return `<p>${text}</p>`;
  }
}

export function render(blocks: Block[], mode: RenderMode, title?: string): string {
  switch (mode) {
    case "app": return blocks.map(renderAppBlock).join("");
    case "copy": return renderCopyHtml(blocks, title);
    case "markdown": return renderMarkdown(blocks, title);
    case "text": return renderText(blocks);
    default: return "";
  }
}

export function renderHTML(blocks: Block[], options: { mode?: 'app' | 'copy'; title?: string; canonicalUrl?: string } = {}) {
  const mode = options.mode || 'app';
  if (mode === 'copy') return renderCopyHtml(blocks, options.title);
  
  const canonicalTag = options.canonicalUrl ? `<link rel="canonical" href="${options.canonicalUrl}" />` : "";
  const containerStyle = `max-width: 720px; margin: 0 auto; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background: #fff; color: #333; line-height: 1.8; padding: 20px; word-break: keep-all; overflow-wrap: break-word;`;
  
  const renderedContents = blocks.map(block => {
    if (block.type === "toc") {
      const headings = blocks.filter(b => b.type === "heading" || b.type === "section").map(b => {
        const text = getText(b);
        const level = (b as any).level || 2;
        return { text, id: text.replace(/\s+/g, '-').toLowerCase(), level };
      });
      return `<details style="background: #f8f9fa; padding: 25px; border-radius: 14px; margin: 35px 0; border: 1px solid #eee;" open><summary style="font-weight: 800; color: #333; cursor: pointer; font-size: 17px;">📋 목차</summary><ul style="margin-top: 15px; padding-left: 20px; list-style-type: none;">${headings.map(h => `<li style="margin-bottom: 10px; ${h.level === 3 ? 'padding-left: 15px;' : ''}"><a href="#${h.id}" style="color: #4f6df5; text-decoration: none; font-size: 15px; font-weight: 600;">${h.level === 3 ? '└ ' : ''}${h.text}</a></li>`).join("")}</ul></details>`;
    }
    return renderAppBlock(block);
  }).join("");
  
  return canonicalTag + `<div class="maja-studio-content" style="${containerStyle}">${options.title ? `<h1 style="font-size: 32px; font-weight: 900; line-height: 1.3; color: #000; border-bottom: 4px solid #000; padding-bottom: 20px; margin-bottom: 40px;">${options.title}</h1>` : ""}${renderedContents}</div>`;
}

export function renderMarkdown(blocks: Block[], title?: string): string {
  const md: string[] = [];
  if (title) md.push(`# ${title}\n`);
  blocks.forEach(block => {
    const t = getText(block);
    switch (block.type) {
      case "title": md.push(`# ${t}`); break;
      case "section":
      case "heading": md.push(`${"#".repeat((block as any).level || 2)} ${t}`); break;
      case "paragraph":
      case "text": md.push(t); break;
      case "list":
      case "tips": md.push(block.items.map(i => `* ${i}`).join("\n")); break;
      case "steps": md.push(block.items.map((i, idx) => `${idx + 1}. ${i}`).join("\n")); break;
      case "quote": md.push(`> ${t}`); break;
      case "image": md.push(`![${block.alt || t}](${(block as any).url || (block as any).image})`); break;
      case "insight": md.push(`> ### 💡 Expert Insight\n> ${t}`); break;
      case "experience": md.push(`> ### ✍️ Experience Case\n> ${t}`); break;
      case "summary": md.push(`> ### 📌 요약\n> ${t}`); break;
      case "links":
      case "relatedPosts": md.push(`### 🔗 관련 글\n${(block as any).items.map((i: any) => `* [${i.title}](${i.url})`).join("\n")}`); break;
      case "faq": md.push(`## FAQ\n${(block.items || []).map((i: any) => `**Q. ${i.q || i.question || ""}**\nA. ${i.a || i.answer || ""}`).join("\n\n")}`); break;
      case "hashtags": md.push((block as any).items.map((h: string) => `#${h.replace(/#/g, '')}`).join(' ')); break;
      case "summary_box": md.push(`> ### ✅ 핵심 요약\n> ${t}`); break;
      case "conclusion": md.push(`---\n\n${t}`); break;
    }
  });
  return md.join("\n\n");
}

export function renderText(blocks: Block[]): string {
  return blocks.map(block => {
    if (block.type === "list" || block.type === "steps" || block.type === "tips") return block.items.join("\n");
    return getText(block);
  }).join("\n\n");
}

export function renderCleanHTML(blocks: Block[]) {
  return renderCopyHtml(blocks);
}

export async function smartCopy(blocks: Block[], title?: string) {
  const platform = detectPlatform();
  const html = render(blocks, "copy", title);
  const md = render(blocks, "markdown", title);
  const plainTextReadable = render(blocks, "text");

  try {
    const blobHtml = new Blob([html], { type: "text/html" });
    const blobText = new Blob([platform === "notion" ? md : plainTextReadable], { type: "text/plain" });
    const item = new ClipboardItem({
      "text/html": blobHtml,
      "text/plain": blobText,
    });
    await navigator.clipboard.write([item]);
    return { success: true, platform };
  } catch (err) {
    console.error("Smart copy failed", err);
    await navigator.clipboard.writeText(platform === "notion" ? md : html);
    return { success: true, platform, fallback: true };
  }
}

export async function copyRawHtml(html: string, plainText?: string) {
  try {
    const blobHtml = new Blob([html], { type: "text/html" });
    const blobText = new Blob([plainText || html.replace(/<[^>]*>/g, '')], { type: "text/plain" });
    const item = new ClipboardItem({
      "text/html": blobHtml,
      "text/plain": blobText,
    });
    await navigator.clipboard.write([item]);
    return { success: true };
  } catch (err) {
    console.error("Raw copy failed", err);
    await navigator.clipboard.writeText(html);
    return { success: true, fallback: true };
  }
}

export function renderForPlatform(blocks: Block[]): string {
  const platform = detectPlatform();
  switch (platform) {
    case "tistory":
    case "wordpress":
      return render(blocks, "copy");
    case "notion":
      return render(blocks, "markdown");
    default:
      return render(blocks, "markdown");
  }
}

export function extractTitleAndBody(blocks: Block[], options: { title?: string } = {}) {
  const title = options.title || blocks.find(b => b.type === "title")?.text || "제목 없음";
  const bodyBlocks = blocks.filter(b => b.type !== "title");
  const bodyHtml = renderHTML(bodyBlocks, { mode: "copy" });
  
  return { title, bodyHtml };
}

export async function copyToClipboard(text: string, type: 'text/plain' | 'text/html' = 'text/plain') {
  try {
    if (type === 'text/html') {
      const blobHtml = new Blob([text], { type: 'text/html' });
      const blobText = new Blob([text.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
      const item = new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText });
      await navigator.clipboard.write([item]);
    } else {
      await navigator.clipboard.writeText(text);
    }
    return true;
  } catch (err) {
    console.error("Clipboard copy failed", err);
    return false;
  }
}
export async function generateTitleCard(title: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve("");

    // 1. Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#4F46E5'); // Indigo 600
    gradient.addColorStop(1, '#8B5CF6'); // Violet 500
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Add subtle texture (optional circles)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(1100, 100, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100, 500, 200, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    const badgeWidth = 240;
    const badgeHeight = 40;
    const badgeX = (canvas.width - badgeWidth) / 2;
    const badgeY = 150;
    ctx.roundRect?.(badgeX, badgeY, badgeWidth, badgeHeight, 20);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MAZA STUDIO PREMIUM', canvas.width / 2, badgeY + 25);

    // 4. Draw Title (Word wrapping)
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;

    const words = title.split(' ');
    let line = '';
    let y = 330;
    const lineHeight = 80;
    const maxWidth = 1000;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    resolve(canvas.toDataURL('image/jpeg', 0.9));
  });
}
