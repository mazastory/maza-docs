import { Shield, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PageW05() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Shield size={11} /> Safety Protocol
        </span>
        <h1 id="w05" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          W-05 안전 프로토콜
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">W-05</strong>는 마자의 핵심 안전 규칙입니다.
          모든 자동 발행은 최소 3시간(10,800초) 간격을 유지해야 합니다.
        </p>
      </div>

      <div className="p-8 bg-rose-600 text-white rounded-3xl mb-10 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full" />
        <Shield size={32} className="mb-4" />
        <p className="text-2xl font-black mb-2">최소 3시간 간격</p>
        <p className="text-rose-100 text-sm font-medium leading-relaxed">
          W-05는 Waiting 05 (5단계 대기 프로토콜)의 약자입니다. 구글의 어뷰징 감지 알고리즘을 우회하는 가장 안전한 발행 간격으로, 수백 개 블로그의 실전 데이터를 기반으로 설정되었습니다.
        </p>
      </div>

      <h2 id="why-3hours" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        왜 3시간인가?
      </h2>
      <div className="space-y-4 mb-10">
        {[
          { title: '구글 크롤러 패턴 분석', desc: '구글봇은 통상적으로 3~6시간 주기로 블로그를 재방문합니다. 이 주기에 맞춰 발행하면 각 글이 "자연스러운 작성 흐름"으로 인식됩니다.' },
          { title: '어뷰징 필터 우회', desc: '단시간에 다량의 글이 업로드되면 구글 스팸 필터가 자동으로 감지하여 블로그 전체를 디인덱싱할 수 있습니다. 3시간 간격은 이 위험을 원천 차단합니다.' },
          { title: '티스토리 정책 준수', desc: '티스토리는 자체적으로도 단시간 대량 발행 계정에 제한을 가하는 정책을 운영합니다. W-05는 이 정책을 자동으로 준수합니다.' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <Shield size={14} className="text-rose-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-black text-slate-800 mb-0.5">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="schedule-logic" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        발행 스케줄 계산 방식
      </h2>
      <div className="p-5 bg-slate-900 text-slate-300 rounded-2xl font-mono text-xs mb-10 space-y-1">
        <p className="text-slate-400"># 발행 예약 시각 계산 로직</p>
        <p>마지막 발행 시각 = <span className="text-emerald-400">lastPublishAt</span></p>
        <p>다음 발행 시각 = <span className="text-emerald-400">lastPublishAt</span> + <span className="text-amber-400">3시간</span></p>
        <p className="text-slate-400 mt-2"># 플랫폼별 독립 계산</p>
        <p>티스토리 A의 예약 ≠ 워드프레스 B의 예약에 영향 없음</p>
        <p className="text-slate-400 mt-2"># 일일 최대 제한</p>
        <p>하루 최대 <span className="text-rose-400">5개</span> 발행. 초과 시 다음 날로 자동 분산</p>
      </div>

      <h2 id="bypass-risk" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        W-05를 무시하면?
      </h2>
      <div className="space-y-3 mb-8">
        {[
          '블로그 전체 디인덱싱 (검색 결과에서 사라짐)',
          '구글 애드센스 계정 정지',
          '티스토리 계정 일시 정지 또는 영구 폐쇄',
          '재신청 후에도 심사 기간 대폭 연장',
        ].map((risk, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
            <AlertTriangle size={14} className="text-rose-500 shrink-0" />
            <span className="text-sm font-medium text-rose-700">{risk}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
