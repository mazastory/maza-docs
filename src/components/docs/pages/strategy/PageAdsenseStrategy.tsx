import React from 'react';
import { Target, AlertTriangle, CheckCircle2, TrendingUp, Layers, Rocket, FolderTree, Network } from 'lucide-react';

export default function PageAdsenseStrategy() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Target size={11} /> Strategy
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          애드센스 카테고리 최적화 전략
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          구글 최신 검색 알고리즘(E-E-A-T)에 맞춘 가장 완벽한 카테고리(주제) 운영 가이드입니다. 
          초고속 승인부터 수익 극대화까지, Maza Studio의 <strong>Zero-Limit(무한 확장)</strong> 아키텍처를 100% 활용하는 방법을 알아봅니다.
        </p>
      </div>

      {/* Section 1: Approval Stage */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <CheckCircle2 className="text-emerald-500" /> 1단계: 애드센스 승인 (1도메인 = 1주제)
        </h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          애드센스 승인을 받기 전이거나 초기 세팅 단계라면, <strong>무조건 1개의 단일 카테고리(주제)</strong>로 일관성 있게 글을 작성하는 것이 압도적으로 유리합니다.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
            <h3 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-500" /> 잘못된 접근: 잡블로그
            </h3>
            <p className="text-sm text-rose-800 leading-relaxed mb-4">
              한 사이트 안에 [건강, IT, 자동차, 여행, 재테크] 등 5개의 카테고리를 만들고 글을 분산시켜 작성하는 방식입니다.
            </p>
            <div className="bg-white/60 rounded-lg p-4 text-sm text-rose-900">
              <strong>결과:</strong> 구글 봇(Crawler)은 이를 전문성이 결여된 <strong>'Low Value Content(저가치 콘텐츠)'</strong>로 취급하여 승인을 거절할 확률이 매우 높습니다.
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <Target size={20} className="text-emerald-500" /> 올바른 접근: 주제 전문성
            </h3>
            <p className="text-sm text-emerald-800 leading-relaxed mb-4">
              모든 글이 오직 [건강] 단일 카테고리에만 깊이 있게 집중되어 작성된 방식입니다.
            </p>
            <div className="bg-white/60 rounded-lg p-4 text-sm text-emerald-900">
              <strong>결과:</strong> 구글은 이 사이트를 <strong>'건강 분야 전문 매체'</strong>로 인식, 높은 E-E-A-T 점수를 부여하여 초고속으로 승인을 내어줍니다.
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Expansion Stage */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <TrendingUp className="text-indigo-500" /> 2단계: 수익 극대화 (서브도메인 분리)
        </h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          승인 후 다루고 싶은 주제가 많아졌다면? 한 사이트에 카테고리를 계속 추가하는 대신 <strong>"서브도메인 분리 전략"</strong>을 사용하는 것이 정답입니다.
        </p>

        <div className="space-y-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">광고 단가(CPC) 최적화</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                구글은 사이트 전체 문맥을 파악해 단가를 결정합니다. 잡블로그는 문맥 혼동으로 10~50원짜리 저단가 일반 광고가 나오지만, 
                <strong>재테크 전용 사이트로 완벽히 분리해두면</strong> 클릭당 500~5,000원에 달하는 고단가 금융 광고가 집중 송출됩니다.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <Rocket size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">애드센스 승인 프리패스</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                루트 도메인 하나만 승인받으면 하위 <strong>서브도메인은 무조건 자동 승인</strong>됩니다. 
                (예: <code>autosite.kr</code> 승인 시 <code>tech.autosite.kr</code>, <code>health.autosite.kr</code>은 심사 없이 즉시 광고 송출 가능)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Conclusion */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Network className="text-purple-500" /> Maza Studio 최적화 결론
        </h2>
        
        <div className="bg-slate-900 rounded-xl p-8 text-white">
          <h3 className="text-xl font-bold text-purple-400 mb-6">Zero-Limit 아키텍처 활용법</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 font-bold">1</div>
              <div>
                <h4 className="font-bold text-slate-100 mb-1">선택과 집중 (루트 도메인)</h4>
                <p className="text-sm text-slate-400">
                  루트 도메인은 단 1개의 뾰족한 카테고리만 설정하여 초고속으로 애드센스 승인을 받아냅니다.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 font-bold">2</div>
              <div>
                <h4 className="font-bold text-slate-100 mb-1">무한 확장 (서브도메인 증식)</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  승인이 떨어지면 Maza Studio의 기능을 이용해 <strong>서브도메인을 무한 생성</strong>합니다. 
                  각각 '건강 전용', 'IT 전용' 블로그로 문어발처럼 독립시켜 확장하는 것이 저품질 위험 없이 가장 안전하게 수익을 극대화하는 길입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
