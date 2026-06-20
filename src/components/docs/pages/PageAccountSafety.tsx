import { ShieldCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function PageAccountSafety() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <ShieldCheck size={11} /> Safety
        </span>
        <h1 id="account-safety" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          계정 보호 가이드
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          블로그 계정과 애드센스 계정은 한 번 정지되면 복구가 매우 어렵습니다.
          <strong className="text-slate-900"> 절대 하지 말아야 할 행동</strong>과 안전 수칙을 숙지하세요.
        </p>
      </div>

      <h2 id="never-do" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        절대 하면 안 되는 행동
      </h2>
      <div className="space-y-3 mb-10">
        {[
          { action: '하루 5개 이상 발행', reason: '구글 및 티스토리 어뷰징 필터에 탐지됩니다.' },
          { action: '타 사이트 콘텐츠 무단 복사', reason: '중복 콘텐츠 페널티로 색인 자체가 안 됩니다.' },
          { action: '자신의 광고 클릭 (셀프 클릭)', reason: '애드센스 영구 정지의 가장 흔한 원인입니다.' },
          { action: '지인/가족에게 클릭 유도', reason: '비정상 클릭 패턴으로 탐지되어 계정이 정지됩니다.' },
          { action: '클릭팜 서비스 구매', reason: 'IP 패턴 분석으로 100% 탐지됩니다. 환불도 불가합니다.' },
          { action: '성인·도박·불법 콘텐츠 게시', reason: '구글 정책 위반으로 즉시 계정 정지 + 영구 금지 가능합니다.' },
          { action: 'VPN으로 다중 계정 운영', reason: '애드센스는 1인 1계정 원칙입니다. 위반 시 모든 계정 정지됩니다.' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl border border-rose-100">
            <XCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-rose-700 mb-0.5">{item.action}</p>
              <p className="text-xs text-rose-600 font-medium">{item.reason}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="best-practices" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        계정 보호 모범 사례
      </h2>
      <div className="space-y-3 mb-10">
        {[
          'W-05 프로토콜 준수 (최소 3시간 발행 간격)',
          '구글 2단계 인증 활성화',
          '애드센스 결제 계좌 정보 최신 상태 유지',
          '월 1회 서치콘솔에서 수동 링크 스팸 거부 파일 업데이트',
          '외부 링크 프로필 정기 모니터링 (Google Search Console → 링크)',
          '저품질 글 발행 후 빠른 삭제보다는 수정·보완 권장',
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <CheckCircle size={14} className="text-emerald-500 shrink-0" />
            <span className="text-sm font-medium text-slate-700">{item}</span>
          </div>
        ))}
      </div>

      <h2 id="if-suspended" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        계정이 정지되었다면?
      </h2>
      <div className="space-y-4 mb-8">
        {[
          { step: '01', title: '정지 사유 파악', desc: '수신된 이메일에서 정지 사유를 확인합니다. 구글 고객센터 → AdSense 정책 위반 도움말을 참조하세요.' },
          { step: '02', title: '위반 사항 수정', desc: '정지 사유에 해당하는 콘텐츠나 행동을 즉시 수정합니다. 문제가 완전히 해결되기 전에 이의 신청을 하면 거부됩니다.' },
          { step: '03', title: '이의 신청 (Appeal)', desc: '수정 완료 후 AdSense 계정 내 [이의 신청] 양식을 작성합니다. 구체적인 개선 사항을 명시하세요.' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 bg-rose-100 text-rose-700">
              {item.step}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
