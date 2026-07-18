import React from 'react';
import { Smartphone, Apple, SmartphoneNfc, Zap, Camera, ShieldCheck, Share, Menu } from 'lucide-react';

export default function PagePWAInstallGuide() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Smartphone size={11} /> Guide
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          모바일 앱 (PWA) 설치 가이드
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          Maza Studio는 모바일 환경에서도 완벽하게 작동하도록 PWA(Progressive Web App) 기술을 지원합니다.
          홈 화면에 추가하면 <strong>앱 스토어 없이도 네이티브 앱처럼 전체 화면으로 쾌적하게 사용</strong>할 수 있습니다.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Zap className="text-amber-500" /> 홈 화면 설치의 4가지 혜택
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
              <Smartphone size={18} className="text-blue-500"/> 압도적인 몰입감 (풀스크린)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">지저분한 주소창과 하단 메뉴바가 사라지고, 화면을 100% 꽉 채우는 진짜 모바일 앱처럼 실행됩니다.</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
              <Camera size={18} className="text-emerald-500"/> 비전 라이터 (Vision Writer) 최적화
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">식당, 카페에서 사진을 찍은 직후 앱을 켜서 바로 업로드하면 퀄리티 높은 리뷰 포스팅이 완성됩니다.</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
              <Zap size={18} className="text-amber-500"/> 배터리 및 데이터 절약
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">일반 웹서핑보다 훨씬 가볍고 빠르게 로딩되도록 캐시(Cache)가 최적화되어 동작합니다.</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
              <ShieldCheck size={18} className="text-indigo-500"/> 로그인 상태 유지
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">매번 로그인할 필요 없이 생체 인식이나 토큰을 통해 빠르고 안전하게 접속 상태가 유지됩니다.</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-slate-900 rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Apple className="text-slate-300" /> iPhone (iOS) 설치 방법
            </h2>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 mb-6">
              <p className="text-sm text-slate-300">
                아이폰에서는 <strong>반드시 기본 브라우저인 Safari(사파리) 앱을 사용</strong>하셔야 홈 화면에 완벽한 앱 형태로 설치됩니다.
              </p>
            </div>

            <ol className="relative border-l border-slate-700 ml-3 space-y-6">
              <li className="pl-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full -left-3 ring-4 ring-slate-900 text-white text-xs font-bold">1</span>
                <h4 className="text-slate-100 font-bold mb-1">Safari 브라우저 실행 및 접속</h4>
                <p className="text-sm text-slate-400">사파리 앱을 열고 <code>mazastudio.kr</code>에 접속합니다.</p>
              </li>
              <li className="pl-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-slate-700 rounded-full -left-3 ring-4 ring-slate-900 text-white text-xs font-bold">2</span>
                <h4 className="text-slate-100 font-bold mb-1 flex items-center gap-2">공유하기 버튼 터치 <Share size={14} className="text-blue-400"/></h4>
                <p className="text-sm text-slate-400">화면 하단 정중앙에 있는 [공유 아이콘]을 터치합니다.</p>
              </li>
              <li className="pl-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-slate-700 rounded-full -left-3 ring-4 ring-slate-900 text-white text-xs font-bold">3</span>
                <h4 className="text-slate-100 font-bold mb-1">홈 화면에 추가</h4>
                <p className="text-sm text-slate-400">위로 올라온 메뉴 창을 아래로 조금 스크롤하여 <strong>[홈 화면에 추가]</strong> (또는 'Add to Home Screen')를 선택합니다.</p>
              </li>
              <li className="pl-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-emerald-500 rounded-full -left-3 ring-4 ring-slate-900 text-white text-xs font-bold">4</span>
                <h4 className="text-slate-100 font-bold mb-1">설치 완료</h4>
                <p className="text-sm text-slate-400">우측 상단의 [추가] 버튼을 누르면 바탕화면에 앱 아이콘이 생성됩니다.</p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <SmartphoneNfc className="text-emerald-500" /> Galaxy (Android) 설치 방법
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Chrome (크롬) 사용 시
                </h3>
                <ol className="space-y-4 text-sm text-slate-600 list-decimal list-inside">
                  <li>크롬 앱을 열고 <code>mazastudio.kr</code>에 접속</li>
                  <li>우측 상단 <strong>[세로 점 3개(⋮)]</strong> 메뉴 터치</li>
                  <li><strong>[홈 화면에 추가]</strong> (또는 '앱 설치') 선택</li>
                  <li>팝업창에서 <strong>[추가]</strong> 확인</li>
                </ol>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> 삼성 인터넷 사용 시
                </h3>
                <ol className="space-y-4 text-sm text-slate-600 list-decimal list-inside">
                  <li>삼성 인터넷을 열고 <code>mazastudio.kr</code>에 접속</li>
                  <li>우측 하단 <strong>[가로 줄 3개(≡)]</strong> 메뉴 터치</li>
                  <li><strong>[+ 현재 페이지 추가]</strong> 항목 터치</li>
                  <li><strong>[홈 화면]</strong>을 선택하고 추가 완료</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
