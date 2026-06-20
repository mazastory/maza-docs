import { FileText, Star, Layers, CheckCircle, Sparkles } from 'lucide-react';

export default function PageAIWriter() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <FileText size={11} /> Feature
        </span>
        <h1 id="aiwriter" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          AI 라이터
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          마자의 <strong className="text-slate-900">AI 라이터</strong>는 구글이 중시하는
          E-E-A-T(경험·전문성·권위·신뢰) 기준에 맞춰 고품질 포스트를 자동으로 집필합니다.
        </p>
      </div>

      <h2 id="eeat" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        E-E-A-T 설계 원칙
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {[
          { label: 'Experience (경험)', desc: '실제 체험 기반의 서술체 유지. 1인칭 표현과 구체적 사례로 독창성을 확보합니다.', color: 'bg-amber-50 border-amber-100 text-amber-700' },
          { label: 'Expertise (전문성)', desc: '니치별 전문 용어와 깊이 있는 설명으로 해당 분야의 전문가임을 어필합니다.', color: 'bg-sky-50 border-sky-100 text-sky-700' },
          { label: 'Authoritativeness (권위)', desc: '시리즈 구성과 내부 링크로 특정 주제에 대한 Topical Authority를 구축합니다.', color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
          { label: 'Trustworthiness (신뢰)', desc: '정확한 정보, 출처 명시, 업데이트 날짜 기입으로 신뢰도를 높입니다.', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
        ].map((item, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${item.color} space-y-2`}>
            <p className="text-xs font-black uppercase tracking-wide">{item.label}</p>
            <p className="text-xs font-medium leading-relaxed opacity-80">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2 id="article-structure" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        자동 생성 글 구조
      </h2>
      <div className="space-y-3 mb-10">
        {[
          { section: 'H1', label: '제목 (SEO 최적화)', desc: '검색량이 높고 경쟁이 낮은 핵심 키워드가 자연스럽게 포함된 제목' },
          { section: 'Intro', label: '도입부', desc: '검색 의도(Search Intent)에 직접 답하며 독자의 이탈을 방지하는 첫 문단' },
          { section: 'H2×N', label: '본문 섹션', desc: '3~7개 소제목으로 구분된 깊이 있는 본문. 각 섹션은 최소 200자 이상' },
          { section: 'FAQ', label: 'FAQ 섹션', desc: 'People Also Ask 기반의 자주 묻는 질문 3~5개' },
          { section: 'CTA', label: '마무리 & CTA', desc: '요약 + 다음 행동 유도 (시리즈 글 연결 등)' },
        ].map((item, i) => (
          <div key={i} className="flex gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm items-start">
            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded font-mono shrink-0 mt-0.5">{item.section}</span>
            <div>
              <p className="text-sm font-black text-slate-800 mb-0.5">{item.label}</p>
              <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="blueprints" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        블루프린트 타입
      </h2>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Layers, title: '시리즈형', desc: '연관 주제를 7~15개 글로 묶어 Topical Authority를 최대화합니다.' },
          { icon: Star, title: '리뷰형', desc: '제품·서비스 비교 리뷰로 전환율이 높은 상업적 키워드를 공략합니다.' },
          { icon: Sparkles, title: '정보형', desc: '"~하는 방법", "~란 무엇인가" 등 정보 탐색형 키워드에 최적화됩니다.' },
        ].map((card, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <card.icon size={18} className="text-indigo-500 mb-2" />
            <p className="text-sm font-black text-slate-800 mb-1">{card.title}</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      <h2 id="quality" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        품질 보정 기능
      </h2>
      <div className="space-y-3 mb-8">
        {[
          'AI 탐지 우회 문체 적용 (GPT 패턴 제거)',
          '중복 문장 자동 제거 (내부 중복도 검사)',
          '이미지 자동 삽입 (Pexels API 연동)',
          '내부 링크 자동 삽입 (기존 발행 글과 연결)',
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <CheckCircle size={14} className="text-emerald-500 shrink-0" />
            <span className="text-sm font-medium text-slate-700">{item}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
