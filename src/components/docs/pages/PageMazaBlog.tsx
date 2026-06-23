import { Box, Server, Shield, Globe, Terminal, Loader2 } from 'lucide-react';

export default function PageMazaBlog() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Box size={11} /> Hosting
        </span>
        <h1 id="maza-blog" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          마자블로그 만들기
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">MazaBlog</strong>는 마자 스튜디오에서 직접 호스팅하는 설치형 블로그입니다.
          도메인 구매나 서버 세팅 없이 버튼 클릭 한 번으로 나만의 수익화 블로그를 개설할 수 있습니다.
        </p>
      </div>

      {/* 장점 */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl">
          <Server size={20} className="text-indigo-500 mb-3" />
          <h3 className="text-sm font-black text-slate-800 mb-2">원클릭 개설</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">복잡한 워드프레스 서버 세팅이나 DB 연결 없이 즉시 블로그가 생성됩니다.</p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl">
          <Shield size={20} className="text-emerald-500 mb-3" />
          <h3 className="text-sm font-black text-slate-800 mb-2">무료 SSL / 보안</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">HTTPS 보안 인증서가 자동으로 발급 및 갱신되며, 강력한 보안이 유지됩니다.</p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl">
          <Terminal size={20} className="text-amber-500 mb-3" />
          <h3 className="text-sm font-black text-slate-800 mb-2">SEO 최적화 기본 내장</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">구글이 좋아하는 가장 빠르고 가벼운 테마와 메타태그 구조가 미리 적용되어 있습니다.</p>
        </div>
      </div>

      <h2 id="how-to-create" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        개설 순서
      </h2>
      <div className="space-y-4 mb-12">
        {[
          { step: '01', title: '마이 사이트 접속', desc: '마자 스튜디오 대시보드의 좌측 메뉴에서 [마이 사이트] 탭으로 이동합니다.' },
          { step: '02', title: '사이트 추가 버튼 클릭', desc: '우측 상단의 [+ 사이트 추가] 버튼을 클릭한 뒤, [마자 블로그(자동 호스팅)] 옵션을 선택합니다.' },
          { step: '03', title: '서브도메인 이름 입력', desc: '원하는 주소(예: mymoney, healthtips)를 영문으로 입력합니다. 최종 주소는 "입력한이름.mazablog.com" 형태로 생성됩니다.' },
          { step: '04', title: '생성 대기 (SSL 발급)', desc: '생성 버튼을 누르면 서버가 할당되고 인증서가 발급됩니다. 약 1~3분 정도 소요되며 대기 모달창이 표시됩니다.' }
        ].map((item, idx) => (
          <div key={idx} className="flex gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black shrink-0">
              {item.step}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 mb-10">
        <Loader2 size={18} className="text-amber-500 shrink-0 mt-0.5 animate-spin" />
        <div>
          <p className="text-sm font-black text-amber-800 mb-1">인증서 발급 관련 안내</p>
          <p className="text-xs text-amber-700 font-medium leading-relaxed">
            블로그를 막 개설한 직후 1~5분 동안은 접속 시 "안전하지 않은 사이트"라는 브라우저 경고가 뜰 수 있습니다. 이는 전 세계 SSL 발급 기관에서 인증서를 동기화하는 데 걸리는 시간입니다. 잠시 후 새로고침하시면 자물쇠 아이콘(HTTPS)이 정상적으로 표시됩니다.
          </p>
        </div>
      </div>
    </article>
  );
}
