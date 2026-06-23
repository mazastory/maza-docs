import { Sparkles, CheckCircle2, Crown, MessageCircle } from 'lucide-react';

export default function PagePremiumService() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Crown size={11} /> Premium
        </span>
        <h1 id="premium-service" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          프리미엄 블로그 제작 의뢰
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">Maza 전문가 그룹</strong>이 서버 세팅부터 수익형 SEO 테마 최적화까지 모두 대신해 드리는 턴키(Turn-key) 서비스입니다. 개발이나 서버 지식이 없어도 즉시 수익 활동을 시작할 수 있습니다.
        </p>
      </div>

      <h2 id="why-premium" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        이런 분들께 추천합니다
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {[
          '서버 호스팅이나 도메인 연결 등 기술적인 부분이 너무 어렵고 부담스러운 분',
          '애드센스 승인을 위한 완벽한 최적화 세팅(속도, 메타태그 등)을 전문가에게 맡기고 싶은 분',
          '시간 낭비 없이 글쓰기와 수익 창출에만 집중하고 싶으신 분',
          '구글이 가장 선호하는 속도 100점 만점의 전용 테마를 사용하고 싶으신 분'
        ].map((desc, idx) => (
          <div key={idx} className="flex gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <CheckCircle2 size={18} className="text-violet-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 font-medium leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <h2 id="service-features" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        서비스 제공 내역
      </h2>
      <div className="space-y-4 mb-12">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
            <span className="text-emerald-500">✅</span> 서버 및 워드프레스 인프라 구축
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">가장 빠르고 안정적인 클라우드 서버에 최신 워드프레스를 설치하고, 무료 SSL 보안 인증서를 세팅합니다. (도메인 구매는 본인 소유를 위해 개별 안내해 드립니다)</p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
            <span className="text-emerald-500">✅</span> 수익형 Maza-Speed 테마 적용
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">디자인보다 로딩 속도와 구글 Core Web Vitals 점수에 극도로 최적화된 마자 전용 테마를 설치해 검색 엔진 노출 확률을 높입니다.</p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
            <span className="text-emerald-500">✅</span> Maza Studio API 즉시 연동
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">워드프레스 Application Password 발급 및 마자 스튜디오 연동을 완료하여 인도받은 즉시 [오토파일럿]으로 글을 발행할 수 있는 상태로 만들어 드립니다.</p>
        </div>
      </div>

      <h2 id="how-to-apply" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        의뢰 방법 및 절차
      </h2>
      <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
        <p className="text-sm text-indigo-900 font-medium leading-relaxed mb-6">
          현재 프리미엄 블로그 제작 서비스는 수요가 많아 순차적으로 작업이 진행되고 있습니다. 아래 <strong>카카오톡 공식 채널</strong>을 통해 문의를 남겨주시면, 전문 매니저가 비용 및 소요 기간, 도메인 준비 방법 등을 상세히 안내해 드립니다.
        </p>
        <a 
          href="https://pf.kakao.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FEE500] text-[#191919] font-black text-sm rounded-xl hover:bg-[#F4DC00] transition-colors shadow-sm"
        >
          <MessageCircle size={18} />
          카카오톡 채널로 문의하기
        </a>
      </div>
    </article>
  );
}
