/**
 * ===================================================
 * 🎨 RENDERER AGENT (AGENTS.md Layer 1: Core)
 * ===================================================
 *
 * 역할: AI 로우 데이터를 프론트엔드용 UI 블록 및
 *      SEO 최적화된 최종 HTML로 변환하는 전담 에이전트.
 */
/**
 * AI 생성 데이터를 애드센스 최적화 HTML로 변환 (서버 전용)
 * ver02: 지능형 광고 배치 + 자동 목차(ToC) + 경험 인증 배지
 */
export function applyHTMLTemplate(data, topic, options) {
    const CURATED_FALLBACKS = [
        "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
        "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
        "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
        "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
    ];
    const mainImage = data.image1 || CURATED_FALLBACKS[Math.floor(Math.random() * CURATED_FALLBACKS.length)];
    const faqs = data.faq || data.detailedFaqs || [];
    const formatBody = (text) => {
        if (!text)
            return "";
        return text.split("\n\n").map(p => `<p style="margin-bottom:24px; line-height:1.9; font-size:17px; color:#374151;">${p.trim()}</p>`).join("");
    };
    const isApproved = options?.adsenseStatus === 'approved';
    const pubId = options?.adsensePub || 'pub-xxxxxxxxxxxx';
    // 1. 자동 목차(ToC) 생성 (H2 기준)
    const headings = [];
    if (data.content1)
        headings.push({ id: "toc-1", text: `${topic}의 핵심 원리` });
    if (data.definitionSection)
        headings.push({ id: "toc-2", text: data.definitionSection.title });
    if (data.comparisonData)
        headings.push({ id: "toc-3", text: data.comparisonData.title });
    if (data.content2)
        headings.push({ id: "toc-4", text: "심층 가이드" });
    if (faqs.length > 0)
        headings.push({ id: "toc-5", text: "자주 묻는 질문" });
    const tocHtml = headings.length > 0 ? `
  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:25px; margin:40px 0;">
    <p style="margin:0 0 15px 0; font-weight:800; font-size:18px; color:#1e293b;">📋 목차</p>
    <ul style="margin:0; padding-left:20px; list-style-type:circle;">
      ${headings.map(h => `<li style="margin-bottom:8px;"><a href="#${h.id}" style="color:#2563eb; text-decoration:none; font-size:15px; font-weight:500;">${h.text}</a></li>`).join("")}
    </ul>
  </div>` : '';
    // 2. 광고 블록 (지능형 멀티 배치)
    const getAdBlock = (slot) => isApproved ? `
  <div style="margin:40px 0; padding:10px; text-align:center; background:#fcfcfc; border:1px dashed #e2e8f0; color:#94a3b8; font-size:11px;">
    <!-- AD_SLOT: ${slot} -->
    <ins class="adsbygoogle"
         style="display:block; text-align:center;"
         data-ad-layout="in-article"
         data-ad-format="fluid"
         data-ad-client="ca-${pubId}"
         data-ad-slot="${slot}"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>` : '';
    const affiliateBlock = (isApproved && options?.coupangId && options?.coupangTracking) ? `
  <div style="margin:40px 0; text-align:center;">
    <script src="https://ads-partners.coupang.com/g.js"></script>
    <script>
      new PartnersCoupang.G({"id":${options.coupangId},"template":"carousel","trackingCode":"${options.coupangTracking}","width":"100%","height":"140"});
    </script>
  </div>` : '';
    return `
<div style="max-width:750px; margin:0 auto; font-family:'Pretendard','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#1e293b; line-height:1.9; word-break:keep-all; background-color:#ffffff; padding:20px;">
  <!-- SEO & Accessibility: Hidden Topic Context -->
  <span style="display:none;">${topic}에 대한 심층 분석 및 실제 경험 공유</span>

  <h1 style="font-size:clamp(28px, 5vw, 42px); font-weight:900; margin-bottom:30px; color:#0f172a; letter-spacing:-0.04em; line-height:1.2; text-align:left;">${data.title || topic}</h1>
  
  <div style="display:flex; align-items:center; gap:10px; margin-bottom:30px;">
    <div style="padding:4px 12px; background:linear-gradient(90deg, #6366f1, #a855f7); color:white; border-radius:50px; font-size:11px; font-weight:900; letter-spacing:0.05em; box-shadow:0 4px 10px rgba(99,102,241,0.3);">EXPERIENCE VERIFIED</div>
    <div style="height:1px; flex:1; background:#f1f5f9;"></div>
  </div>

  <div style="background:rgba(241, 245, 249, 0.5); backdrop-filter:blur(10px); border-left:6px solid #6366f1; padding:35px; border-radius:20px; margin-bottom:45px; color:#475569; font-size:19px; font-weight:500; line-height:1.8; box-shadow:inset 0 2px 4px rgba(0,0,0,0.02);">
    ${data.intro || ""}
  </div>

  ${data.authorBox ? `
  <div style="display:flex; align-items:center; gap:15px; background:linear-gradient(to right, #ffffff, #f8fafc); border:1px solid #f1f5f9; padding:25px; border-radius:24px; margin-bottom:50px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.03);">
    <img src="${data.authorBox.avatar || data.authorBox.image || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:3px solid #fff; box-shadow:0 4px 12px rgba(0,0,0,0.1);" />
    <div>
      <div style="font-weight:900; font-size:16px; color:#0f172a;">${data.authorBox.name || '전문 에디터'}</div>
      <div style="font-size:13px; color:#64748b; margin-top:4px; font-weight:500;">${data.authorBox.bio || data.authorBox.description || '애드센스 승인 콘텐츠 전문가'}</div>
    </div>
  </div>` : ""}

  <div style="position:relative; margin-bottom:50px;">
    <img src="${mainImage}" style="width:100%; border-radius:32px; box-shadow:0 25px 60px -12px rgba(0,0,0,0.15);" alt="${topic}" />
    <div style="position:absolute; bottom:20px; right:20px; background:rgba(0,0,0,0.4); backdrop-filter:blur(10px); color:white; padding:8px 16px; border-radius:12px; font-size:10px; font-weight:700;">MAZA AI VISION OPTIMIZED</div>
  </div>
  
  ${tocHtml}

  <div id="toc-1" style="font-size:18px; margin-bottom:50px;">${formatBody(data.content1 || "")}</div>
  
  ${getAdBlock("mid-1")}

  ${data.insightBox ? `
  <div style="background:linear-gradient(135deg, #e0f2fe 0%, #eff6ff 100%); padding:40px; border-radius:32px; margin:60px 0; border:1px solid #bae6fd; position:relative; box-shadow:0 20px 40px -15px rgba(186,230,253,0.3);">
    <div style="position:absolute; top:-15px; left:40px; padding:8px 20px; background:#0ea5e9; color:#fff; font-size:11px; font-weight:900; border-radius:50px; box-shadow:0 4px 10px rgba(14,165,233,0.3);">EXPERT INSIGHT</div>
    <h3 style="margin:0 0 15px 0; font-size:22px; color:#0369a1; font-weight:900;">💡 진짜 전문가들만 아는 팁</h3>
    <p style="margin:0; color:#075985; font-size:17px; font-weight:500;">${data.insightBox}</p>
  </div>` : ""}

  <div style="background:#fff7ed; padding:40px; border-radius:32px; margin:60px 0; border:1px solid #ffedd5; box-shadow:0 15px 30px -10px rgba(255,237,213,0.5);">
    <h3 style="margin:0 0 15px 0; font-size:22px; color:#9a3412; font-weight:900;">🚀 3줄 핵심 요약</h3>
    <p style="margin:0; color:#7c2d12; font-size:17px; line-height:1.8; font-weight:500;">${data.summary || ""}</p>
  </div>

  ${data.image2 ? `<img src="${data.image2}" style="width:100%; border-radius:32px; margin:55px 0; box-shadow:0 20px 50px rgba(0,0,0,0.1);" alt="${topic} 분석" />` : ""}
  
  ${data.definitionSection ? `
  <div id="toc-2" style="margin:60px 0; padding:45px; background:#ffffff; border:1px solid #f1f5f9; border-radius:32px; box-shadow:0 20px 40px -20px rgba(0,0,0,0.05);">
    <h2 style="font-size:28px; font-weight:900; color:#0f172a; margin-bottom:30px; letter-spacing:-0.03em;">📖 ${data.definitionSection.title}</h2>
    <div style="font-size:18px; line-height:1.9; color:#334155;">${formatBody(data.definitionSection.content)}</div>
  </div>` : ""}

  ${data.comparisonData ? `
  <div id="toc-3" style="margin:60px 0; overflow-x:auto;">
    <h2 style="font-size:28px; font-weight:900; color:#0f172a; margin-bottom:30px; letter-spacing:-0.03em;">📊 ${data.comparisonData.title}</h2>
    <table style="width:100%; border-collapse:separate; border-spacing:0; border-radius:24px; overflow:hidden; border:1px solid #f1f5f9; font-size:16px; box-shadow:0 10px 30px rgba(0,0,0,0.02);">
      <thead>
        <tr style="background:#f8fafc;">
          ${data.comparisonData.headers.map((h) => `<th style="padding:22px; border-bottom:1px solid #f1f5f9; text-align:left; font-weight:900; color:#475569;">${h}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${data.comparisonData.rows.map((row, rIdx) => `
          <tr style="background:#ffffff;">
            ${row.map((cell, idx) => `<td style="padding:22px; border-bottom:${rIdx === data.comparisonData.rows.length - 1 ? '0' : '1px solid #f1f5f9'}; color:${idx === 0 ? '#0f172a' : '#64748b'}; font-weight:${idx === 0 ? '800' : '500'};">${cell}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>` : ""}

  ${getAdBlock("mid-2")}

  ${data.practicalExamples ? `
  <div style="margin:60px 0;">
    <h2 style="font-size:28px; font-weight:900; color:#0f172a; margin-bottom:35px; letter-spacing:-0.03em;">✍️ 실제 상황별 적용 포인트</h2>
    <div style="display:grid; gap:30px;">
      ${data.practicalExamples.map((ex) => `
        <div style="padding:35px; background:#ffffff; border-radius:32px; border:1px solid #f1f5f9; box-shadow:0 15px 35px -10px rgba(0,0,0,0.05); border-top:10px solid #6366f1;">
          <div style="font-weight:900; font-size:14px; color:#6366f1; margin-bottom:20px; text-transform:uppercase; letter-spacing:0.1em;">SCENARIO: ${ex.case}</div>
          <div style="display:flex; flex-direction:column; gap:20px;">
            <div style="color:#ef4444; font-size:17px; font-weight:600; padding:15px; background:#fef2f2; border-radius:16px;"><strong>⛔ 주의할 점:</strong> ${ex.bad}</div>
            <div style="color:#059669; font-size:17px; font-weight:600; padding:20px; background:#f0fdf4; border-radius:16px; border:1px solid #dcfce7;"><strong>💡 정답 가이드:</strong> ${ex.good}</div>
          </div>
        </div>
      `).join("")}
    </div>
  </div>` : ""}

  <div id="toc-4" style="font-size:18px; margin-bottom:50px;">
    <h2 style="font-size:30px; font-weight:900; margin:70px 0 35px; color:#0f172a; border-bottom:6px solid #f1f5f9; padding-bottom:15px; letter-spacing:-0.04em;">💡 전문가의 심층 가이드</h2>
    ${formatBody(data.content2 || "")}
  </div>
  
  ${affiliateBlock}

  ${data.experienceNote ? `
  <div style="background:linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%); padding:50px; border-radius:40px; margin:70px 0; border:1px solid #fff; box-shadow:0 30px 60px -20px rgba(226,209,195,0.4); position:relative;">
    <div style="position:absolute; top:-25px; left:50px; padding:12px 30px; background:#1e293b; color:#fff; border-radius:50px; font-size:12px; font-weight:900; letter-spacing:0.1em; box-shadow:0 10px 20px rgba(0,0,0,0.2);">
      AUTHENTIC VOICE
    </div>
    <h3 style="margin:10px 0 20px 0; font-size:24px; color:#1e293b; font-weight:900;">✍️ 저의 개인적인 소회와 조언</h3>
    <p style="margin:0; font-size:19px; color:#334155; font-style:italic; line-height:1.8; font-weight:500;">"${data.experienceNote}"</p>
  </div>` : ""}

  ${data.image3 ? `<img src="${data.image3}" style="width:100%; border-radius:32px; margin:55px 0; box-shadow:0 25px 60px rgba(0,0,0,0.12);" alt="${topic} 마무리" />` : ""}
  
  ${faqs.length > 0 ? `
  <div id="toc-5" style="margin-top:80px; background:#0f172a; padding:55px; border-radius:40px; color:#fff; box-shadow:0 30px 70px -20px rgba(15,23,42,0.4);">
    <h3 style="font-size:28px; font-weight:900; margin-bottom:40px; color:#fff; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px; letter-spacing:-0.02em;">🙋‍♂️ 궁금한 점 해결 (FAQ)</h3>
    ${faqs.map((f) => `
      <div style="margin-bottom:35px; background:rgba(255,255,255,0.03); padding:25px; border-radius:24px; border:1px solid rgba(255,255,255,0.05);">
        <p style="font-weight:900; font-size:20px; color:#7dd3fc; margin-bottom:15px; line-height:1.4;">Q. ${f.q || f.question}</p>
        <p style="font-size:17px; color:#94a3b8; line-height:1.8; margin:0; font-weight:500;">A. ${f.a || f.answer}</p>
      </div>
    `).join("")}
  </div>` : ""}

  ${data.outro ? `<div style="margin-top:70px; padding:45px; background:linear-gradient(to right, #f0fdf4, #dcfce7); border-radius:32px; border:1px solid #bbf7d0;"><p style="color:#166534; font-size:19px; font-weight:600; line-height:1.9; margin:0;">${data.outro}</p></div>` : ""}
  
  ${data.internalLinks && data.internalLinks.length > 0 ? `
  <div style="margin-top:70px; padding:45px; background:#ffffff; border-radius:32px; border:1px solid #f1f5f9; box-shadow:0 10px 30px rgba(0,0,0,0.02);">
    <h3 style="margin:0 0 25px 0; font-size:22px; color:#0369a1; font-weight:900;">🔗 함께 읽으면 실력이 느는 글</h3>
    <ul style="margin:0; padding:0; list-style:none;">
      ${data.internalLinks.map((link) => `
        <li style="margin-bottom:15px;">
          <a href="${link.url || '#'}" style="display:block; padding:15px 20px; background:#f8fafc; border-radius:16px; color:#2563eb; font-weight:700; text-decoration:none; transition:all 0.2s; border:1px solid transparent;">
            ${link.title} <span style="float:right; opacity:0.5;">→</span>
          </a>
        </li>`).join("")}
    </ul>
  </div>` : ""}

  ${data.metadata?.series ? `
  <div style="margin-top:50px; padding:40px; background:linear-gradient(to bottom, #f8fafc, #ffffff); border-radius:40px; border:1px solid #e2e8f0; box-shadow:0 15px 40px rgba(0,0,0,0.03);">
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:30px;">
       <div style="width:36px; height:36px; background:linear-gradient(135deg, #6366f1, #4f46e5); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:14px; font-weight:900; box-shadow:0 4px 10px rgba(99,102,241,0.3);">S</div>
       <h3 style="margin:0; font-size:20px; color:#0f172a; font-weight:900;">"${data.metadata.series.title}" 시리즈 가이드</h3>
    </div>
    <div style="display:grid; gap:12px;">
       ${data.metadata.series.posts.map((p) => `
         <div style="display:flex; align-items:center; justify-content:space-between; padding:15px 25px; background:white; border-radius:20px; border:1px solid ${p.current ? '#6366f1' : '#f1f5f9'}; box-shadow:${p.current ? '0 10px 20px rgba(99,102,241,0.1)' : 'none'};">
            <span style="font-size:15px; color:${p.current ? '#4f46e5' : '#475569'}; font-weight:${p.current ? '800' : '500'};">
               ${p.current ? '📌 ' : ''}${p.title}
            </span>
            ${p.url ? `<a href="${p.url}" style="font-size:12px; font-weight:900; color:#6366f1; text-decoration:none; padding:6px 12px; background:#f5f3ff; border-radius:10px;">읽어보기</a>` : `<span style="font-size:11px; color:#cbd5e1; font-weight:bold;">준비 중</span>`}
         </div>
       `).join("")}
    </div>
  </div>` : ""}
  
  ${data.hashtags && Array.isArray(data.hashtags) ? `
  <div style="margin-top:70px; padding-top:40px; border-top:1px solid #f1f5f9; display:flex; flex-wrap:wrap; gap:10px;">
    ${data.hashtags.map((t) => `<span style="background:#f8fafc; color:#64748b; padding:8px 18px; border-radius:100px; font-weight:700; font-size:14px; border:1px solid #e2e8f0;">#${t.replace('#', '')}</span>`).join("")}
  </div>` : ""}
  
  ${getAdBlock("bottom-fixed")}
  
  <div style="margin-top:80px; text-align:center; color:#94a3b8; font-size:12px; font-weight:500; letter-spacing:0.02em;">
    © 2026 MAZA STUDIO AUTOPILOT ENGINE. ALL RIGHTS RESERVED.
  </div>
</div>`;
}
/**
 * RendererAgent: 모든 미션의 최종 출력을 담당
 */
export class RendererAgent {
    static renderPost(data, options) {
        if (!data)
            return { title: options.topic, blocks: [], html: "" };
        // 외부 주입된 내부 링크가 있으면 병합
        if (options.internalLinks) {
            data.internalLinks = [...(data.internalLinks || []), ...options.internalLinks];
        }
        const title = data.title || options.topic;
        const blocks = [];
        const faqs = data.faq || data.detailedFaqs || [];
        // 1. 헤더 및 작성자 정보
        blocks.push({ type: "title", text: title });
        if (data.authorBox) {
            blocks.push({
                type: "authorBox",
                name: data.authorBox.name || "전문 에디터",
                description: data.authorBox.bio || "애드센스 승인 콘텐츠 전문가",
                image: data.authorBox.avatar || "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg"
            });
        }
        // 2. 인트로 및 요약
        if (data.intro)
            blocks.push({ type: "intro", text: data.intro });
        if (data.summary)
            blocks.push({ type: "summary", text: data.summary });
        // 3. 메인 이미지 및 섹션 1
        if (data.image1)
            blocks.push({ type: "image", url: data.image1, alt: title });
        if (data.content1) {
            blocks.push({ type: "heading", text: `${options.topic}의 핵심 원리와 이해`, level: 2 });
            blocks.push({ type: "paragraph", text: data.content1 });
        }
        if (data.insightBox)
            blocks.push({ type: "insight", text: data.insightBox });
        if (data.summary)
            blocks.push({ type: "summary_box", text: data.summary });
        // 4. 섹션 2 (분석 및 정의)
        if (data.image2)
            blocks.push({ type: "image", url: data.image2, alt: `${options.topic} 상세` });
        if (data.definitionSection) {
            blocks.push({ type: "heading", text: data.definitionSection.title, level: 2 });
            blocks.push({ type: "paragraph", text: data.definitionSection.content });
        }
        if (data.comparisonData) {
            blocks.push({ type: "heading", text: data.comparisonData.title, level: 2 });
            blocks.push({ type: "table", headers: data.comparisonData.headers, rows: data.comparisonData.rows });
        }
        if (data.practicalExamples) {
            blocks.push({ type: "heading", text: "실전 적용 사례", level: 2 });
            data.practicalExamples.forEach((ex) => {
                blocks.push({ type: "example_box", situation: ex.case, bad: ex.bad, good: ex.good });
            });
        }
        // 5. 심층 가이드 및 경험담
        if (data.content2) {
            blocks.push({ type: "heading", text: `심층 가이드 및 활용법`, level: 2 });
            blocks.push({ type: "paragraph", text: data.content2 });
        }
        if (data.experienceNote)
            blocks.push({ type: "experience", text: data.experienceNote });
        if (data.image3)
            blocks.push({ type: "image", url: data.image3, alt: `${options.topic} 마무리` });
        // 6. FAQ 및 결론
        if (faqs.length > 0)
            blocks.push({ type: "faq", items: faqs });
        if (data.outro)
            blocks.push({ type: "conclusion", text: data.outro });
        if (data.hashtags)
            blocks.push({ type: "hashtags", items: data.hashtags });
        const html = applyHTMLTemplate(data, options.topic, {
            adsenseStatus: options.adsenseStatus,
            adsensePub: options.adsensePub,
            coupangId: options.coupangId,
            coupangTracking: options.coupangTracking
        });
        return { title, blocks, html };
    }
}
// Support functions for legacy block rendering if needed
export function renderBlocksToHTML(blocks, title) {
    if (!blocks || !Array.isArray(blocks))
        return "";
    let html = `<div style="max-width:720px; margin:0 auto; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">`;
    if (title)
        html += `<h1 style="font-size:28px; font-weight:800; margin-bottom:20px;">${title}</h1>`;
    blocks.forEach(block => {
        const text = block.text || block.content || "";
        switch (block.type) {
            case "heading":
                html += `<h2 style="font-size:22px; font-weight:700; margin:30px 0 10px;">${text}</h2>`;
                break;
            case "paragraph":
                html += `<p style="font-size:16px; line-height:1.8; margin-bottom:20px;">${text}</p>`;
                break;
            case "image":
                html += `<img src="${block.url}" style="width:100%; border-radius:20px; margin:25px 0;" alt="${block.alt || ""}" />`;
                break;
            default: if (text)
                html += `<p>${text}</p>`;
        }
    });
    html += `</div>`;
    return html;
}
