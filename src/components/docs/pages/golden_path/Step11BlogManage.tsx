import React from 'react';
import { Calendar, Settings, Sliders, ShieldAlert, Clock, Cpu } from 'lucide-react';

export default function Step11BlogManage() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Settings size={11} /> Advanced
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          블로그 전체 관리 (예약 & 설정)
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          블로그의 모든 포스팅 일정을 캘린더로 관리하고, 구글 봇(Crawler)에게 사람처럼 보이게 만드는 
          <strong>'고급 발행 환경설정'</strong>을 통해 어뷰징을 원천 차단합니다.
        </p>
      </div>

      <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-8 shadow-sm">
        <img 
          src="/images/docs_blog_manage.png" 
          alt="마자 스튜디오 예약 달력 대시보드" 
          className="w-full h-auto block border-b border-slate-200"
        />
        <div className="bg-slate-50 p-4 border-b border-slate-200">
          <p className="text-sm text-slate-600 font-medium text-center">▲ 예약 달력 뷰: 전체 포스팅의 큐(Queue) 상태와 진행 상황을 한눈에 파악합니다.</p>
        </div>
        <img 
          src="/images/docs_blog_settings.png" 
          alt="마자 스튜디오 발행 환경설정 대시보드" 
          className="w-full h-auto block"
        />
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">발행 환경설정 핵심 기능</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-emerald-600">
              <Clock size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Human-like Jitter 적용
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              정확히 매시 정각에 발행되는 기계적인 패턴을 방지하기 위해, AI가 예약 시간 앞뒤로 무작위 지연(Jitter)을 주어 사람이 직접 발행하는 것처럼 위장합니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-indigo-600">
              <Sliders size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              심야 발행 방지 (Quiet Hours)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              새벽 시간에 대량으로 글이 올라가는 비정상적인 패턴을 차단합니다. 00:00 ~ 05:00 사이에는 발행을 멈추고 아침으로 일정을 자동 이월합니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-rose-500">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              실패 자동 복구 (Auto-Retry)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              OpenAI/Gemini API 한도 초과나 티스토리 서버 장애 등으로 발행이 실패할 경우, 시스템이 이를 감지하고 스스로 복구 및 재시도합니다.
            </p>
          </div>
          
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-purple-600">
              <Cpu size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              운영 모드 및 커스텀 프롬프트
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              블로그의 목적(애드센스 고시용, 쿠팡 수익용 등)에 따라 AI의 글쓰기 톤앤매너를 변경하고, 나만의 비기(프롬프트)를 주입할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

    </article>
  );
}
