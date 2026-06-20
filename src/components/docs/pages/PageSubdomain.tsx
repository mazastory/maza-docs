import { Box, Clock, Zap, Globe } from 'lucide-react';

export default function PageSubdomain() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Box size={11} /> Coming Soon
        </span>
        <h1 id="subdomain" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          서브도메인 개설 (Maza Zero)
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">Maza Zero</strong>는 도메인, 호스팅, 설치 없이 마자가 직접 운영하는 블로그를 즉시 개설해 드리는 서비스입니다. 현재 준비 중입니다.
        </p>
      </div>

      <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl text-white space-y-4 mb-10 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full" />
        <Clock size={24} className="relative z-10" />
        <p className="text-xl font-black relative z-10">준비 중 (Beta 예정)</p>
        <p className="text-indigo-100 text-sm font-medium leading-relaxed relative z-10">
          Maza Zero 서비스는 현재 내부 개발 중입니다. 출시 알림을 받으시려면 마자 스튜디오 대시보드에서 [알림 신청] 버튼을 눌러주세요.
        </p>
      </div>

      <h2 id="what-is" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        Maza Zero란?
      </h2>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Globe, title: '즉시 개설', desc: '도메인 구매 없이 .mazastory.com 서브도메인으로 블로그가 즉시 생성됩니다.' },
          { icon: Zap, title: 'Zero 설정', desc: '워드프레스 설치, 테마 선택, 플러그인 설정이 전혀 필요 없습니다.' },
          { icon: Box, title: '완전 자동화', desc: '개설 즉시 Maza 오토파일럿과 연결되어 바로 글 발행이 시작됩니다.' },
        ].map((card, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <card.icon size={20} className="text-indigo-500 mb-3" />
            <p className="text-sm font-black text-slate-800 mb-1">{card.title}</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      <h2 id="existing-alternative" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        지금 당장 시작하려면?
      </h2>
      <p className="text-sm text-slate-600 font-medium mb-4">
        Maza Zero를 기다리는 동안, 아래 방법 중 하나로 즉시 시작할 수 있습니다.
      </p>
      <div className="space-y-3 mb-8">
        {[
          { platform: '티스토리', desc: '무료, 한국어 SEO에 최적화, 가장 빠른 시작', badge: '추천' },
          { platform: '블로그스팟', desc: '구글 직영, 애드센스 연동 최고 속도', badge: '빠른 승인' },
          { platform: '워드프레스', desc: '최고의 커스터마이징, 별도 호스팅 필요', badge: '고급' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-sm font-black text-slate-800 flex-1">{item.platform}</span>
            <span className="text-xs text-slate-400 font-medium flex-1 hidden md:block">{item.desc}</span>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">{item.badge}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
