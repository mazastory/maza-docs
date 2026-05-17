import React from 'react';
import { FileText, CheckCircle2, AlertCircle, Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-32 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* HEADER */}
        <div className="space-y-6 border-b border-slate-100 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Scale size={14} /> 서비스 이용 약관
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            이용약관 <span className="text-indigo-600">(Terms of Service)</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">업데이트 날짜: 2026년 5월 6일</p>
        </div>

        {/* SECTIONS */}
        <div className="space-y-12">
          
          <TermSection num="1" title="목적">
            본 약관은 마자 스튜디오(이하 "회사")가 제공하는 애드센스 승인 보조 서비스 및 AI 콘텐츠 생성기, 크롬 익스텐션(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.
          </TermSection>

          <TermSection num="2" title="정의">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="font-black text-indigo-600 shrink-0">•</span>
                <span><strong>"서비스"</strong>란 회사가 제공하는 AI 글쓰기 보조, 애드센스 챌린지 코칭, 블로그 자동화 도구(웹사이트 및 익스텐션 포함)를 의미합니다.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-black text-indigo-600 shrink-0">•</span>
                <span><strong>"회원"</strong>이란 서비스에 접속하여 본 약관에 동의하고 계정을 생성하여 서비스를 이용하는 자를 말합니다.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-black text-indigo-600 shrink-0">•</span>
                <span><strong>"콘텐츠"</strong>란 회원이 서비스를 통해 생성한 텍스트, 이미지 등의 결과물을 의미합니다.</span>
              </li>
            </ul>
          </TermSection>

          <TermSection num="3" title="약관의 명시와 개정">
            회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시에는 적용 일자 및 개정 사유를 명시하여 사전에 공지합니다.
          </TermSection>

          {/* HIGHLIGHTED SECTION 4 */}
          <div className="p-10 rounded-[40px] bg-slate-900 text-white space-y-8 shadow-2xl">
             <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm not-italic">4</div>
                서비스의 내용 및 이용과 책임 제한
             </h2>
             
             <div className="space-y-6 text-slate-300 leading-loose">
                <p className="font-bold">회사는 AI를 활용한 블로그 포스팅 초안 생성 기능을 제공합니다. 회원이 서비스를 통해 생성한 콘텐츠의 저작권은 회원에게 귀속되며, 회원은 이를 자유롭게 블로그에 게시할 수 있습니다.</p>
                
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                   <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-widest">
                      <AlertCircle size={14} /> 중요: 책임 제한 안내
                   </div>
                   <p className="text-sm font-medium leading-relaxed">
                     AI가 생성한 콘텐츠의 사실 여부, 정확성, 저작권 침해 여부 등 최종 확인 및 발행의 책임은 회원 본인에게 있습니다. 회사는 애드센스 승인을 보장하지 않으며, 이로 인한 어떠한 손해에 대해서도 법적 책임을 지지 않습니다.
                   </p>
                </div>
             </div>
          </div>

          <TermSection num="5" title="사용자의 의무">
             회원은 계정 정보를 안전하게 관리해야 합니다. 타인의 권리를 침해하거나 불법적인 목적으로 서비스를 이용해서는 안 되며, 서비스 시스템에 부하를 주는 행위는 금지됩니다.
          </TermSection>

          <TermSection num="6" title="서비스 중단 및 면책">
             회사는 시스템 점검, 교체, 고장 등 불가항력적인 사유가 발생한 경우 서비스 제공을 일시적으로 중단할 수 있습니다. 무료 서비스의 경우 관련법에 특별한 규정이 없는 한 책임을 지지 않습니다.
          </TermSection>

          {/* FOOTER */}
          <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-2">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">고객 지원 및 문의</div>
               <div className="text-2xl font-black text-slate-900 italic">hello@mazastudio.kr</div>
            </div>
            <div className="text-right">
               <p className="text-slate-400 font-bold text-xs">마자 스튜디오 고객지원팀</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function TermSection({ num, title, children }: { num: string, title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
        <span className="text-indigo-600 italic">0{num}.</span>
        {title}
      </h3>
      <div className="pl-12 text-slate-600 font-medium leading-relaxed text-lg">
        {children}
      </div>
    </div>
  );
}
