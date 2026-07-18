import React from 'react';
import { Bot, Sparkles, MessageSquare, Zap, Rocket } from 'lucide-react';

export default function Step05Agent() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Step 5
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          마자 에이전트 (Copilot)
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          블로그 개설이 완료되면, 마치 직원과 채팅하듯 대화형으로 세팅을 마무리할 수 있는 <strong>마자 에이전트(Copilot)</strong> 화면이 나타납니다.
          복잡한 버튼 대신 채팅으로 모든 지시를 내릴 수 있습니다.
        </p>
      </div>

      <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-16 shadow-sm bg-slate-900">
        <img 
          src="/images/docs_agent.png" 
          alt="마자 에이전트 (Copilot) 대화형 UI 화면" 
          className="w-full h-auto block"
        />
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">마자 에이전트 활용법</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-600" />
              대화형 프롬프트 입력
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              "타겟을 20대 직장인으로 변경해줘", "하루에 3개씩 발행하도록 스케줄을 짜줘"와 같이 자연어로 요구사항을 입력하면 
              AI가 알아서 백엔드 세팅을 변경해줍니다.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Zap size={20} className="text-amber-500" />
              퀵 액션 버튼
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              입력창 위에 제공되는 퀵 액션 버튼(예: 나만의 타겟 구체화, 구글 서치콘솔 연동 등)을 클릭하면 
              자주 사용하는 필수 세팅을 1초 만에 실행할 수 있습니다.
            </p>
          </div>
          
          <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow md:col-span-2 flex gap-4 items-start">
            <div className="mt-1">
              <Rocket size={24} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                오토파일럿(Autopilot) 백그라운드 구동
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                마자 에이전트와 대화를 마치고 <strong>[엔진 ON]</strong>을 활성화하면, 
                우측의 'MAZA AI Agency' 가상 오피스 그래픽에서 AI 직원들이 활성화되며 자동으로 키워드를 수집하고 포스팅을 시작합니다.
                이제 브라우저를 닫고 주무셔도 알아서 수익화 블로그가 돌아갑니다.
              </p>
            </div>
          </div>
        </div>
      </section>

    </article>
  );
}
