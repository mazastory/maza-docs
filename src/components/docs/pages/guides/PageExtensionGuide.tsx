import React from 'react';
import { Globe, Puzzle, Activity, Lock, ArrowRight, Server, EyeOff, LayoutTemplate } from 'lucide-react';

export default function PageExtensionGuide() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Puzzle size={11} /> Guide
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          Maza Extension 연동 가이드
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          Maza Extension은 외부 블로그 플랫폼(예: 티스토리, 워드프레스)과 Maza Studio를 매끄럽게 연결해주는 
          핵심 컴포넌트로, API 제한을 우회하여 <strong>인간과 똑같은 방식(DOM Injection)으로 글을 발행</strong>합니다.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Activity className="text-blue-500" /> 왜 익스텐션이 필요한가요? (Why do we need this?)
        </h2>
        <p className="text-slate-600 leading-relaxed mb-6">
          티스토리나 네이버 블로그 등은 Open API를 제공하지 않거나, 제공하더라도 일일 발행 한도, 이미지 업로드 등에 큰 제약이 있습니다. 
          Maza Extension은 브라우저 환경에서 사용자가 직접 글을 쓰는 것과 완전히 동일한 플로우로 작동합니다.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
              <Lock size={20} />
            </div>
            <h4 className="font-bold text-slate-800 mb-2 text-sm">API 제한 우회</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              공식 API의 하루 15개 제한, 이미지 롤백 현상 등을 우회하여 안정적인 대량 발행이 가능합니다.
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
              <EyeOff size={20} />
            </div>
            <h4 className="font-bold text-slate-800 mb-2 text-sm">봇 탐지 회피</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              서버 to 서버(API) 통신이 아닌 사용자의 실제 브라우저 세션을 이용하므로 스팸 봇으로 차단될 확률이 현저히 낮습니다.
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-purple-300 transition-colors">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
              <LayoutTemplate size={20} />
            </div>
            <h4 className="font-bold text-slate-800 mb-2 text-sm">플랫폼 확장성</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              API 미제공 플랫폼(워드프레스, 구글 블로거) 등 브라우저 기반 에디터라면 어디든 쉽게 대응할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Server className="text-indigo-500" /> 오토파일럿 퍼블리시 플로우 (Publish Flow)
        </h2>
        <p className="text-slate-600 leading-relaxed mb-8">
          발행 프로세스는 Maza Studio 서버의 스케줄러에 의해 비동기적으로 통제되며, 크롬 익스텐션과 다음과 같이 상호작용합니다.
        </p>

        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {/* Step 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(99,102,241,0.2)] z-10">1</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-slate-200 shadow-sm ml-4 md:ml-0">
              <h3 className="font-bold text-slate-800 mb-2">태스크 감지 (Polling)</h3>
              <p className="text-sm text-slate-600">익스텐션 백그라운드 워커가 서버를 정기적으로 폴링하여 대기 중인 <code>PUBLISH_POST</code> 태스크를 인지합니다.</p>
            </div>
          </div>
          {/* Step 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">2</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-slate-200 shadow-sm ml-4 md:ml-0">
              <h3 className="font-bold text-slate-800 mb-2">에디터 진입</h3>
              <p className="text-sm text-slate-600">사용자의 브라우저에서 백그라운드 탭을 몰래 열고 티스토리 글쓰기 페이지(<code>/manage/post</code>)로 진입합니다.</p>
            </div>
          </div>
          {/* Step 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-teal-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">3</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-slate-200 shadow-sm ml-4 md:ml-0">
              <h3 className="font-bold text-slate-800 mb-2">DOM 인젝션 (Content Injection)</h3>
              <p className="text-sm text-slate-600">제목 삽입, 카테고리 선택, 태그 입력 후 iframe 내부의 에디터 캔버스를 찾아 본문 HTML을 꽂아넣습니다.</p>
            </div>
          </div>
          {/* Step 4 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-rose-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">4</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-slate-200 shadow-sm ml-4 md:ml-0">
              <h3 className="font-bold text-slate-800 mb-2">자동 클릭 및 발행</h3>
              <p className="text-sm text-slate-600">하단 '완료' 버튼과 '공개 발행' 버튼을 자바스크립트로 순차 클릭합니다.</p>
            </div>
          </div>
          {/* Step 5 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">5</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-slate-200 shadow-sm ml-4 md:ml-0">
              <h3 className="font-bold text-slate-800 mb-2">결과 보고 (Callback)</h3>
              <p className="text-sm text-slate-600">발행 성공 여부 및 URL을 Maza Studio 서버로 전송하여 태스크 상태를 <code>PUBLISHED</code>로 최종 변경합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
          <div className="mt-1 text-amber-500 shrink-0"><Globe size={24} /></div>
          <div>
            <h3 className="font-bold text-amber-900 mb-2">브라우저 환경 유지 필수!</h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              티스토리(Tistory) 플랫폼 등으로 외부 발행을 수행할 때는 <strong>Maza Chrome Extension이 설치된 브라우저가 반드시 켜져 있어야</strong> 합니다. (화면보호기 상태 무방, 단 브라우저 완전 종료 시 발행 중단) <br/>
              ※ Maza Blog (Netlify) 플랫폼을 사용할 경우 익스텐션이나 브라우저 켜짐 없이 100% 서버사이드에서 발행이 이루어집니다.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
