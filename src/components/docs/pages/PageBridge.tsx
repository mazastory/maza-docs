import { Sparkles, Zap, Globe, FileText, CheckCircle } from 'lucide-react';

export default function PageBridge() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Feature
        </span>
        <h1 id="bridge" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          Maza Bridge 활용
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">Maza Bridge</strong>는 크롬 익스텐션의 핵심 기능입니다.
          블로그 플랫폼 위에서 작동하는 스마트 컨텍스트 패널로, AI 글을 즉시 발행하고 관리합니다.
        </p>
      </div>

      <h2 id="what-bridge-does" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        Maza Bridge가 하는 일
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {[
          { icon: Zap, title: '자동 발행 실행', desc: 'Maza Studio에서 예약된 글을 정해진 시각에 블로그 플랫폼에 자동으로 게시합니다.' },
          { icon: Globe, title: '플랫폼 상태 감지', desc: '현재 접속 중인 블로그 플랫폼(티스토리/워드프레스/블로그스팟)을 자동으로 감지하고 최적화된 발행 방식을 선택합니다.' },
          { icon: FileText, title: '글 에디터 조작', desc: '티스토리 글쓰기 화면에서 제목, 본문, 카테고리, 태그를 자동으로 입력하고 발행 버튼을 클릭합니다.' },
          { icon: CheckCircle, title: '발행 결과 보고', desc: '발행 완료 후 URL과 상태를 Maza Studio에 즉시 전송하여 관제 화면에서 확인할 수 있게 합니다.' },
        ].map((card, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <card.icon size={18} className="text-indigo-500 mb-2" />
            <p className="text-sm font-black text-slate-800 mb-1">{card.title}</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      <h2 id="sidebar-panel" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        사이드바 패널 기능
      </h2>
      <p className="text-sm text-slate-500 font-medium mb-4">
        크롬에서 Maza Bridge 아이콘을 클릭하면 사이드바 패널이 열립니다. 여기서 다음 기능을 사용할 수 있습니다.
      </p>
      <div className="space-y-3 mb-10">
        {[
          { label: '현재 사이트 연동 상태', desc: '방문 중인 블로그와 마자의 연결 상태를 실시간으로 표시합니다.' },
          { label: '수동 발행 트리거', desc: '예약 발행을 기다리지 않고 즉시 발행을 실행할 수 있습니다.' },
          { label: '발행 이력', desc: '최근 발행한 글 목록과 성공/실패 상태를 확인합니다.' },
          { label: 'Google 서비스 링크', desc: '서치콘솔, GA4, 애드센스로 빠르게 이동하는 단축 링크를 제공합니다.' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-sm font-black text-slate-800">{item.label}</span>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="troubleshoot" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        자주 발생하는 문제
      </h2>
      <div className="space-y-4 mb-8">
        {[
          { q: '아이콘이 회색이에요', a: 'Maza Studio에 로그인 후 익스텐션을 클릭하면 자동으로 연결됩니다.' },
          { q: '티스토리 자동 발행이 안 돼요', a: '크롬에서 티스토리에 로그인된 상태인지 확인하세요. 로그인 세션이 만료되면 발행이 중단됩니다.' },
          { q: '익스텐션이 아예 안 보여요', a: '크롬 퍼즐 아이콘 클릭 → Maza Bridge 항목 우측 핀 아이콘을 클릭하여 고정하면 항상 표시됩니다.' },
        ].map((item, i) => (
          <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <p className="text-sm font-black text-slate-800 mb-1">Q. {item.q}</p>
            <p className="text-xs text-slate-500 font-medium">A. {item.a}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
