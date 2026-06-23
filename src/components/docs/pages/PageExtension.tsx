import { Puzzle, ExternalLink, Download, CheckCircle, AlertTriangle, Globe, Zap } from 'lucide-react';

export default function PageExtension() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Puzzle size={11} /> Setup
        </span>
        <h1 id="extension" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          익스텐션 설치 <span className="text-xl text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full not-italic">웹스토어 정식(1.4.0+)</span>
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">Maza Bridge</strong>는 크롬 브라우저에 설치하는 확장 프로그램입니다.
          크롬 웹스토어 심사를 통과한 정식 버전으로 클릭 한 번에 안전하게 설치할 수 있습니다.
        </p>
      </div>

      {/* 요구사항 */}
      <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 mb-10">
        <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-amber-800 mb-1">설치 전 확인사항</p>
          <ul className="text-xs text-amber-700 font-medium space-y-1 list-disc list-inside">
            <li>Google Chrome 브라우저 필수 (버전 무관)</li>
            <li>Maza Studio 계정 로그인 선행 필요</li>
            <li>Windows / macOS / Linux 모두 지원</li>
          </ul>
        </div>
      </div>

      <h2 id="install-steps" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        설치 방법 (3단계)
      </h2>

      <div className="space-y-4 mb-12">
        {[
          {
            step: '01',
            title: 'Chrome 웹스토어 접속',
            desc: '크롬 브라우저에서 Chrome 웹스토어의 Maza Bridge 확장 프로그램 페이지로 이동합니다. (또는 대시보드의 설치 링크 클릭)',
            color: 'bg-indigo-100 text-indigo-700',
          },
          {
            step: '02',
            title: 'Chrome에 추가',
            desc: '우측 상단의 [Chrome에 추가] 버튼을 클릭하여 익스텐션을 브라우저에 설치합니다.',
            color: 'bg-emerald-100 text-emerald-700',
          },
          {
            step: '03',
            title: 'Maza Studio 계정 연결',
            desc: '설치 후 익스텐션 아이콘을 클릭하고, mazastudio.kr 화면이 열리면 구글 계정으로 로그인하여 연결을 완료합니다.',
            color: 'bg-sky-100 text-sky-700',
          },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${item.color}`}>
              {item.step}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="verify" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        설치 확인
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <CheckCircle size={18} className="text-emerald-500 mb-2" />
          <p className="text-sm font-black text-emerald-800">성공 시</p>
          <p className="text-xs text-emerald-700 font-medium mt-1">크롬 우측 상단 퍼즐 아이콘 클릭 시 <strong>Maza Bridge</strong> 항목이 보입니다. 아이콘이 파란색이면 정상 연결 상태입니다.</p>
        </div>
        <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl">
          <AlertTriangle size={18} className="text-rose-500 mb-2" />
          <p className="text-sm font-black text-rose-800">문제 발생 시</p>
          <p className="text-xs text-rose-700 font-medium mt-1">아이콘이 회색이면 로그인이 필요합니다. 마자 스튜디오 탭을 열고 로그인 후 익스텐션을 클릭해 재연결하세요.</p>
        </div>
      </div>

      <h2 id="permissions" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        권한 안내
      </h2>
      <div className="space-y-3 mb-8">
        {[
          { icon: Globe, label: '사이트 접근 권한', desc: '티스토리, 워드프레스, 블로그스팟 글쓰기 화면에서 자동 발행을 수행하기 위해 필요합니다.' },
          { icon: Zap, label: '클립보드 접근', desc: '생성된 글 내용을 편집기에 자동 붙여넣기 할 때 사용됩니다.' },
          { icon: ExternalLink, label: '탭 관리', desc: '발행 시 올바른 탭을 찾아 자동으로 조작하기 위해 필요합니다.' },
        ].map((p, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p.icon size={14} className="text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-sm font-black text-slate-800">{p.label}</span>
              <span className="text-xs text-slate-500 font-medium"> — {p.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
