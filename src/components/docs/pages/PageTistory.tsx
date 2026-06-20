import { LayoutTemplate, AlertTriangle, CheckCircle, Zap, Shield } from 'lucide-react';

export default function PageTistory() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <LayoutTemplate size={11} /> Platform
        </span>
        <h1 id="tistory" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          티스토리 세팅
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          마자는 <strong className="text-slate-900">RPA(브라우저 자동화)</strong> 방식으로 티스토리에 글을 발행합니다.
          별도 API 키 없이 Maza Bridge 익스텐션만 설치되어 있으면 됩니다.
        </p>
      </div>

      <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3 mb-10">
        <Zap size={18} className="text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-indigo-800 mb-1">RPA 방식이란?</p>
          <p className="text-xs text-indigo-700 font-medium leading-relaxed">
            마치 사람이 직접 키보드를 치는 것처럼, Maza Bridge가 티스토리 글쓰기 화면을 자동으로 조작하여 글을 작성·발행합니다. 공식 API 없이도 완벽히 동작합니다.
          </p>
        </div>
      </div>

      <h2 id="prerequisites" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        사전 준비
      </h2>
      <div className="space-y-3 mb-10">
        {[
          'Maza Bridge 크롬 익스텐션 설치 완료',
          '티스토리 계정 로그인 상태 유지 (크롬에서)',
          '마자 스튜디오 마법사에서 플랫폼을 [티스토리]로 선택',
          '블로그 주소 입력 완료 (예: myblog.tistory.com)',
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <CheckCircle size={14} className="text-emerald-500 shrink-0" />
            <span className="text-sm font-medium text-slate-700">{item}</span>
          </div>
        ))}
      </div>

      <h2 id="settings" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        티스토리 권장 블로그 설정
      </h2>
      <p className="text-sm text-slate-500 font-medium mb-5">애드센스 승인율을 높이기 위해 아래 설정을 사전에 맞춰두세요.</p>
      <div className="space-y-3 mb-10">
        {[
          { label: '블로그 공개 여부', value: '전체 공개', path: '관리 → 기본 설정 → 블로그 공개' },
          { label: '모바일 최적화', value: '자동 (기본값)', path: '관리 → 꾸미기 → 모바일 설정' },
          { label: '카테고리 구성', value: '니치 기반 3~5개 카테고리', path: '관리 → 카테고리' },
          { label: '댓글 설정', value: '로그인 사용자만 (스팸 방지)', path: '관리 → 댓글·방명록' },
        ].map((row, i) => (
          <div key={i} className="flex flex-wrap gap-3 items-start p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-800">{row.label}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{row.path}</p>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">{row.value}</span>
          </div>
        ))}
      </div>

      <h2 id="publish-flow" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        자동 발행 동작 방식
      </h2>
      <div className="space-y-3 mb-10">
        {[
          { n: '1', t: '발행 스케줄 확인', d: '오토파일럿이 W-05 규칙(3시간 간격)에 맞춰 발행 시각이 되면 Maza Bridge를 호출합니다.' },
          { n: '2', t: '글쓰기 화면 진입', d: 'Maza Bridge가 티스토리 글쓰기 탭을 열거나 포커스합니다.' },
          { n: '3', t: '제목 & 본문 입력', d: 'AI가 생성한 제목과 HTML 본문을 자동으로 에디터에 삽입합니다.' },
          { n: '4', t: '카테고리 & 태그 설정', d: '사전에 설정된 카테고리와 키워드 기반 태그를 자동으로 선택합니다.' },
          { n: '5', t: '발행 완료', d: '[발행] 버튼을 자동으로 클릭하고, 발행된 URL을 마자 시스템에 저장합니다.' },
        ].map((s) => (
          <div key={s.n} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-black flex items-center justify-center shrink-0">{s.n}</span>
            <div>
              <p className="text-sm font-black text-slate-800 mb-0.5">{s.t}</p>
              <p className="text-xs text-slate-500 font-medium">{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
        <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-rose-700 mb-1">주의사항</p>
          <p className="text-xs text-rose-600 font-medium leading-relaxed">
            자동 발행 중에는 해당 티스토리 탭을 닫거나 다른 조작을 하지 마세요. 발행이 중단될 수 있습니다. 발행 중 브라우저를 최소화하는 것은 무방합니다.
          </p>
        </div>
      </div>
    </article>
  );
}
