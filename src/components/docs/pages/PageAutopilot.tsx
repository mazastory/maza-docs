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

      <h2 id="control-policies" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        오토파일럿 제어 정책
      </h2>
      <p className="text-sm text-slate-600 font-medium mb-5">
        1.4.0 버전부터 마이 사이트 설정 패널에서 블로그별로 세밀한 발행 정책을 제어할 수 있습니다.
      </p>
      <div className="space-y-4 mb-10">
        <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Cpu size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-1">발행 간격 모드 (Speed vs Safe)</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">블로그의 운영 성격과 애드센스 승인 상태에 따라 발행 간격을 조절합니다.</p>
            <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
              <li><strong>스피드 모드 (1시간 이하):</strong> 즉시 트래픽 확보가 필요한 뉴스, 이슈 블로그에 적합합니다. 단기간 노출 극대화를 노릴 때 사용합니다.</li>
              <li><strong>안전 모드 (W-05 / 3시간 이상):</strong> 구글의 스팸 어뷰징 필터를 피하기 위해 사람과 같은 주기로 천천히 글을 발행합니다. 신생 블로그나 애드센스 심사 중일 때 필수입니다.</li>
            </ul>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-1">심야 휴식 시간 (Quiet Hours)</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">실제 사람이 운영하는 블로그처럼 보이기 위해 특정 시간대(예: 새벽 1시~6시)에는 글 발행을 멈추는 기능입니다.</p>
            <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
              <li>오토파일럿이 이 시간대에 배정된 글은 <strong>일시 대기(On Hold)</strong> 상태로 두고, 휴식 시간이 끝나면 자동으로 발행을 재개합니다.</li>
            </ul>
          </div>
        </div>
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
        <p className="text-sm font-black text-indigo-800 mb-1">💡 팁: Rule 7 실패 재배치 정책</p>
        <p className="text-xs text-indigo-700 font-medium leading-relaxed">
          대량 발행 중 네트워크 오류나 API 제한으로 생성/발행에 실패하더라도 전체 파이프라인이 멈추지 않습니다. 실패한 작업은 즉시 큐(Queue)의 맨 뒤로 이동하여 후순위로 배치되며, 남은 작업들을 먼저 처리한 뒤 나중에 백그라운드 엔진이 자동으로 <strong>재시도(Retry)</strong>를 수행합니다. 이를 통해 무인(Unmanned) 관리가 가능해집니다.
        </p>
      </div>
    </article>
  );
}
