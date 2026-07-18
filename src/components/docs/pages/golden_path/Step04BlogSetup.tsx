import React from 'react';
import { Box, Sparkles, AlertTriangle, ExternalLink, Target, DollarSign, UserCheck, ShieldCheck } from 'lucide-react';

export default function Step04BlogSetup() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Step 4
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          블로그 세팅 및 도메인
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          어떤 목적의 블로그를 운영하실 건가요? 
          마자 스튜디오는 블로그의 목적에 따라 최적화된 테마와 구조를 자동으로 세팅해 드립니다.
        </p>
      </div>

      <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-12 shadow-sm">
        <img 
          src="/images/docs_blog_setup.png" 
          alt="마자 스튜디오 사이트 정보 입력 화면" 
          className="w-full h-auto block"
        />
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">1. 블로그 운영 목적 선택</h2>
        
        <div className="space-y-4">
          <div className="p-5 bg-white border border-indigo-200 shadow-sm rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50"></div>
            <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
              <ShieldCheck size={20} /> 애드센스 챌린지 모드
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>구글 애드센스 승인</strong>을 최우선 목표로 하는 모드입니다. 구글 봇이 좋아하는 '정보성(Info)' 포스팅 위주의 엄격한 구조로 세팅되며, 
              승인 거절 사유를 방어하기 위한 최적의 환경을 제공합니다.
            </p>
          </div>

          <div className="p-5 bg-white border border-emerald-200 shadow-sm rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 opacity-50"></div>
            <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
              <DollarSign size={20} /> 수익화 및 사업 모드
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>쿠팡 파트너스, CPA, 제휴 마케팅</strong> 등 즉각적인 수익 창출을 위한 상업용 블로그 모드입니다. 
              구매 전환율(Conversion)을 높이기 위한 UI/UX와 상업성 리뷰(Review) 포스팅 템플릿에 최적화되어 있습니다.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded">준비중</div>
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <UserCheck size={20} /> 퍼스널 브랜딩 모드
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed pr-16">
              수익화나 애드센스에 얽매이지 않고, 일반 네이버 블로그처럼 개인 포트폴리오나 일상 브랜딩을 위해 자유롭게 글을 쓰는 용도의 테마입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">2. 도메인 및 E-E-A-T 정보 입력</h2>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-sm text-amber-900 mb-8">
          <h4 className="font-bold flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-amber-600" /> 개인 도메인이 꼭 필요한가요?
          </h4>
          <p className="mb-2">
            네, 마자 독립 블로그를 운영하기 위해서는 <strong>개인 도메인(예: myblog.com)</strong>이 필수적입니다. 
            아직 도메인이 없다면 <strong>Porkbun(포크번)</strong>이나 가비아 같은 도메인 등록 업체에서 먼저 도메인을 구매해 주세요.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-800 mb-1">도메인 주소 입력</h3>
            <p className="text-slate-600 text-sm mb-3">
              구매하신 도메인 주소(예: example.com)를 정확히 입력하세요. <br/>
              <code>www 도메인 함께 사용하기</code> 옵션을 체크하면, 접속자가 <code>www.example.com</code>으로 접속해도 자동으로 메인 주소로 리다이렉트 처리됩니다.
            </p>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-800 mb-1">블로그 이름 (선택)</h3>
            <p className="text-slate-600 text-sm">
              운영할 사이트의 간판 이름(타이틀)을 입력합니다. 나중에 대시보드 [내 사이트] 설정에서 언제든지 바꿀 수 있습니다.
            </p>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-xl">
            <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
              운영 주체 및 연락처 <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-bold">중요!</span>
            </h3>
            <p className="text-slate-600 text-sm">
              회사명(운영자명)과 이메일을 입력하면, 사이트 하단(Footer)의 <strong>이용약관, 개인정보처리방침, About, Contact</strong> 페이지가 자동으로 생성됩니다. 
              이는 구글이 강조하는 <strong>E-E-A-T(전문성, 권위, 신뢰성)</strong> 평가에 매우 긍정적인 영향을 미쳐 SEO 점수를 대폭 상승시킵니다.
            </p>
          </div>
        </div>
      </section>

    </article>
  );
}
