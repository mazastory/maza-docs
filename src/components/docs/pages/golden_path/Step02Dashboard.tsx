import React from 'react';
import { LayoutTemplate, Sparkles, Navigation, PlusCircle, Target, Activity, Settings, List } from 'lucide-react';

export default function Step02Dashboard() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Step 2
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          마이 사이트 통합 관리
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong>마이 사이트(My Site)</strong>는 티스토리, 워드프레스, 마자블로그 등 플랫폼에 상관없이 여러 개의 블로그를 
          마자 스튜디오 한 곳에서 등록하고 통제하는 통합 대시보드입니다.
        </p>
      </div>

      <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-12 shadow-sm bg-slate-100">
        <img 
          src="/images/docs_dashboard.png" 
          alt="마자 스튜디오 마이 사이트 대시보드 화면" 
          className="w-full h-auto block"
        />
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          마이 사이트 주요 기능
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <List size={20} className="text-indigo-600" />
              사이트 다중 관리 (Multi-blogging)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              여러 개의 수익형 블로그를 운영하더라도 각각 로그인할 필요가 없습니다. 카드로 정렬된 내 블로그 목록을 한눈에 보고, 어느 블로그로 글을 보낼지 자유롭게 전환할 수 있습니다.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Target size={20} className="text-emerald-600" />
              애드센스 승인 상태 추적
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              사이트별로 애드센스 심사 중인지, 승인 완료(Approved) 상태인지 라벨을 통해 관리할 수 있습니다. 승인 전에는 정보성(Info) 블루프린트를, 승인 후에는 수익형 리뷰를 집중 배치하세요.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Settings size={20} className="text-amber-600" />
              사이트별 개별 설정 제어
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              블로그마다 타겟하는 니치(Niche)와 카테고리를 세팅하고, 오토파일럿 발행 간격이나 심야 휴식 시간(Quiet Hours)을 사이트별로 완전히 독립적으로 적용할 수 있습니다.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <PlusCircle size={20} className="text-rose-500" />
              서브 도메인 및 무한 확장
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              서브 도메인을 무제한으로 연결하고 관리할 수 있어 도메인 비용을 절감하며 거대한 블로그 네트워크를 구축할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-16">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          새로운 사이트 추가하기
        </h2>
        <ol className="space-y-4 list-decimal list-inside text-slate-700 leading-relaxed font-medium">
          <li>마이 사이트 대시보드 우측 상단의 <strong>[+ 사이트 추가]</strong> 버튼을 클릭합니다.</li>
          <li>생성할 플랫폼을 선택합니다. (티스토리, 워드프레스, 구글 블로거, 마자 독립 블로그 등)</li>
          <li>도메인 주소(URL)를 입력하고, 해당 사이트의 주력 니치(예: IT, 건강, 주식)를 설정합니다.</li>
          <li>각 플랫폼의 연동 방식(익스텐션 주입, REST API 키 등)에 따라 인증 절차를 거치면 등록이 완료됩니다.</li>
        </ol>
      </section>

    </article>
  );
}
