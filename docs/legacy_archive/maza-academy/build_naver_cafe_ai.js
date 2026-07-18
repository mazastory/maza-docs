const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: '../maza-studio/.env' });

// Initialize Gemini API
// Extract a valid AIza key (the env var has multiple keys separated by commas)
const rawKey = process.env.GEMINI_API_KEY || '';
const validKey = rawKey.split(',').find(k => k.trim().startsWith('AIza')) || rawKey;
const ai = new GoogleGenAI({ apiKey: validKey.trim() });


// ──────────────────────────────────────────────────────────
// HTML Injector from previous script
// ──────────────────────────────────────────────────────────
const FONT = "'Apple SD Gothic Neo', 'Malgun Gothic', 'Nanum Gothic', sans-serif";
const PRIMARY = '#6366f1';

function injectStyles(html) {
  return html
    .replace(/<h1>/g, `<h1 style="font-size:28px;font-weight:800;color:#0f172a;margin-top:40px;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #e2e8f0;line-height:1.3;letter-spacing:-0.03em;font-family:${FONT};">`)
    .replace(/<h2>/g, `<h2 style="font-size:24px;font-weight:800;color:#0f172a;margin-top:36px;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #f1f5f9;line-height:1.3;letter-spacing:-0.03em;font-family:${FONT};">`)
    .replace(/<h3>/g, `<h3 style="font-size:20px;font-weight:800;color:#0f172a;margin-top:28px;margin-bottom:12px;line-height:1.3;letter-spacing:-0.03em;font-family:${FONT};">`)
    .replace(/<h4>/g, `<h4 style="font-size:18px;font-weight:800;color:#0f172a;margin-top:24px;margin-bottom:10px;line-height:1.3;font-family:${FONT};">`)
    .replace(/<p>/g, `<p style="font-size:16px;line-height:1.85;color:#3f3f46;margin-bottom:24px;word-break:keep-all;font-family:${FONT};">`)
    .replace(/<blockquote>/g, `<blockquote style="background-color:#f8fafc;border-left:4px solid ${PRIMARY};padding:18px 24px;margin:28px 0;border-radius:0 10px 10px 0;color:#334155;box-shadow:0 1px 3px rgba(0,0,0,0.05);font-family:${FONT};">`)
    .replace(/<strong>/g, `<strong style="color:#0f172a;font-weight:700;background:linear-gradient(180deg,transparent 65%,rgba(99,102,241,0.25) 65%);padding:0 2px;">`)
    .replace(/<em>/g, `<em style="font-style:italic;color:#475569;">`)
    .replace(/<code>/g, `<code style="background-color:#f1f5f9;color:#e11d48;padding:3px 7px;border-radius:6px;font-size:14px;font-weight:600;font-family:ui-monospace,SFMono-Regular,monospace;">`)
    .replace(/<pre>/g, `<pre style="background-color:#0f172a;color:#f8fafc;padding:22px;border-radius:14px;overflow-x:auto;margin:28px 0;box-shadow:0 4px 6px rgba(0,0,0,0.1);font-family:ui-monospace,SFMono-Regular,monospace;font-size:14px;">`)
    .replace(/(<pre[^>]*>)\s*(<code)[^>]*(>)/g, (match, pre, codeTag, gt) => `${pre}<code style="background:transparent;color:inherit;padding:0;font-family:ui-monospace,SFMono-Regular,monospace;font-size:14px;white-space:pre;"${gt}`)
    .replace(/<a href=/g, `<a style="color:${PRIMARY};text-decoration:underline;font-weight:600;" target="_blank" href=`)
    .replace(/<ul>/g, `<ul style="list-style-type:disc;padding-left:28px;margin-bottom:24px;color:#3f3f46;line-height:1.85;font-family:${FONT};">`)
    .replace(/<ol>/g, `<ol style="list-style-type:decimal;padding-left:28px;margin-bottom:24px;color:#3f3f46;line-height:1.85;font-family:${FONT};">`)
    .replace(/<li>/g, `<li style="margin-bottom:8px;font-size:16px;">`)
    .replace(/<hr>/g, `<hr style="border:0;border-top:1px solid #e2e8f0;margin:36px 0;">`)
    .replace(/<table>/g, `<table style="width:100%;border-collapse:collapse;margin:32px 0;background-color:white;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);border:1px solid #e2e8f0;font-family:${FONT};">`)
    .replace(/<thead>/g, `<thead style="background-color:#f8fafc;">`)
    .replace(/<th>/g, `<th style="border:1px solid #e2e8f0;padding:12px 16px;text-align:left;font-weight:700;color:#334155;font-size:15px;">`)
    .replace(/<td>/g, `<td style="border:1px solid #e2e8f0;padding:12px 16px;text-align:left;color:#3f3f46;font-size:15px;">`)
    .replace(/<img /g, `<img style="max-width:100%;height:auto;border-radius:16px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);margin:32px auto;display:block;" `);
}

// ──────────────────────────────────────────────────────────
// AI Rewriter
// ──────────────────────────────────────────────────────────
async function rewriteMarkdown(originalText) {
  const prompt = `당신은 네이버 카페에서 매우 인기 있는 친절한 강사입니다.
제공되는 마크다운 문서를 네이버 카페에 어울리도록 친근하고 부드러운 존댓말(~해요, ~합니다, ~알아볼까요? 등)로 완전히 새롭게 재작성해주세요.

[규칙]
1. 원본 블로그 글과 검색 엔진에서 "중복 문서(유사 문서)"로 걸리지 않도록 문장 구조와 표현을 완전히 다르게 작성해야 합니다.
2. 하지만 전달하고자 하는 핵심 내용, 정보, 순서는 100% 동일하게 유지하세요.
3. 원본 문서에 있는 마크다운 서식(제목 #, 인용구 >, 굵은 글씨 **, 리스트 -, 표, 이미지 등)은 그대로 유지하여 HTML 변환 시 디자인이 깨지지 않게 해주세요.
4. 인사말이나 도입부를 네이버 카페에 맞게 조금 더 친근하게 덧붙여도 좋습니다.

[원본 마크다운 문서]
${originalText}
`;

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-pro',
        contents: prompt,
        config: { temperature: 0.7 }
      });
      return response.text;
    } catch (error) {
      console.error(`AI Rewriting Error (${retries} retries left):`, error.message);


      retries--;
      if (retries === 0) return originalText; // fallback
      await new Promise(r => setTimeout(r, 2000));
    }
  }

}

// ──────────────────────────────────────────────────────────
// File processing
// ──────────────────────────────────────────────────────────
const baseDir = __dirname;
const outputDir = path.join(baseDir, 'export_html_cafe');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  let mdFiles = [];

  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'export_html' && file !== 'export_html_cafe' && file !== 'node_modules') {
        const subFiles = await processDirectory(fullPath);
        mdFiles = mdFiles.concat(subFiles);
      }
    } else if (path.extname(file) === '.md') {
      mdFiles.push(fullPath);
    }
  }
  return mdFiles;
}

async function run() {
  console.log('Finding markdown files...\n');
  const allMdFiles = await processDirectory(baseDir);
  
  // Test with just the first file
  const testFile = allMdFiles.find(f => f.includes('01_왜_마자를_선택해야할까.md')) || allMdFiles[0];
  console.log(`[TEST MODE] Only processing 1 file: ${path.basename(testFile)}`);
  
  const content = fs.readFileSync(testFile, 'utf8');

  // Remove frontmatter
  let cleanContent = content;
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    cleanContent = content.replace(/^---\n[\s\S]*?\n---\n*/, '');
  }

  console.log('🤖 AI is rewriting the content...');
  const rewrittenMd = await rewriteMarkdown(cleanContent);
  
  console.log('🎨 Generating styled HTML...');
  const rawHtml = marked.parse(rewrittenMd);
  const styledHtml = injectStyles(rawHtml);
  const wrappedHtml = `<div style="max-width:800px;margin:0 auto;font-family:${FONT};padding:20px;">\n${styledHtml}\n</div>`;

  const outPath = path.join(outputDir, path.basename(testFile).replace('.md', '.html'));
  fs.writeFileSync(outPath, wrappedHtml);
  console.log(`✅ Success! Saved to export_html_cafe/${path.basename(outPath)}`);
}

run();
