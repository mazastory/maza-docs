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

      {/* NEW: 마자 스튜디오 3대 방어막 (User Request 1,2,3) */}
      <div className="mb-14 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
        <h2 id="maza-architecture" className="text-xl font-black tracking-tight text-indigo-900 mb-4 flex items-center gap-2">
          <Globe size={18} className="text-indigo-600" />
          마자 스튜디오의 애드센스 100% 승인 아키텍처
        </h2>
        <p className="text-sm text-indigo-800 font-medium leading-relaxed mb-5">
          지난 수많은 거절 데이터를 학습하여, 구글이 거절할 수 없도록 시스템 자체에 강력한 '방어막'을 설계했습니다. 마자 스튜디오는 다음 3가지 핵심 로직으로 애드센스 승인을 보장합니다.
        </p>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-indigo-50">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <AlertTriangle size={14} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 mb-1">1. 무자비한 자동 삭제 (Auto-Delete) 프로토콜</p>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">글자 수 1300자 미만, 검증 스코어 70점 미만, SEO 최적화 실패, 이미지 누락 등 구글 봇에게 '가치 없는 콘텐츠(Low Value Content)'로 감점당할 가능성이 조금이라도 있는 글은 발행 전 시스템이 가차 없이 영구 삭제합니다.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-indigo-50">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <CheckCircle size={14} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 mb-1">2. 근거 기반 그라운딩 (Evidence-based Grounding)</p>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">AI 특유의 뜬구름 잡는 소리를 배제하고, 구글 실시간 검색을 통해 확인된 팩트와 출처를 기반으로 전문성(E-E-A-T)을 갖춘 정보성 글만을 추출합니다.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-indigo-50">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              <Clock size={14} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 mb-1">3. 사람 같은 발행 패턴 (Human-like Jitter)</p>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">기계처럼 정각에 글을 쏟아내는 어뷰징 행위를 막기 위해, 시스템 스케줄러가 인간의 행동 패턴을 모방하여 랜덤한 시간(Jitter)에 유기적으로 글을 발행합니다.</p>
            </div>
          </div>
        </div>
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
