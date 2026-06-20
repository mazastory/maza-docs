import { Cpu, Activity, BarChart3, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function PageAutopilot() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Cpu size={11} /> Feature
        </span>
        <h1 id="autopilot" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          오토파일럿
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">Autopilot Stage</strong>는 마자의 핵심 관제 센터입니다.
          니치 발굴부터 글 발행까지 전체 파이프라인이 여기서 시작되고 모니터링됩니다.
        </p>
      </div>

      <h2 id="overview" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        전체 흐름
      </h2>
      <div className="flex flex-col md:flex-row gap-2 mb-10 items-center">
        {[
          { icon: Activity, label: '니치 헌터', desc: '수익 키워드 발굴', color: 'bg-amber-100 text-amber-700' },
          { icon: Cpu, label: 'AI 라이터', desc: '글 자동 집필', color: 'bg-indigo-100 text-indigo-700' },
          { icon: Clock, label: 'W-05 스케줄', desc: '3시간 간격 배차', color: 'bg-rose-100 text-rose-700' },
          { icon: CheckCircle, label: '자동 발행', desc: 'RPA / API 업로드', color: 'bg-emerald-100 text-emerald-700' },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex-1 md:flex-none p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2 ${step.color}`}>
                <step.icon size={16} />
              </div>
              <p className="text-xs font-black text-slate-800">{step.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
            </div>
            {i < 3 && <div className="hidden md:block text-slate-300 text-xl font-light">→</div>}
          </div>
        ))}
      </div>

      <h2 id="niche-writer" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        니치 라이터 (Niche Writer)
      </h2>
      <p className="text-sm text-slate-600 font-medium mb-5">
        오토파일럿의 첫 탭. 수익 키워드를 선택하고 글 생성을 시작합니다.
      </p>
      <div className="space-y-3 mb-10">
        {[
          { title: '키워드 금고 선택', desc: '사전 검증된 고수익 키워드 목록에서 원하는 키워드를 선택합니다.' },
          { title: '글 수량 & 발행 간격 설정', desc: '생성할 글의 수와 발행 간격(최소 3시간)을 설정합니다.' },
          { title: '블루프린트 선택', desc: '글의 구성 방식(시리즈형, 단독형, 리뷰형 등)을 선택합니다.' },
          { title: '생성 시작', desc: '[생성 시작] 버튼을 누르면 AI가 순차적으로 글을 집필하고 예약 발행 큐에 넣습니다.' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
            <div>
              <p className="text-sm font-black text-slate-800 mb-0.5">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="monitoring" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        발행 현황 모니터링
      </h2>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: BarChart3, title: '대기 중', desc: '생성 완료 후 발행 예약된 글 목록' },
          { icon: CheckCircle, title: '발행 완료', desc: '성공적으로 블로그에 업로드된 글 수' },
          { icon: AlertTriangle, title: '실패 / 재시도', desc: '일시적 오류로 실패한 글. 자동으로 재시도됨' },
        ].map((card, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <card.icon size={18} className="text-indigo-500 mb-2" />
            <p className="text-sm font-black text-slate-800 mb-1">{card.title}</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
        <p className="text-sm font-black text-indigo-800 mb-1">💡 팁: 불도저 큐 정책</p>
        <p className="text-xs text-indigo-700 font-medium leading-relaxed">
          대량 생성 중 특정 글에서 오류가 발생해도 전체 큐가 멈추지 않습니다. 실패한 건만 <code className="bg-indigo-100 px-1 rounded">FAILED</code> 상태로 표시되고 다음 글 생성이 즉시 진행됩니다.
        </p>
      </div>
    </article>
  );
}
