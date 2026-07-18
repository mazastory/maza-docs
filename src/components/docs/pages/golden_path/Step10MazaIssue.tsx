import React from 'react';
import { Sparkles, Bot, Radar, Zap, Clock } from 'lucide-react';

export default function Step10MazaIssue() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Step 10
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          마자 이슈 (트렌드 헌터 AI)
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          더 이상 키워드를 찾기 위해 고군분투하지 마세요. 마자 스튜디오의 자율 AI 에이전트인 
          <strong>'트렌드 헌터(maza-issue)'</strong>가 24시간 내내 실시간 이슈를 수집하여 
          블루프린트 갤러리 좌측의 라이브 레이더에 자동으로 꽂아줍니다.
        </p>
      </div>

      <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-16 shadow-sm">
        <img 
          src="/images/docs_trend_hunter.png" 
          alt="블루프린트 페이지에 통합된 마자 이슈 라이브 레이더" 
          className="w-full h-auto block"
        />
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">트렌드 헌터의 핵심 기능</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-blue-600">
              <Radar size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              블루프린트 라이브 레이더
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              별도의 페이지로 이동할 필요 없이, 블루프린트 갤러리 좌측 위젯에서 실시간으로 쏟아지는 트래픽 폭발 키워드를 바로 확인할 수 있습니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-purple-600">
              <Bot size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              자율 AI 에이전트
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              단순한 스크립트가 아닙니다. 독립적인 마이크로서비스로 동작하며 구글 트렌드, 뉴스, 커뮤니티 등에서 스스로 판단하고 수집합니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-emerald-500">
              <Clock size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              클릭 한 번으로 큐잉
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              레이더에 포착된 이슈 키워드를 클릭하기만 하면 즉시 나의 블로그 포스팅 스케줄러(Queue)에 등록되어 AI가 자동으로 글을 작성합니다.
            </p>
          </div>
          
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-amber-500">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              제로 워크 (Zero-Work)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              키워드 발굴부터 글쓰기, SEO 검사, 그리고 최종 발행까지 100% 완전 자동화(Autopilot) 시스템을 완성하는 마지막 퍼즐입니다.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center mt-12 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">모든 여정이 완료되었습니다! 🎉</h2>
        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
          마자 스튜디오와 함께하는 10단계 골든 패스 가이드를 모두 마쳤습니다. 
          이제 IT 지식 없이도 무한대의 콘텐츠를 생산하고, 안정적인 수익 파이프라인을 구축해 보세요.
        </p>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm"
        >
          마자 스튜디오 시작하기
        </button>
      </div>

    </article>
  );
}
