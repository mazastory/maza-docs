import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, Globe, FileText, Bot } from 'lucide-react';

export default function Step07GoogleConnect() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Step 7
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          구글 연동 (인프라 동기화)
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          트래픽 유입과 애드센스 심사를 위해 구글 서치콘솔과 애널리틱스(GA4)를 자동으로 연결하는 단계입니다. 
          클릭 한 번으로 구글의 모든 인프라가 1초 만에 세팅됩니다.
        </p>
      </div>

      <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-16 shadow-sm">
        <img 
          src="/images/docs_google_connect.png" 
          alt="마자 스튜디오 구글 연동 화면" 
          className="w-full h-auto block"
        />
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">원클릭 동기화 과정</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-emerald-100 mb-4 text-emerald-600">
              <Globe size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              서치콘솔 자동 연동 (Verified)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              도메인 연결이 완료되면, 마자 스튜디오가 구글 서치콘솔 소유권을 확인하고 크롤링을 위해 사이트맵과 RSS를 1초 만에 자동 제출합니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-emerald-100 mb-4 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              GA4 통계 설치 완료
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              수익 창출을 위한 필수 통계인 구글 애널리틱스(GA4) 속성이 자동으로 생성되며, 측정 ID가 내 블로그에 실시간으로 심어집니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-indigo-600">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              구글 애드센스 (Standby)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              모든 트래픽 파이프라인이 완성되면, 마지막으로 구글 애드센스 승인 신청을 위한 대기(Standby) 상태로 넘어갑니다.
            </p>
          </div>
          
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-pink-600">
              <Bot size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Indexing API 봇 세팅
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              발행 즉시 구글 검색 결과에 색인되도록 Indexing API 서비스 어카운트를 등록하는 과정이 완전히 자동화되어 있습니다.
            </p>
          </div>
        </div>
      </section>

    </article>
  );
}
