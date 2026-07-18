import React from 'react';
import { Target, Sparkles, AlertCircle, SearchCheck, LayoutDashboard, Terminal } from 'lucide-react';

export default function Step08QC() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Step 8
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          품질 검사 (SEO 클리닉)
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          애드센스 승인 신청을 넣기 전, 거절 사유(가치 없는 콘텐츠 등)를 원천 차단하기 위한 과정입니다.
          SEO 클리닉 메뉴에서 구글의 심사 기준에 맞춰 내 블로그를 10초 만에 완벽하게 스캔합니다.
        </p>
      </div>

      <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-16 shadow-sm">
        <img 
          src="/images/docs_qc.png" 
          alt="마자 스튜디오 SEO 클리닉 화면" 
          className="w-full h-auto block"
        />
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">SEO 클리닉 주요 기능</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-indigo-600">
              <SearchCheck size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              단일/일괄 정밀 진단
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              특정 도메인 하나만 정밀하게 검사하거나, 여러 사이트를 선택해 한 번에(Bulk) 일괄 스캔을 돌릴 수 있습니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-emerald-600">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              13가지 항목 체크리스트
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              글자 수, 이미지 압축, H2/H3 계층, E-E-A-T 문맥, 외부 링크, SEO 점수 등 구글이 보는 13가지 기준을 철저히 검사합니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-pink-600">
              <Terminal size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Auto-Fix (원클릭 자동 복구)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              품질 미달(텍스트 부족 등)로 판정된 글은 사용자가 직접 고칠 필요 없이, AI가 원클릭으로 지식을 보강하여 복구합니다.
            </p>
          </div>
          
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-amber-500">
              <LayoutDashboard size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              진단 결과 대시보드
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              전체 사이트의 진단 결과를 한눈에 파악할 수 있는 대시보드를 제공하여 어느 블로그에 문제가 있는지 즉시 확인합니다.
            </p>
          </div>
        </div>
      </section>

    </article>
  );
}
