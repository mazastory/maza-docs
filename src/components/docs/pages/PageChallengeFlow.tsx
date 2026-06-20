import { Trophy, Target, CheckCircle, Clock, ArrowRight, AlertTriangle } from 'lucide-react';

export default function PageChallengeFlow() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Trophy size={11} /> AdSense Challenge
        </span>
        <h1 id="challenge-flow" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          챌린지 성공 순서도
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          구글 애드센스 승인은 순서를 지키는 것이 전부입니다.
          마자가 검증한 <strong className="text-slate-900">7단계 성공 로드맵</strong>을 따르면 최단 60일 내 승인이 가능합니다.
        </p>
      </div>

      <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 mb-10">
        <Clock size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-amber-800 mb-1">예상 소요 기간</p>
          <p className="text-xs text-amber-700 font-medium">최소 60일 ~ 최대 120일. 블로그 개설 시점, 니치 경쟁도, 콘텐츠 품질에 따라 달라집니다.</p>
        </div>
      </div>

      <h2 id="roadmap" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        7단계 성공 순서도
      </h2>
      <div className="relative space-y-0 mb-12">
        {[
          {
            phase: '1단계', period: 'D-Day', title: '블로그 개설 & 기초 세팅',
            items: ['플랫폼 선택 (티스토리 / 블로그스팟 추천)', '기본 정보 페이지 작성 (소개, 연락처, 개인정보처리방침)', '카테고리 3~5개 구성', '커스텀 도메인 연결 (선택)'],
            color: 'border-indigo-200 bg-indigo-50',
          },
          {
            phase: '2단계', period: 'D+1 ~ D+7', title: '구글 서비스 연결',
            items: ['구글 서치콘솔 등록 & 사이트맵 제출', 'GA4 연결', '색인 요청 (메인 페이지 + 기본 정보 페이지)'],
            color: 'border-sky-200 bg-sky-50',
          },
          {
            phase: '3단계', period: 'D+7 ~ D+30', title: '콘텐츠 집중 생산 (최소 30포스트)',
            items: ['마자 오토파일럿으로 W-05 규칙 준수 발행', 'E-E-A-T 기준 고품질 글 유지', '내부 링크 구조 형성', 'Topical Authority 구축'],
            color: 'border-emerald-200 bg-emerald-50',
          },
          {
            phase: '4단계', period: 'D+30', title: '색인 & SEO 점검',
            items: ['서치콘솔 색인 현황 확인', '색인 안 된 글 수동 요청', '검색 트래픽 유입 시작 여부 확인'],
            color: 'border-teal-200 bg-teal-50',
          },
          {
            phase: '5단계', period: 'D+45 ~ D+60', title: '애드센스 신청',
            items: ['구글 애드센스 계정 생성 (없는 경우)', '블로그 URL 제출', '코드 삽입 (자동 또는 수동)', '심사 대기 (보통 1~4주)'],
            color: 'border-amber-200 bg-amber-50',
          },
          {
            phase: '6단계', period: '심사 중', title: '심사 중 콘텐츠 계속 추가',
            items: ['심사 중에도 W-05 규칙 준수 발행 유지', '심사 기간에 글을 멈추지 말 것', '불승인 시 원인 분석 후 보완'],
            color: 'border-violet-200 bg-violet-50',
          },
          {
            phase: '7단계', period: '승인 후', title: '광고 최적화 & 수익 극대화',
            items: ['자동 광고 활성화', '고수익 광고 위치 A/B 테스트', '발행 지속으로 트래픽 & 수익 증가'],
            color: 'border-rose-200 bg-rose-50',
          },
        ].map((phase, i) => (
          <div key={i} className={`relative border-l-4 ${phase.color} pl-6 pb-8 pt-0 last:pb-0`}>
            <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-white border-2 border-current flex items-center justify-center text-[9px] font-black text-slate-600 shadow-sm">
              {i + 1}
            </div>
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">{phase.phase}</span>
              <span className="text-[10px] font-black text-slate-400">{phase.period}</span>
            </div>
            <p className="text-sm font-black text-slate-800 mb-2">{phase.title}</p>
            <ul className="space-y-1">
              {phase.items.map((item, j) => (
                <li key={j} className="text-xs text-slate-500 font-medium flex items-start gap-2">
                  <CheckCircle size={11} className="text-emerald-500 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
        <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-rose-700 mb-1">절대 하지 말아야 할 것</p>
          <ul className="text-xs text-rose-600 font-medium space-y-1 list-disc list-inside">
            <li>하루에 5개 이상 글 발행 (어뷰징 필터 위험)</li>
            <li>타 사이트 글 복사·붙여넣기</li>
            <li>유료 트래픽 구매 (클릭팜 등)</li>
            <li>미완성 블로그(기본 정보 페이지 없음)로 신청</li>
          </ul>
        </div>
      </div>
    </article>
  );
}
