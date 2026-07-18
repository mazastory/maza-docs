import React from 'react';
import { Sparkles, GraduationCap, ArrowRight, Zap, Target, LayoutTemplate, Clock, Code2, Rocket, RefreshCcw, LayoutDashboard, AlertCircle, Link, ShieldCheck } from 'lucide-react';

export default function PageAcademyGettingStarted() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <GraduationCap size={11} /> Maza Academy
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          IT 초보도 가능한 완벽 자동화 워크플로우
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          복잡한 코딩, 깃허브 설정, 넷리파이 인프라 지식... 블로그를 시작하려다 이 모든 장벽 앞에서 좌절하셨나요? 
          Maza Studio는 여러분이 오직 콘텐츠에만 집중할 수 있도록 <strong>블로그 세팅의 모든 것을 전면 자동화(Zero-IT)</strong>했습니다.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <Sparkles className="text-amber-500" /> 블로그가 탄생하는 9가지 마법 여정
        </h2>
        
        <div className="space-y-6">
          {/* Step 1 & 2 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative hover:border-violet-300 transition-colors">
              <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-black mb-4">1</div>
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Rocket size={18} className="text-slate-400" /> 로그인 및 사이트 생성
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                마자 스튜디오에 로그인한 뒤, '내 사이트' 메뉴에서 <strong>[+ 새 사이트 추가]</strong> 버튼을 클릭하는 순간 자동화 마법이 시작됩니다.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative hover:border-violet-300 transition-colors">
              <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-black mb-4">2</div>
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <LayoutTemplate size={18} className="text-slate-400" /> 도메인 및 정보 입력
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                주소가 될 도메인, 블로그 이름 등 필수 정보를 입력합니다. 이 정보들은 약관, Contact 페이지 등에 자동 반영되며 발행 간격도 설정합니다.
              </p>
            </div>
          </div>

          {/* Step 3 & 4 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative hover:border-violet-300 transition-colors">
              <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-black mb-4">3</div>
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Target size={18} className="text-slate-400" /> 수익형 블루프린트 선택
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                수익성이 검증된 블루프린트(테마) 중 목표에 맞는 것을 선택합니다. (예: IT, 건강, 정부지원금 등)
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm relative">
              <div className="w-10 h-10 bg-amber-200 text-amber-700 rounded-full flex items-center justify-center font-black mb-4">4</div>
              <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                <Clock size={18} /> 핵심 기술: 백데이팅 (Backdating)
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                텅 빈 신생 블로그로 보이지 않도록, AI가 15개의 초기 글을 <strong>3일 전, 2일 전 등 과거 날짜로 조작하여 배포</strong>합니다. 이는 SEO 및 애드센스 승인 확률을 극대화하는 시간차 공격 전략입니다.
              </p>
            </div>
          </div>

          {/* Step 5 & 6 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative hover:border-violet-300 transition-colors">
              <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-black mb-4">5</div>
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Link size={18} className="text-slate-400" /> 구글 계정 연동
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                AI가 글을 쓰는 동안 구글 계정으로 로그인하면 시스템이 구글 서치 콘솔과 GA4 권한을 자동으로 받아옵니다.
              </p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 shadow-sm relative">
              <div className="w-10 h-10 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-black mb-4">6</div>
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <Code2 size={18} /> 진정한 Zero-IT: 인프라 구축
              </h3>
              <p className="text-sm text-indigo-800 leading-relaxed">
                <strong>팝업을 띄우거나 가입할 필요가 전혀 없습니다.</strong> 시스템이 무료 호스팅 서버인 Netlify와 다이렉트로 연동하여 빈 껍데기 서버를 알아서 구축합니다.
              </p>
            </div>
          </div>

          {/* Step 7, 8, 9 */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative hover:border-violet-300 transition-colors">
              <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-black mb-3">7</div>
              <h3 className="font-bold text-slate-800 mb-2 text-sm">최종 배포 (Inject)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                추적 코드(메타데이터)와 완성된 15개 다국어 글을 넷리파이 서버에 즉시 주입하여 전 세계로 배포합니다.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative hover:border-violet-300 transition-colors">
              <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-black mb-3">8</div>
              <h3 className="font-bold text-slate-800 mb-2 text-sm">구글 서치콘솔 Ping</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                배포 완료 시 서치 콘솔에 사이트맵(Sitemap)과 RSS를 강제로 쏴주어 구글 봇을 빠르게 호출합니다.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative hover:border-violet-300 transition-colors">
              <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-black mb-3">9</div>
              <h3 className="font-bold text-slate-800 mb-2 text-sm">애드센스 신청 & 대시보드</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                애드센스 승인 심사를 신청한 뒤 '마이 사이트' 대시보드에서 방문자와 수익 통계를 여유롭게 모니터링합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <AlertCircle className="text-rose-500" /> 단 하나, 당신이 외부에서 해야 할 일
        </h2>
        
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 mb-8 flex gap-4">
          <div className="mt-1 text-rose-500 shrink-0"><AlertCircle size={24} /></div>
          <div>
            <h3 className="font-bold text-rose-900 mb-2">도메인 이름표(DNS) 달아주기</h3>
            <p className="text-sm text-rose-800 leading-relaxed mb-4">
              위 모든 과정이 Maza Studio 내에서 100% 자동으로 진행되지만, 
              당신의 도메인(예: <code>mazapost.com</code>)에 인터넷 상의 정확한 주소를 알려주는 작업만 도메인 구입처에서 해주셔야 합니다.
            </p>
            <ol className="list-decimal list-inside text-sm text-rose-900 space-y-2 bg-white/60 p-4 rounded-lg">
              <li>도메인 구입처(가비아, 호스팅케이알 등)에 접속 ➡️ DNS 레코드 설정 메뉴</li>
              <li><strong>A 레코드 추가:</strong> Netlify 고정 주소(IP <code>75.2.60.5</code>)를 향하도록 입력</li>
            </ol>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-8 text-white">
          <h3 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-400" /> 팩트 체크: 백데이팅 전략의 중요성
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            구글은 비정상적인 대량 발행 콘텐츠를 스팸으로 분류하고 제재합니다. (샌드박스 페널티)
          </p>
          <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-emerald-500 pl-4">
            마자 스튜디오의 <strong>백데이팅 전략</strong>과 <strong>발행 간격 조절</strong>은 단순한 편법이 아닙니다. 
            이는 구글의 엄격한 스팸 정책을 우회하여, 새로 시작하는 블로그가 검색 엔진에서 
            마치 <strong>오랜 기간 꾸준히 운영된 것처럼 신뢰를 얻도록 설계된 치밀한 필수 전략</strong>입니다.
          </p>
        </div>
      </section>
    </article>
  );
}
