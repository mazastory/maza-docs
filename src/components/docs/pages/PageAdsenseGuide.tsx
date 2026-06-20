import { Trophy, CheckCircle, AlertTriangle, Clock, Globe } from 'lucide-react';

export default function PageAdsenseGuide() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Trophy size={11} /> AdSense
        </span>
        <h1 id="adsense-guide" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          애드센스 신청 가이드
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          신청 전 체크리스트부터 코드 삽입, 심사 대기 기간까지
          <strong className="text-slate-900"> 애드센스 신청 전체 프로세스</strong>를 안내합니다.
        </p>
      </div>

      <h2 id="checklist" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        신청 전 체크리스트
      </h2>
      <div className="space-y-3 mb-10">
        {[
          { item: '포스트 30개 이상 발행', critical: true },
          { item: '글 1개당 최소 700자 이상', critical: true },
          { item: '소개 페이지 (About) 작성', critical: true },
          { item: '개인정보처리방침 페이지 작성', critical: true },
          { item: '연락처 페이지 작성', critical: false },
          { item: '구글 서치콘솔 등록 & 색인 30개 이상', critical: true },
          { item: '블로그 개설 후 최소 2주 경과', critical: false },
          { item: '커스텀 도메인 (권장, 필수 아님)', critical: false },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <CheckCircle size={14} className={row.critical ? 'text-emerald-500' : 'text-slate-300'} />
            <span className="text-sm font-medium text-slate-700 flex-1">{row.item}</span>
            {row.critical && <span className="text-[9px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">필수</span>}
          </div>
        ))}
      </div>

      <h2 id="apply-steps" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        신청 절차
      </h2>
      <div className="space-y-4 mb-10">
        {[
          { step: '01', title: '애드센스 계정 생성', desc: 'adsense.google.com 접속 → 구글 계정으로 가입. 블로그 운영 중인 구글 계정과 동일한 계정 사용을 권장합니다.' },
          { step: '02', title: '블로그 URL 등록', desc: '[사이트 추가]에서 운영 중인 블로그 URL을 입력합니다. 티스토리는 커스텀 도메인이 있으면 그 도메인을 입력하세요.' },
          { step: '03', title: '애드센스 코드 삽입', desc: '발급된 &lt;script&gt; 코드를 블로그의 &lt;head&gt; 태그 안에 삽입합니다. 티스토리는 관리 → 꾸미기 → 스킨 편집 → HTML에서 삽입합니다.' },
          { step: '04', title: '심사 제출 & 대기', desc: '코드 삽입 후 [검토 요청] 버튼을 클릭합니다. 심사 기간은 보통 1~4주이며, 이 기간 중에도 발행을 계속하세요.' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 bg-amber-100 text-amber-700">
              {item.step}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="rejection" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        불승인 원인 & 대처
      </h2>
      <div className="space-y-3 mb-10">
        {[
          { cause: '콘텐츠 불충분', fix: '글 수를 50개 이상으로 늘리고, 각 글의 질과 양을 높입니다.' },
          { cause: '복사 콘텐츠', fix: '타 사이트와 중복되는 글을 삭제하거나 리라이팅합니다.' },
          { cause: '정책 위반 페이지', fix: '성인 콘텐츠, 도박, 불법 콘텐츠 등 정책 위반 요소를 제거합니다.' },
          { cause: '사이트 탐색 불가', fix: '기본 정보 페이지(소개, 개인정보처리방침)가 정상 접근되는지 확인합니다.' },
        ].map((item, i) => (
          <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="flex items-start gap-2 mb-1">
              <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm font-black text-slate-800">{item.cause}</p>
            </div>
            <p className="text-xs text-slate-500 font-medium ml-5">{item.fix}</p>
          </div>
        ))}
      </div>

      <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
        <Clock size={18} className="text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-emerald-800 mb-1">재신청 대기 기간</p>
          <p className="text-xs text-emerald-700 font-medium leading-relaxed">
            불승인 후 원인을 보완하고 재신청할 수 있습니다. 최소 30일 이상 콘텐츠를 추가한 후 재신청하는 것을 권장합니다.
          </p>
        </div>
      </div>
    </article>
  );
}
