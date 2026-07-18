import React from 'react';
import { LogIn, Key, Sparkles, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Step01Login() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Step 1
        </span>
        <h1 id="intro" className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          로그인 및 API 세팅
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          Maza Studio에 오신 것을 환영합니다.<br />
          첫 단계로 빠르고 간편한 구글 소셜 로그인과 BYOK(Bring Your Own Key) 방식을 통한 API 키 등록 방법을 안내합니다.
        </p>
      </div>

      <div className="not-prose grid md:grid-cols-2 gap-6 mb-16">
        <div className="p-7 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
            <LogIn size={20} className="text-indigo-500" /> 구글 로그인
          </h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            복잡한 회원가입 없이 구글 계정으로 1초 만에 시작할 수 있습니다.
          </p>
        </div>
        <div className="p-7 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-3">
          <h4 className="text-base font-black text-indigo-800 tracking-tight flex items-center gap-2">
            <Key size={20} className="text-indigo-600" /> API 키 등록 (BYOK)
          </h4>
          <p className="text-sm text-indigo-600/80 font-medium leading-relaxed">
            무료 발급받은 Gemini API 키를 등록하여, 플랫폼 수수료 없이 AI를 무제한으로 사용하세요.
          </p>
        </div>
      </div>

      {/* Section 1: Google Login */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm">1</span>
          구글 계정으로 로그인하기
        </h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          마자 스튜디오는 별도의 회원가입 절차 없이, 사용 중이신 <strong>구글 계정</strong>을 통해 안전하게 로그인할 수 있습니다.
        </p>

        <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-8 shadow-sm">
          <img 
            src="/images/docs_login.png" 
            alt="Maza Studio 로그인 화면" 
            className="w-full h-auto block"
          />
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-sm text-blue-800">
          <h4 className="font-bold flex items-center gap-2 mb-2">
            <ShieldCheck size={18} /> 보안 안내
          </h4>
          <p className="leading-relaxed">
            마자 스튜디오는 오직 이메일 주소와 프로필 기본 정보만 접근하며, 비밀번호 등의 민감한 개인정보는 수집하지 않습니다. 
            모든 인증은 구글의 강력한 보안 시스템을 통해 안전하게 처리됩니다.
          </p>
        </div>
      </section>

      <hr className="border-slate-200 mb-16" />

      {/* Section 2: BYOK Setup */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm">2</span>
          API 키 발급 및 등록 (BYOK)
        </h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          마자 스튜디오는 사용자가 직접 발급받은 API 키를 사용하는 <strong>BYOK (Bring Your Own Key)</strong> 정책을 채택하고 있습니다. 
          이를 통해 월구독료나 충전금 없이, 구글이 제공하는 무료 할당량 내에서 무제한으로 블로그를 자동화할 수 있습니다.
        </p>

        <div className="space-y-8">
          {/* Step 2-1 */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">1) 구글 AI 스튜디오 접속</h3>
            <p className="text-slate-600 mb-4">
              아래 링크를 클릭하여 Google AI Studio에 접속한 후, 우측 상단의 <strong>[Get API key]</strong> 버튼을 클릭합니다.
            </p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="not-prose inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Google AI Studio 바로가기 <ExternalLink size={16} />
            </a>
          </div>

          {/* Step 2-2 */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">2) 새 API 키 생성</h3>
            <p className="text-slate-600 mb-4">
              [Create API key] 버튼을 누르고, 새 프로젝트에서 생성하기를 선택하면 긴 문자열의 API 키가 발급됩니다. 이 키를 복사합니다.
            </p>
            <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-8 shadow-sm">
              <img 
                src="/images/docs_ai_studio.png" 
                alt="Google AI Studio 키 발급 화면" 
                className="w-full h-auto block"
              />
            </div>
          </div>

          {/* Step 2-3 */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">3) 마자 스튜디오에 등록</h3>
            <p className="text-slate-600 mb-4">
              마자 스튜디오 우측 상단의 프로필을 클릭하여 <strong>[설정(Settings)]</strong> 메뉴로 들어갑니다. 
              API 설정 항목에 방금 복사한 키를 붙여넣고 저장합니다.
            </p>
            <div className="not-prose rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <img 
                src="/images/docs_byok_setting.png" 
                alt="마자 스튜디오 BYOK 키 등록 화면" 
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Navigation or Next Step Hint can be added by the layout, so we just end the article here. */}
    </article>
  );
}
