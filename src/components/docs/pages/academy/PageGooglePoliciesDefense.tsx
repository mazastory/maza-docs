import React from 'react';
import { AlertOctagon, ExternalLink } from 'lucide-react';

/**
 * 구글 정책 안내 — 2026-10-08 정정판.
 *
 * 이 페이지는 원래 「구글 공식 정책 방어 가이드」였고, 마자 스튜디오가 구글 정책을 "100% 합법적(White-Hat)으로 준수"한다고
 * 적었다("완벽한 방어 논리로 활용하세요"). 철회했다:
 *   · 합법·승인을 보장하는 표현은 우리가 증명할 수 없다. 승인은 구글이 결정한다(우리 기록에는 승인된 사이트가 없다).
 *   · "구글 공식"이라고 적은 문장 중 구글 원문에서 찾지 못한 것이 있었다.
 * 옛 본문은 git 이력에 있다. 원문 스냅샷: maza-docs/docs/04_legal_and_policies/google_originals/
 */
const LINKS: [string, string][] = [
  ['스팸 정책 (검색 센터)', 'https://developers.google.com/search/docs/essentials/spam-policies'],
  ['생성형 AI 콘텐츠 안내', 'https://developers.google.com/search/docs/fundamentals/using-gen-ai-content'],
  ['유용하고 신뢰할 수 있는 사람 중심 콘텐츠', 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content'],
  ['구글 검색의 AI 생성 콘텐츠 안내 (2023)', 'https://developers.google.com/search/blog/2023/02/google-search-and-ai-content'],
  ['애드센스 자격 요건', 'https://support.google.com/adsense/answer/9724'],
  ['게시자 정책 — 복제 콘텐츠', 'https://support.google.com/publisherpolicies/answer/11190248'],
  ['게시자 정책 — 콘텐츠 없는/가치 낮은 화면', 'https://support.google.com/publisherpolicies/answer/11112688'],
];

export default function PageGooglePoliciesDefense() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5 flex gap-3">
        <AlertOctagon className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-amber-900 leading-relaxed">
          <strong>2026-10-08 정정.</strong> 이 페이지는 이전에 「구글 공식 정책 방어 가이드」라는 이름으로 마자 스튜디오가 구글 정책을
          "100% 합법적으로 준수"한다고 적었습니다. 그 보장 표현과 구글 원문에서 확인되지 않는 문장을 <strong>철회</strong>했습니다.
          승인은 구글이 결정하며, 우리는 승인을 보장하지 않습니다.
        </div>
      </div>

      <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-4">구글 정책 안내</h1>
      <p className="text-slate-600 leading-relaxed mb-8">아래는 구글 공식 문서에서 직접 확인한 내용의 요지입니다. 정확한 문장은 원문 링크에서 읽으세요.</p>

      <h2 className="text-xl font-bold text-slate-900 mb-3">구글이 말한 것</h2>
      <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-8">
        <li>AI 나 자동화의 <strong>적절한 사용은 지침 위반이 아닙니다.</strong> 기준은 만든 방식이 아니라 콘텐츠의 품질입니다.</li>
        <li>스팸인 <strong>대규모 콘텐츠 악용</strong>은 순위 조작이 주된 목적이고 사용자에게 가치가 거의 없는 콘텐츠를 대량으로 만드는 것이며, <strong>어떻게 만들었든 상관없이</strong> 해당됩니다. 가치 없이 생성형 AI 로 많은 페이지를 만드는 것, 규모를 숨기려고 여러 사이트를 만드는 것이 예로 적혀 있습니다.</li>
        <li>AI 로 만든 콘텐츠는 <strong>게시 전에 정확성과 신뢰성을 직접 확인하고 검토하는 것이 중요</strong>하다고 합니다(정확성 항목의 권고).</li>
        <li>평가자 기준의 <strong>"노력"</strong>은 콘텐츠 <em>또는 그것을 돌리는 시스템</em>에 사람의 작업이 얼마나 들어갔는지를 봅니다. 수동 감독·큐레이션 없이 AI 로 대량의 글을 만드는 것은 노력이 거의 없는 예로 듭니다.</li>
        <li>애드센스 자격 요건에는 <strong>최소 트래픽·사이트 나이·글 수 요건이 없다</strong>고 명시돼 있습니다. 콘텐츠는 고품질·독창적이어야 합니다.</li>
        <li>게시자 정책은 <strong>"수동 검토나 큐레이션이 없는 자동 생성 콘텐츠"</strong>에 광고를 허용하지 않는다고 적습니다. 그 기준은 구글이 정의하지 않았습니다.</li>
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mb-3">우리가 증명하지 못하는 것</h2>
      <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-8">
        <li>"합법"·"완벽"·"안전" 같은 보장. 승인 여부는 구글이 결정합니다.</li>
        <li>서브도메인 승인 방식, 발행 속도와 패널티의 관계 등 이전 판이 "구글 공식"이라고 적었던 세부 내용은 원문에서 확인하지 못했습니다.</li>
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mb-3">원문</h2>
      <ul className="space-y-2 mb-8">
        {LINKS.map(([t, u]) => (
          <li key={u}>
            <a href={u} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline">
              {t} <ExternalLink size={13} />
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
