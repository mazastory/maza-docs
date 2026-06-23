import { LayoutTemplate, Settings, Globe, BarChart2, Bell } from 'lucide-react';

export default function PageMySite() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Globe size={11} /> Platform
        </span>
        <h1 id="my-site" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          마이 사이트 통합 관리
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">마이 사이트(My Site)</strong>는 티스토리, 워드프레스, 마자블로그 등 플랫폼에 상관없이 여러 개의 블로그를 마자 스튜디오 한 곳에서 등록하고 통제하는 대시보드입니다.
        </p>
      </div>

      <h2 id="dashboard-features" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        주요 기능
      </h2>
      <div className="space-y-4 mb-12">
        <div className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <LayoutTemplate size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-1">사이트 다중 관리 (Multi-blogging)</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              여러 개의 수익형 블로그를 운영하더라도 각각 로그인할 필요가 없습니다. 카드로 정렬된 내 블로그 목록을 한눈에 보고, 어느 블로그로 글을 보낼지 자유롭게 전환할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-1">애드센스 승인 상태 추적</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              사이트별로 애드센스 심사 중인지, 승인 완료(Approved) 상태인지 라벨을 통해 관리할 수 있습니다. 승인 전에는 정보성(Info) 블루프린트를 집중 배치하고, 승인 후에는 수익형 리뷰를 즉각 투입하는 등 전략적인 관리가 가능합니다.
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-1">사이트별 개별 설정 제어</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              블로그마다 타겟하는 니치(Niche)와 카테고리를 세팅하고, 오토파일럿 발행 간격이나 심야 휴식 시간(Quiet Hours)을 사이트별로 독립적으로 적용할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <h2 id="how-to-add" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        새로운 사이트 추가하기
      </h2>
      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl mb-12">
        <ol className="list-decimal list-inside text-sm text-slate-700 font-medium space-y-3">
          <li>마이 사이트 대시보드 우측 상단의 <strong>[+ 사이트 추가]</strong> 버튼을 클릭합니다.</li>
          <li>생성할 플랫폼을 선택합니다. (티스토리, 워드프레스, 블로그스팟, 마자블로그)</li>
          <li>도메인 주소(URL)를 입력하고, 해당 사이트의 주력 니치(예: IT, 건강, 주식)를 설정합니다.</li>
          <li>각 플랫폼의 연동 방식(익스텐션 주입, REST API 키 등)에 따라 인증 절차를 거치면 등록이 완료됩니다.</li>
        </ol>
      </div>

    </article>
  );
}
