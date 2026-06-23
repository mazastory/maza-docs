import { LayoutTemplate, BookOpen, PenTool, Lightbulb, CheckSquare } from 'lucide-react';

export default function PageBlueprintGallery() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <LayoutTemplate size={11} /> Strategy
        </span>
        <h1 id="blueprint-gallery" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          블루프린트 갤러리
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">블루프린트(Blueprint)</strong>는 단순한 프롬프트가 아닌, 마자 스튜디오 전문가 그룹이 수만 건의 구글 상위 노출 데이터를 분석하여 만들어낸 <strong>완벽한 SEO 수익화 글쓰기 전략 템플릿</strong>입니다.
        </p>
      </div>

      <h2 id="why-blueprint" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        왜 블루프린트인가요?
      </h2>
      <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 mb-10">
        <Lightbulb size={24} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-amber-800 mb-1">프롬프트 엔지니어링의 끝판왕</p>
          <p className="text-xs text-amber-700 font-medium leading-relaxed">
            챗GPT에 "강아지 훈련법에 대해 써줘"라고 하면 누구나 쓸 수 있는 뻔한 글이 나옵니다. 하지만 블루프린트를 선택하면 AI는 <strong>'서론에서 후킹(Hooking) - 본론에서 H2, H3 계층구조화 - 경험 기반 스토리텔링 - 결론에서 체류시간 늘리는 콜투액션(CTA)'</strong> 등 철저히 계산된 구글 노출 공식을 따라 글의 뼈대를 조립합니다. 사용자는 그저 갤러리에서 내 블로그 성격에 맞는 블루프린트를 '선택'하기만 하면 됩니다.
          </p>
        </div>
      </div>

      <h2 id="gallery-types" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        대표적인 블루프린트 종류
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-500" /> 정보성 & 지식 전달 (Info-base)
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">검색자가 궁금해하는 질문에 대해 가장 빠르고 정확한 해답을 주는 문서입니다.</p>
          <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
            <li>활용: IT 정보, 정부 지원금, 건강 상식</li>
            <li>특징: 스니펫 노출 확률 1위, 빠른 트래픽 수집</li>
          </ul>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
            <CheckSquare size={16} className="text-emerald-500" /> 제품 리뷰 & 비교 (Review)
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">장단점을 솔직하게 비교 분석하여 독자의 구매 결정을 돕는 고가치 문서입니다.</p>
          <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
            <li>활용: 가전제품 리뷰, 영양제 비교, 서비스 후기</li>
            <li>특징: 체류 시간 극대화, 높은 CPC 단가 타겟팅</li>
          </ul>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
            <PenTool size={16} className="text-rose-500" /> 스토리 & 경험담 (E-E-A-T)
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">1인칭 시점의 에세이 톤으로 실제 경험을 녹여 구글의 E-E-A-T 점수를 가장 높게 받습니다.</p>
          <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
            <li>활용: 다이어트 성공기, 자격증 합격 후기</li>
            <li>특징: 독자 신뢰도 최상, 구글 어뷰징 필터 무력화</li>
          </ul>
        </div>
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-xs font-black text-slate-500 mb-1">그리고 100여 개의 확장 템플릿들...</p>
          <p className="text-[10px] text-slate-400">마자 스튜디오 갤러리는 매주 새로운 트렌드를 분석해 신규 블루프린트를 업데이트합니다.</p>
        </div>
      </div>

      <h2 id="how-to-apply" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        적용 방법
      </h2>
      <div className="space-y-2 mb-8">
        <p className="text-sm text-slate-600 font-medium mb-4">
          니치 라이터에서 새 포스팅을 기획할 때, 우측의 <strong>[블루프린트 선택]</strong> 메뉴를 눌러 갤러리를 엽니다. 카테고리별로 필터링하여 내 키워드에 가장 잘 어울리는 블루프린트를 클릭만 하면 즉시 파이프라인에 해당 작성 전략이 주입됩니다.
        </p>
      </div>
    </article>
  );
}
