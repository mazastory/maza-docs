import { Target, TrendingUp, DollarSign, Search, Star } from 'lucide-react';

export default function PageStrategy() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Target size={11} /> Strategy
        </span>
        <h1 id="strategy" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          수익화 전략 설계
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          애드센스 수익은 <strong className="text-slate-900">니치(Niche) 선택</strong>에서 90%가 결정됩니다.
          CPC가 높고 경쟁이 낮은 키워드를 공략하는 것이 핵심입니다.
        </p>
      </div>

      <h2 id="niche-selection" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        니치 선택 기준
      </h2>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: DollarSign, title: '고 CPC', desc: '클릭당 광고 단가가 높은 분야를 선택합니다. 보험, 금융, 법률, 의료, SaaS가 대표적입니다.', badge: '최우선' },
          { icon: Search, title: '적정 검색량', desc: '월 검색량 1,000~10,000 사이의 키워드. 너무 높으면 경쟁이 치열하고, 너무 낮으면 트래픽이 부족합니다.', badge: '균형' },
          { icon: TrendingUp, title: '낮은 경쟁도', desc: 'KD(Keyword Difficulty) 30 이하의 키워드를 우선 공략합니다. 신규 블로그도 상위 노출이 가능합니다.', badge: '필수' },
        ].map((card, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm relative">
            <span className="absolute top-3 right-3 text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">{card.badge}</span>
            <card.icon size={18} className="text-indigo-500 mb-3" />
            <p className="text-sm font-black text-slate-800 mb-1">{card.title}</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      <h2 id="high-cpc-niches" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        고 CPC 추천 니치 (한국 기준)
      </h2>
      <div className="space-y-3 mb-10">
        {[
          { niche: '금융 & 보험', examples: '실손보험 비교, 자동차보험, 주택담보대출', cpc: '₩800~₩3,000' },
          { niche: '법률 & 세금', examples: '상속세 계산, 이혼 절차, 종합소득세 신고', cpc: '₩500~₩2,000' },
          { niche: '의료 & 건강', examples: '라식 비용, 임플란트 가격, 다이어트 약', cpc: '₩300~₩1,500' },
          { niche: 'B2B SaaS', examples: 'ERP 솔루션, CRM 비교, 클라우드 서비스', cpc: '₩400~₩2,500' },
          { niche: '부동산', examples: '아파트 청약, 전월세 계산, 등기 비용', cpc: '₩300~₩1,200' },
        ].map((item, i) => (
          <div key={i} className="flex flex-wrap gap-3 items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800">{item.niche}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.examples}</p>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">CPC {item.cpc}</span>
          </div>
        ))}
      </div>

      <h2 id="content-strategy" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        콘텐츠 전략
      </h2>
      <div className="space-y-3 mb-10">
        {[
          { title: '시리즈 발행 우선', desc: '단일 글보다 7~15개 연관 글로 구성된 시리즈가 Topical Authority 형성에 3배 효과적입니다.' },
          { title: '검색 의도 3가지 충족', desc: '정보형 (알고 싶어요) + 비교형 (뭐가 더 좋아요?) + 거래형 (어디서 사요?)를 모두 공략하세요.' },
          { title: '내부 링크 그물망', desc: '각 글에서 연관 글 2~3개로 연결하는 내부 링크를 꼭 포함하세요. 체류 시간과 색인 속도가 향상됩니다.' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <Star size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-black text-slate-800 mb-0.5">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
