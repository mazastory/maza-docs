import React from 'react';
import { Target, Sparkles, BookOpen, Search, MousePointerClick } from 'lucide-react';

export default function Step06Blueprints() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Step 6
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          블루프린트 추출 (키워드)
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          블로그의 뼈대가 되는 글감(키워드와 목차)을 설계하는 과정입니다. 
          마자 스튜디오의 블루프린트 갤러리에서는 돈이 되는 황금 키워드 묶음을 클릭 한 번으로 내 블로그에 적용할 수 있습니다.
        </p>
      </div>

      <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-16 shadow-sm">
        <img 
          src="/images/docs_blueprint.png" 
          alt="마자 스튜디오 블루프린트 화면" 
          className="w-full h-auto block"
        />
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">블루프린트 활용법</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-indigo-600">
              <Search size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              카테고리 탐색
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              IT, 재테크, 건강, 부동산 등 원하는 카테고리를 선택하여 AI가 미리 분석해둔 수익형 블루프린트 카드를 탐색합니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-emerald-600">
              <BookOpen size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              상세 목차 확인
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              마음에 드는 블루프린트 카드를 클릭하면, 어떤 키워드와 내용으로 총 몇 개의 포스팅이 작성될지 전체 리스트를 미리 볼 수 있습니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-pink-600">
              <MousePointerClick size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              블로그 적용 (담기)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              [내 블로그에 담기] 버튼을 누르면 해당 블루프린트의 모든 키워드 세트가 
              내 블로그의 발행 대기열(Queue)로 복사되며 즉시 자동화 엔진이 가동을 준비합니다.
            </p>
          </div>
        </div>
      </section>

    </article>
  );
}
