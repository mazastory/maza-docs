import { LogIn, UserCircle, Settings, CheckCircle, ChevronRight } from 'lucide-react';

export default function PageOnboarding() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <LogIn size={11} /> Onboarding
        </span>
        <h1 id="onboarding" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          로그인 & 온보딩
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          마자 스튜디오는 구글 계정 하나로 모든 과정이 시작됩니다.
          로그인부터 첫 사이트 등록까지 10분이면 충분합니다.
        </p>
      </div>

      <h2 id="google-login" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        구글 계정으로 로그인
      </h2>
      <div className="space-y-4 mb-12">
        {[
          { step: '01', title: 'mazastudio.kr 접속', desc: '크롬 브라우저에서 mazastudio.kr로 접속합니다. 모바일보다 데스크탑 환경을 권장합니다.' },
          { step: '02', title: '[Google로 시작하기] 버튼 클릭', desc: '메인 화면의 CTA 버튼 또는 로그인 페이지에서 구글 계정을 선택합니다. 애드센스와 서치콘솔을 운영 중인 계정으로 로그인하세요.' },
          { step: '03', title: '권한 승인', desc: '구글 OAuth 화면에서 Maza Studio가 요청하는 권한을 승인합니다. 이 권한은 서치콘솔 연동 및 블로그스팟 발행에 사용됩니다.' },
          { step: '04', title: '대시보드 진입', desc: '로그인 완료 후 [내 사이트] 대시보드로 자동 이동합니다. 처음이라면 [블로그 자동화 시작하기] 마법사가 실행됩니다.' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 bg-indigo-100 text-indigo-700">
              {item.step}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="wizard" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        블로그 자동화 마법사
      </h2>
      <p className="text-sm text-slate-600 font-medium mb-6">
        처음 로그인하면 아래 5단계 마법사가 자동으로 시작됩니다. 각 단계를 순서대로 완료하면 자동화가 즉시 작동합니다.
      </p>
      <div className="flex flex-col gap-2 mb-12">
        {[
          { n: '1단계', label: '플랫폼 & 도메인 선택', desc: '티스토리 / 워드프레스 / 블로그스팟 중 선택하고 블로그 주소를 입력합니다.' },
          { n: '2단계', label: '구글 서비스 연결', desc: '서치콘솔, GA4, 애드센스를 구글 계정과 연동합니다.' },
          { n: '3단계', label: '블루프린트 선택', desc: '수익화 전략 템플릿(니치 + 콘텐츠 방향)을 고릅니다.' },
          { n: '4단계', label: '첫 글 생성', desc: 'AI가 선택한 전략으로 초안을 즉시 생성합니다.' },
          { n: '5단계', label: '자동 발행 활성화', desc: 'W-05 프로토콜 기반 안전 스케줄로 자동 발행을 시작합니다.' },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-indigo-50 hover:border-indigo-100 transition-all">
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">{step.n}</span>
            <span className="text-sm font-black text-slate-800 flex-1">{step.label}</span>
            <span className="text-xs text-slate-400 font-medium hidden md:block">{step.desc}</span>
            <ChevronRight size={14} className="text-slate-300 shrink-0" />
          </div>
        ))}
      </div>

      <h2 id="after-onboarding" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        온보딩 완료 후
      </h2>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: UserCircle, title: '내 사이트', desc: '등록한 블로그 목록과 현황을 한눈에 확인합니다.' },
          { icon: Settings, title: '오토파일럿', desc: 'AI 글 생성 & 자동 발행을 실시간으로 모니터링합니다.' },
          { icon: CheckCircle, title: '애드센스 챌린지', desc: '승인 진척도와 다음 액션 아이템을 확인합니다.' },
        ].map((card, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
            <card.icon size={22} className="text-indigo-500 mx-auto mb-3" />
            <p className="text-sm font-black text-slate-800 mb-1">{card.title}</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
