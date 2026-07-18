import React from 'react';
import { Lightbulb, Globe2, Bot, TrendingUp, Zap, Target, DollarSign } from 'lucide-react';

export default function PageAcademyProTips() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Lightbulb size={11} /> Maza Academy
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          프로 팁 & 노하우 방출
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          블로그 초보 티를 벗고 <strong>최단기간 수익을 극대화</strong>하기 위한 마자 아카데미의 실전 프로 팁(Pro-Tips)을 모았습니다.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Globe2 className="text-blue-500" /> 다국어 블로그의 압도적 수익성 (Tier 1 공략)
        </h2>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
          <p className="text-slate-600 leading-relaxed mb-6">
            한국어로만 블로그를 운영하는 것은 수익 창출의 10%만 활용하는 것과 같습니다. 구글 애드센스는 철저하게 <strong>'접속 국가의 경제력'</strong>에 따라 클릭 단가(CPC)가 결정됩니다.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-rose-50 border border-rose-100 p-5 rounded-xl text-center">
              <div className="text-3xl mb-2">🇰🇷</div>
              <h4 className="font-bold text-rose-900 mb-1">한국어 타겟팅</h4>
              <p className="text-2xl font-black text-rose-600">$0.20</p>
              <p className="text-xs text-rose-700 mt-1">평균 클릭 단가</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-center">
              <div className="text-3xl mb-2">🇺🇸</div>
              <h4 className="font-bold text-blue-900 mb-1">영어(미국) 타겟팅</h4>
              <p className="text-2xl font-black text-blue-600">$1.50 ~ $3.00+</p>
              <p className="text-xs text-blue-700 mt-1">평균 클릭 단가 (최대 15배 차이)</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
            <strong>💡 Pro Tip:</strong> 블루프린트 생성 시 반드시 <code>[v] 영어</code>, <code>[v] 일본어</code>를 함께 체크하세요. 번역 비용 0원으로 트래픽 단가가 가장 높은 글로벌 1티어 시장을 즉시 공략할 수 있습니다.
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Bot className="text-emerald-500" /> 오토파일럿 대량 발행 트리거의 마법
        </h2>
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Zap className="text-amber-500" /> 주말 몰아치기 (Queue Stacking)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              오토파일럿은 사용자가 컴퓨터를 끄고 잠을 자도 작동합니다. 주말에 1시간만 투자하여 <strong>블루프린트 10개(약 150개 글)를 '큐(Queue)'에 대기</strong>시켜 두세요. 
              다음 한 달 동안 시스템이 매일 5개씩 인간처럼 지연 시간(Jitter)을 두고 자동으로 발행해 줍니다.
            </p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Target className="text-rose-500" /> 에이징 점핑 (Aging Jumping)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              신규 도메인은 구글에서 신뢰를 얻기 위해 '에이징' 기간이 필요합니다. 
              Maza Studio의 백데이팅 기능을 활용해 <strong>15개의 초기 글을 한 달 전 날짜로 분산 셋팅</strong>하면 샌드박스 기간을 대폭 단축시킬 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden">
          <h3 className="font-bold text-emerald-400 mb-4 text-xl flex items-center gap-2">
            <DollarSign /> 월 천만 원 블로거들의 3원칙
          </h3>
          <ol className="space-y-4 text-slate-300">
            <li className="flex gap-3">
              <span className="font-black text-slate-500">01.</span>
              <span><strong>루트 도메인은 하나만 판다:</strong> 승인 전에는 무조건 단일 카테고리로 밀고 나갑니다.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-black text-slate-500">02.</span>
              <span><strong>무한 서브도메인 증식:</strong> 승인 후에는 주제별로 서브도메인을 파서 광고 단가(CPC)를 최적화합니다.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-black text-slate-500">03.</span>
              <span><strong>글로벌 타겟팅 필수:</strong> 방문자가 적어도 영어권 수익이 훨씬 큽니다. 다국어 체크박스는 절대 놓치지 않습니다.</span>
            </li>
          </ol>
        </div>
      </section>
    </article>
  );
}
