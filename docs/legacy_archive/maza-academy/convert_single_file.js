const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

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

const mdPath = path.join(__dirname, '01_왜_마자를_선택해야할까_cafe.md');
const outPath = path.join(__dirname, '01_왜_마자를_선택해야할까_cafe.html');

const content = fs.readFileSync(mdPath, 'utf8');

// Remove frontmatter
let cleanContent = content;
const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
if (frontmatterMatch) {
  cleanContent = content.replace(/^---\n[\s\S]*?\n---\n*/, '');
}

const rawHtml = marked.parse(cleanContent);
const styledHtml = injectStyles(rawHtml);
const wrappedHtml = `<div style="max-width:800px;margin:0 auto;font-family:${FONT};padding:20px;">\n${styledHtml}\n</div>`;

fs.writeFileSync(outPath, wrappedHtml);
console.log('Done generating cafe HTML!');
