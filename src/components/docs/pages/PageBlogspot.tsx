import { Server, CheckCircle, Info } from 'lucide-react';

export default function PageBlogspot() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Server size={11} /> Platform
        </span>
        <h1 id="blogspot" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          블로그스팟 세팅
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          블로그스팟(Blogger)은 <strong className="text-slate-900">Google OAuth</strong>를 통해 연동됩니다.
          구글 로그인 하나로 마자 스튜디오와 즉시 연결됩니다.
        </p>
      </div>

      <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3 mb-10">
        <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-blue-800 mb-1">블로그스팟의 장점</p>
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            Google이 직접 운영하는 플랫폼이라 구글 서치콘솔·애드센스와의 연동이 가장 빠릅니다. 별도 호스팅 비용이 없고, 애드센스 승인 시 .blogspot.com 서브도메인에서 바로 광고가 활성화됩니다.
          </p>
        </div>
      </div>

      <h2 id="connect" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        연동 방법
      </h2>
      <div className="space-y-4 mb-10">
        {[
          { step: '01', title: '블로그스팟 블로그 생성', desc: 'blogger.com에서 구글 계정으로 로그인하고 새 블로그를 생성합니다. 블로그 주소(예: myblog.blogspot.com)를 메모합니다.' },
          { step: '02', title: '마자 스튜디오 마법사 실행', desc: '마자 스튜디오 [내 사이트] → [블로그 자동화 시작하기]에서 플랫폼을 [블로그스팟]으로 선택합니다.' },
          { step: '03', title: '구글 계정 권한 승인', desc: '구글 OAuth 화면에서 Blogger API 접근을 승인합니다. 블로그를 생성한 구글 계정과 동일한 계정으로 승인하세요.' },
          { step: '04', title: '블로그 선택', desc: '해당 구글 계정에 연결된 블로그 목록이 표시됩니다. 자동 발행할 블로그를 선택합니다.' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 bg-emerald-100 text-emerald-700">
              {item.step}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="custom-domain" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        커스텀 도메인 연결 (선택)
      </h2>
      <p className="text-sm text-slate-500 font-medium mb-4">
        .blogspot.com 주소 대신 직접 구매한 도메인(예: myblog.com)을 연결할 수 있습니다.
        애드센스 승인에 커스텀 도메인이 필수는 아니지만, 브랜드 신뢰도를 높이는 데 도움이 됩니다.
      </p>
      <div className="space-y-3 mb-8">
        {[
          'Blogger 관리 → 설정 → 게시 → 맞춤 도메인 입력',
          '도메인 DNS 설정에서 CNAME 레코드 추가 (ghs.google.com)',
          '적용까지 최대 24~72시간 소요',
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
