import React from 'react';
import { Shield, Lock, Eye, CheckCircle2, Globe, Database, Server, Trash2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-32 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* HEADER */}
        <div className="space-y-6 border-b border-slate-100 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Shield size={14} /> Official Legal Document
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            개인정보처리방침 <span className="text-indigo-600">(Privacy Policy)</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Last Updated: May 15, 2026</p>
        </div>

        {/* GOOGLE REVIEWER QUICK SUMMARY - HIGH PROMINENCE */}
        <div className="bg-slate-900 text-white p-10 rounded-[40px] space-y-6 shadow-2xl border-b-8 border-indigo-600 animate-in fade-in zoom-in duration-700">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Globe size={24} className="text-white" />
             </div>
             <h2 className="text-2xl font-black italic tracking-tighter uppercase">Google OAuth Verification Summary</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 text-[13px] font-medium text-slate-300 leading-relaxed">
             <div className="space-y-4">
                <p><span className="text-white font-black border-b border-indigo-500">Identity:</span> MazaStudio (Project ID: <span className="text-indigo-400">mazastory</span>) is an automation platform for professional bloggers.</p>
                <p><span className="text-white font-black border-b border-indigo-500">Limited Use Disclosure:</span> Our use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-indigo-400 underline hover:text-indigo-300" target="_blank" rel="noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
             </div>
             <div className="space-y-4">
                <p><span className="text-white font-black border-b border-indigo-500">Data Protection:</span> Sensitive data is protected using **AES-256 encryption at rest** and **TLS 1.2+ encryption in transit**. Access is strictly governed by RBAC (Role-Based Access Control).</p>
                <p><span className="text-white font-black border-b border-indigo-500">No Human Review:</span> We implement a strict **"No Human Review"** policy. Google user data is processed automatically and is never viewed by personnel except for specific support requests.</p>
             </div>
          </div>
        </div>

        {/* SECTION 1: DETAILED DATA PROTECTION */}
        <div className="space-y-10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl">1</div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">구글 데이터 보호 메커니즘 <span className="text-indigo-600">(Google Data Protection)</span></h2>
           </div>

           <div className="grid gap-6">
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600"><Lock size={20} /></div>
                    <div className="space-y-2">
                       <h3 className="font-black text-slate-900 text-lg">데이터 암호화 (Encryption Standards)</h3>
                       <p className="text-sm text-slate-600 leading-relaxed">
                          마자 스튜디오는 구글 OAuth 토큰 및 모든 민감 정보를 **AES-256 (Advanced Encryption Standard)** 알고리즘을 사용하여 데이터베이스 레벨에서 물리적으로 암호화하여 저장합니다. 또한, 서버와 구글 API 간의 모든 통신은 **TLS 1.2 이상(HTTPS)**의 암호화된 채널을 통해서만 이루어집니다.
                       </p>
                       <p className="text-[12px] text-slate-400 font-medium italic">
                          MazaStudio protects Google OAuth tokens and sensitive data using AES-256 encryption at rest. All data transfers are conducted over TLS 1.2+ encrypted channels (HTTPS).
                       </p>
                    </div>
                 </div>

                 <div className="h-[1px] bg-slate-200" />

                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600"><Eye size={20} /></div>
                    <div className="space-y-2">
                       <h3 className="font-black text-slate-900 text-lg">인적 검토 방지 (No Human Review Policy)</h3>
                       <p className="text-sm text-slate-600 leading-relaxed">
                          우리는 시스템에 의해 처리되는 사용자의 구글 데이터에 대해 **인적 검토(Human Review)를 원칙적으로 금지**합니다. 직원은 사용자의 명시적인 요청(고객 지원)이 있거나 법적인 의무가 발생하는 예외적인 경우를 제외하고는 사용자의 구글 데이터를 열람할 수 없습니다.
                       </p>
                       <p className="text-[12px] text-slate-400 font-medium italic">
                          MazaStudio strictly prohibits human review of user data obtained via Google APIs. Access is restricted to support requests or legal compliance.
                       </p>
                    </div>
                 </div>

                 <div className="h-[1px] bg-slate-200" />

                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600"><Server size={20} /></div>
                    <div className="space-y-2">
                       <h3 className="font-black text-slate-900 text-lg">접근 제어 및 모니터링 (Access Control)</h3>
                       <p className="text-sm text-slate-600 leading-relaxed">
                          인프라에 대한 모든 접근은 **역할 기반 접근 제어(RBAC)** 및 **다요소 인증(MFA)**에 의해 엄격히 관리됩니다. 모든 시스템 접근 시도는 실시간으로 로깅되며, 정기적인 보안 감사를 통해 무단 접근을 차단합니다.
                       </p>
                       <p className="text-[12px] text-slate-400 font-medium italic">
                          System access is governed by Role-Based Access Control (RBAC) and Multi-Factor Authentication (MFA), with 24/7 logging and auditing.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* SECTION 2: DATA COLLECTION */}
        <div className="space-y-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl">2</div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">개인정보 수집 및 항목</h2>
           </div>
           
           <div className="grid gap-4">
              {[
                { title: "회원가입 시", content: "이메일 주소, 프로필 정보 (Google/Supabase Auth)" },
                { title: "서비스 이용 시", content: "블로그 URL, 티스토리 닉네임, AI 생성 콘텐츠 로그" },
                { title: "OAuth 연동 시", content: "Google Search Console 데이터, GA4 관리 권한 (사용자 승인 범위 내)" },
                { title: "익스텐션 이용 시", content: "발행 결과 보고 데이터, 세션 유지용 암호화 토큰" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-6 p-8 bg-white border border-slate-50 rounded-3xl hover:border-indigo-100 transition-colors">
                  <div className="w-48 shrink-0 font-black text-indigo-600 text-sm uppercase tracking-tighter">{item.title}</div>
                  <div className="text-slate-600 font-medium">{item.content}</div>
                </div>
              ))}
           </div>
        </div>

        {/* SECTION 3: PURPOSE */}
        <Section num="3" title="개인정보의 처리 목적">
          <p>마자 스튜디오는 수집된 정보를 다음의 목적을 위해 사용합니다:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2 text-sm font-medium">
             <li>사용자 식별 및 본인 인증</li>
             <li>구글 서치콘솔 자동 등록 및 사이트 소유권 확인</li>
             <li>구글 애널리틱스 4(GA4) 속성 생성 및 데이터 분석 제공</li>
             <li>AI 기반 블로그 콘텐츠 생성 및 자동 발행 서비스 운영</li>
             <li>고객 문의 응대 및 기술적 오류 해결</li>
          </ul>
        </Section>

        {/* SECTION 4: RETENTION & DELETION */}
        <div className="p-10 bg-indigo-900 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
           <div className="flex items-center gap-3 relative">
              <Trash2 size={24} className="text-indigo-400" />
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">4. Data Retention & Deletion Policy</h2>
           </div>
           <div className="space-y-4 relative">
              <p className="text-indigo-100 leading-relaxed font-medium">
                마자 스튜디오는 사용자가 서비스를 이용하는 동안에만 개인정보를 보유하며, **회원 탈퇴 시 모든 연동 정보와 수집된 데이터는 시스템에서 24시간 이내에 즉시 파기**됩니다.
              </p>
              <div className="h-[1px] bg-indigo-500/30 my-4" />
              <p className="text-indigo-300 italic font-bold text-[12px] leading-relaxed">
                MazaStudio retains user data only while the account is active. Upon account deletion, all integrated records and personal data are permanently erased from our servers within 24 hours. Users may request data deletion at any time via the Maza dashboard or by emailing hello@mazastudio.kr.
              </p>
           </div>
        </div>

        {/* OTHER SECTIONS */}
        <div className="grid md:grid-cols-2 gap-8">
           <div className="p-8 border border-slate-100 rounded-[32px] space-y-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2"><CheckCircle2 size={18} className="text-indigo-600" /> 제3자 제공 정책</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                 우리는 사용자의 개인정보를 광고 목적으로 제3자에게 판매하거나 제공하지 않습니다. 서비스 인프라 운영을 위해 Supabase, Google Cloud Platform 등 보안성이 검증된 파트너사만을 이용합니다.
              </p>
           </div>
           <div className="p-8 border border-slate-100 rounded-[32px] space-y-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2"><CheckCircle2 size={18} className="text-indigo-600" /> 정보주체의 권리</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                 사용자는 언제든지 자신의 정보를 조회, 수정할 수 있으며 서비스 탈퇴를 통해 데이터 제공 동의를 철회할 수 있습니다.
              </p>
           </div>
        </div>

        {/* FOOTER CONTACT */}
        <div className="p-12 bg-slate-900 rounded-[48px] text-white flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-4">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">7. Contact Support</h2>
              <div className="space-y-1">
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">개인정보 보호 담당 및 문의</p>
                 <div className="text-xl font-black">마자 스튜디오 고객지원팀</div>
              </div>
           </div>
           <a href="mailto:hello@mazastudio.kr" className="h-16 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center font-black transition-all shadow-xl shadow-indigo-600/20">
              hello@mazastudio.kr
           </a>
        </div>

      </div>
    </div>
  );
}

function Section({ num, title, children }: { num: string, title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
         <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl">{num}</div>
         <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
      </div>
      <div className="pl-16 text-slate-600 font-medium leading-relaxed">{children}</div>
    </div>
  );
}
