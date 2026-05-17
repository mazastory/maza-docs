// Tistory HTML Converter
// 목적: Tailwind / class 기반 HTML → 인라인 스타일 HTML로 변환

const CLASS_MAP: Record<string, string> = {
  // background
  "bg-gray-50": "background-color: #f9fafb;",
  "bg-gray-100": "background-color: #f3f4f6;",
  "bg-white": "background-color: #ffffff;",
  "bg-blue-50": "background-color: #eff6ff;",
  "bg-blue-600": "background-color: #2563eb;",
  "bg-red-50": "background-color: #fef2f2;",

  // padding
  "p-2": "padding: 8px;",
  "p-3": "padding: 12px;",
  "p-4": "padding: 16px;",
  "p-5": "padding: 20px;",
  "p-6": "padding: 24px;",
  "p-8": "padding: 32px;",
  "px-4": "padding-left: 16px; padding-right: 16px;",
  "py-2": "padding-top: 8px; padding-bottom: 8px;",
  "py-4": "padding-top: 16px; padding-bottom: 16px;",

  // margin
  "mb-2": "margin-bottom: 8px;",
  "mb-3": "margin-bottom: 12px;",
  "mb-4": "margin-bottom: 16px;",
  "mb-6": "margin-bottom: 24px;",
  "mb-8": "margin-bottom: 32px;",
  "mt-4": "margin-top: 16px;",
  "mt-8": "margin-top: 32px;",
  "my-4": "margin-top: 16px; margin-bottom: 16px;",
  "my-8": "margin-top: 32px; margin-bottom: 32px;",

  // border
  "border": "border: 1px solid #e5e7eb;",
  "border-2": "border: 2px solid #e5e7eb;",
  "border-gray-200": "border-color: #e5e7eb;",
  "border-blue-600": "border-color: #2563eb;",
  "border-black": "border-color: #000000;",
  "border-none": "border: none;",

  // radius
  "rounded": "border-radius: 6px;",
  "rounded-lg": "border-radius: 10px;",
  "rounded-xl": "border-radius: 12px;",
  "rounded-2xl": "border-radius: 16px;",
  "rounded-3xl": "border-radius: 24px;",
  "rounded-full": "border-radius: 9999px;",

  // text size
  "text-xs": "font-size: 12px;",
  "text-sm": "font-size: 14px;",
  "text-base": "font-size: 16px;",
  "text-lg": "font-size: 18px;",
  "text-xl": "font-size: 20px;",
  "text-2xl": "font-size: 24px;",
  "text-3xl": "font-size: 30px;",
  
  // text weight
  "font-medium": "font-weight: 500;",
  "font-semibold": "font-weight: 600;",
  "font-bold": "font-weight: 700;",
  "font-black": "font-weight: 900;",

  // text color
  "text-gray-400": "color: #9ca3af;",
  "text-gray-500": "color: #6b7280;",
  "text-gray-600": "color: #4b5563;",
  "text-gray-700": "color: #374151;",
  "text-gray-800": "color: #1f2937;",
  "text-gray-900": "color: #111827;",
  "text-blue-600": "color: #2563eb;",
  "text-red-600": "color: #dc2626;",
  "text-white": "color: #ffffff;",
  "text-black": "color: #000000;",

  // text align
  "text-center": "text-align: center;",
  "text-left": "text-align: left;",
  "text-right": "text-align: right;",

  // layout
  "flex": "display: flex;",
  "items-center": "align-items: center;",
  "justify-center": "justify-content: center;",
  "justify-between": "justify-content: space-between;",
  "gap-2": "gap: 8px;",
  "gap-4": "gap: 16px;",
  "w-full": "width: 100%;",
  "max-w-2xl": "max-width: 42rem;",
  "mx-auto": "margin-left: auto; margin-right: auto;",

  // shadow (often ignored by CMS, but we can try)
  "shadow-sm": "box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);",
  "shadow-md": "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);",
  "shadow-lg": "box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);",
  "shadow-xl": "box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);",
};

export function convertClassesToStyle(classList?: string): string {
  if (!classList) return "";
  return classList
    .split(" ")
    .map(cls => CLASS_MAP[cls.trim()] || "")
    .filter(Boolean)
    .join(" ");
}

export function convertHTML(html: string): string {
  // class="..." → style="..."
  return html.replace(/class="([^"]+)"/g, (match, classNames) => {
    const style = convertClassesToStyle(classNames);
    return style ? `style="${style}"` : "";
  });
}

// 1. 이미지 스타일 강제 적용
export function enhanceImages(html: string): string {
  return html.replace(/<img /g, '<img style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 20px auto;" ');
}

// 2. 문단 기본 스타일
export function enhanceParagraph(html: string): string {
  return html.replace(/<p(.*?)>/g, (match, attrs) => {
    // 만약 이미 style이 있다면 건너뛰거나 병합할 수 있지만, 여기서는 단순 덮어쓰기/추가
    if (attrs.includes('style=')) {
      return match; // 이미 스타일이 있으면 보존
    }
    return `<p style="font-size: 16px; line-height: 1.8; color: #334155; margin-bottom: 24px; word-break: keep-all;"${attrs}>`;
  });
}

// 3. 리스트 스타일
export function enhanceLists(html: string): string {
  let result = html.replace(/<ul(.*?)>/g, (match, attrs) => {
    if (attrs.includes('style=')) return match;
    return `<ul style="padding-left: 24px; margin-bottom: 24px; line-height: 1.8; color: #475569;"${attrs}>`;
  });
  
  result = result.replace(/<li(.*?)>/g, (match, attrs) => {
    if (attrs.includes('style=')) return match;
    return `<li style="margin-bottom: 8px;"${attrs}>`;
  });
  return result;
}

// 4. 테이블 초기화 (티스토리 외곽선 방지)
export function enhanceTables(html: string): string {
  return html.replace(/<table(.*?)>/g, (match, attrs) => {
    if (attrs.includes('style=')) {
      return `<table style="border-collapse: collapse; border-spacing: 0; border: none; width: 100%; margin-bottom: 30px;"${attrs}>`;
    }
    return `<table style="border-collapse: collapse; border-spacing: 0; border: none; width: 100%; margin-bottom: 30px;"${attrs}>`;
  });
}

// 전체 변환 파이프라인
export function convertForTistory(html: string): string {
  let result = html;
  
  // 1. Tailwind 클래스를 인라인 스타일로 변환
  result = convertHTML(result);
  
  // 2. 각종 태그 기본 스타일 강제 주입
  result = enhanceImages(result);
  result = enhanceParagraph(result);
  result = enhanceLists(result);
  result = enhanceTables(result);
  
  return result;
}
