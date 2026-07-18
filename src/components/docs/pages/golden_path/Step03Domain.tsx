import React from 'react';
import { Globe, Sparkles, Layers, Box, PenTool } from 'lucide-react';

export default function Step03Domain() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Step 3
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          플랫폼 선택하기
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          대시보드에서 <strong>[+ 새 블로그 만들기]</strong> 버튼을 누르면 어떤 플랫폼을 베이스로 할지 선택할 수 있습니다. 
          자신의 상황과 목표에 맞는 플랫폼을 골라주세요.
        </p>
      </div>

      <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-16 shadow-sm">
        <img 
          src="/images/docs_platform.png" 
          alt="마자 스튜디오 플랫폼 선택 화면" 
          className="w-full h-auto block"
        />
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">지원하는 플랫폼 종류</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-lg font-bold text-indigo-700 mb-2 flex items-center gap-2">
              <Box size={20} /> 마자 독립 블로그 (Zero-IT)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              가장 추천하는 <strong>MAZA PICK</strong> 모델입니다. 복잡한 워드프레스나 티스토리 세팅 없이, 
              애드센스 수익화와 구글 검색 노출(SEO)에 최적화된 블로그를 1초 만에 자동 구축합니다.
            </p>
            <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">추천 1순위</span>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Layers size={20} className="text-purple-600"/> 프리미엄 블로그 제작 의뢰
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              도메인 연결부터 초기 세팅, 애드센스 심사용 초기 글 작성까지 전문가가 직접 A to Z로 세팅해 드리는 턴키(Turn-key) 서비스입니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <PenTool size={20} className="text-orange-500" /> 티스토리 / 워드프레스
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              이미 운영 중인 티스토리나 워드프레스가 있다면, 마자 스튜디오의 확장 프로그램(Maza Bridge)이나 API를 통해 연동하여 자동 포스팅을 진행할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

    </article>
  );
}
