import { Target, Search, FileText, CheckCircle2, TrendingUp, Compass } from 'lucide-react';

export default function PageNicheWriter() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Target size={11} /> Feature
        </span>
        <h1 id="niche-writer" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          황금 니치 포스팅 발굴
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">니치 라이터(Niche Writer)</strong>는 사용자가 타겟으로 하는 시장(Niche)의 숨겨진 황금 키워드를 발굴하고, 해당 키워드로 구글 SEO(E-E-A-T)에 최적화된 고품질 포스팅을 대량 생성하는 마자 스튜디오의 핵심 엔진입니다.
        </p>
      </div>

      <h2 id="niche-concept" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        니치(Niche)란 무엇인가요?
      </h2>
      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl mb-12">
        <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
          니치는 '틈새시장'을 의미합니다. 수익형 블로그에서 말하는 니치란 <strong>"검색량은 꾸준하지만, 경쟁 문서가 적거나 아직 질 높은 답변이 없는 특정 주제"</strong>를 말합니다.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
            <h4 className="text-xs font-black text-rose-600 mb-1">❌ 나쁜 니치 (레드오션)</h4>
            <p className="text-[11px] text-slate-500 font-medium">"건강 관리", "주식 투자", "다이어트 방법"</p>
            <p className="text-[10px] text-slate-400 mt-2">대기업, 뉴스 언론사, 병원 등 강력한 도메인들이 이미 장악하고 있어 신생 블로그가 노출되기 불가능에 가깝습니다.</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
            <h4 className="text-xs font-black text-emerald-600 mb-1">✅ 좋은 니치 (블루오션)</h4>
            <p className="text-[11px] text-slate-500 font-medium">"30대 직장인 거북목 스트레칭 5가지", "미국 배당주 세금 계산법"</p>
            <p className="text-[10px] text-slate-400 mt-2">구체적인 타겟팅과 명확한 문제 해결을 제시하여, 대형 포털보다 정확히 검색자의 의도(Search Intent)를 만족시킬 수 있습니다.</p>
          </div>
        </div>
      </div>

      <h2 id="how-to-use" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        니치 라이터 사용법
      </h2>
      <div className="space-y-4 mb-12">
        {[
          { icon: Search, title: '니치 키워드 입력', desc: '니치 라이터 화면에서 타겟으로 하는 구체적인 세부 키워드를 한 줄에 하나씩 입력합니다.' },
          { icon: Compass, title: '전략 및 블루프린트 선택', desc: '입력한 키워드 성격에 맞는 블루프린트(템플릿)를 선택합니다. (예: 정보성, 리뷰성, 시리즈 연재 등)' },
          { icon: FileText, title: 'AI 집필 시작 (파이프라인 큐잉)', desc: '생성 버튼을 누르면 AI가 SEO 뼈대를 잡고, 본문을 쓰고, 이미지를 삽입하는 전체 파이프라인이 백그라운드에서 가동됩니다.' },
          { icon: TrendingUp, title: '발행 대기열 진입', desc: '작성이 100% 완료된 포스팅은 내 사이트의 [오토파일럿] 발행 큐에 등록되어, 안전한 시간 간격(W-05)을 두고 자동으로 블로그에 올라갑니다.' }
        ].map((item, idx) => (
          <div key={idx} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="progress-monitor" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        진행률 모니터링 및 Rule 7 로직
      </h2>
      <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
        <CheckCircle2 size={18} className="text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-indigo-800 mb-1">에러 시 자동 후순위 재배치 (Rule 7)</p>
          <p className="text-xs text-indigo-700 font-medium leading-relaxed">
            여러 개의 키워드를 동시에 생성할 때, OpenAI 서버 지연이나 네트워크 문제로 일시적인 생성이 실패할 수 있습니다. 
            마자 스튜디오는 <strong>Rule 7 정책</strong>에 따라 실패한 작업을 즉시 대기열 맨 뒤로 보내고 남은 작업들을 먼저 멈춤 없이 계속 처리합니다. 진행창 화면에서도 정상 완료된 항목은 맨 위로, 실패한 항목은 에러 배지와 함께 맨 아래로 자동 정렬되어 시각적으로 쉽게 모니터링할 수 있습니다.
          </p>
        </div>
      </div>

    </article>
  );
}
