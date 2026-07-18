import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, ShieldAlert, ArrowRightCircle, ExternalLink, GraduationCap, AlertOctagon } from 'lucide-react';

export default function PageGooglePoliciesDefense() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <GraduationCap size={11} /> Maza Academy
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          구글 공식 정책 방어 가이드
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          마자 스튜디오의 핵심 비즈니스 모델(3-Zero 시스템)이 구글의 엄격한 정책을 어떻게 <strong>100% 합법적(White-Hat)으로 준수</strong>하고 있는지 
          증명하는 공식 방어 가이드입니다. 외부에서 의문을 제기할 때 완벽한 방어 논리로 활용하세요.
        </p>
      </div>

      {/* Section 1 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <ShieldCheck className="text-emerald-500" /> 1. 무한 서브도메인 광고 게재 (ZERO-LIMIT)
        </h2>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black shrink-0">Q</div>
            <p className="font-bold text-slate-800 text-lg mt-1">"서브도메인마다 애드센스 승인을 따로 안 받아도 진짜 괜찮아?"</p>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
            <h4 className="font-bold text-emerald-900 flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} /> 공식 방어 논리
            </h4>
            <p className="text-sm text-emerald-800 leading-relaxed">
              2023년 애드센스 '사이트(Sites)' 탭 개편 공지에 따라, <strong>"루트 도메인이 승인 상태라면 하위 도메인은 별도 승인 과정 없이 즉시 광고를 송출할 수 있다"</strong>고 명시되어 있습니다. 
              이는 주 도메인의 승인 권한을 하위 도메인이 합법적으로 계승한다는 구글의 공식 정책입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <ShieldAlert className="text-amber-500" /> 2. 서브도메인 블로그 대량 운영 (ZERO-LIMIT 안전성)
        </h2>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black shrink-0">Q</div>
            <p className="font-bold text-slate-800 text-lg mt-1">"최근 구글이 서브도메인 빌려주는 거 다 스팸 처리한다던데?"</p>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-5">
            <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} /> 공식 방어 논리
            </h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              2024년 발효된 '사이트 평판 악용' 처벌 대상은 <strong>"소유자의 감독 없이 제3자에게 서브도메인을 임대해 주는 행위"</strong>입니다. 
              마자 스튜디오처럼 <strong>'본인이 소유한 루트 도메인 아래에서 본인이 직접 통제하는 서브도메인을 운영'</strong>하는 것은 100% 합법적이며 임대업자가 아님을 명확히 방어할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <FileText className="text-blue-500" /> 3. AI 대량 발행 관련 근거 (ZERO-WORK)
        </h2>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black shrink-0">Q</div>
            <p className="font-bold text-slate-800 text-lg mt-1">"AI로 글 대량 발행하면 저품질(스팸) 먹는 거 아니야?"</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
            <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} /> 공식 방어 논리
            </h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              구글은 공식 블로그를 통해 <strong>"콘텐츠가 어떻게(AI로) 만들어졌는지가 아니라, 얼마나 유용한지(E-E-A-T)가 중요하다"</strong>고 선언했습니다. 
              마자 스튜디오처럼 점진적인 발행 스케줄링(초기 1~2개 발행)을 지키고 SEO 구조화 데이터를 갖추는 것은 고품질 콘텐츠로 인정받는 구글 공식 권장 가이드에 부합합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section>
        <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-2xl font-black text-indigo-400 mb-6 flex items-center gap-2">
            💡 요약 결론 (Elevator Pitch)
          </h2>
          
          <div className="bg-white/10 rounded-xl p-6 border border-white/10">
            <p className="text-lg text-slate-100 leading-relaxed font-medium italic">
              "구글이 서브도메인은 승인 없이 광고 달라고 시스템을 열어줬고, 본인 소유의 도메인이면 스팸도 아니며, 
              AI 자체도 유용하게 쓰면 적극 허용한다고 구글 공식 문서에 똑똑히 적혀있습니다. 
              <br/><br/>
              <span className="text-emerald-400 not-italic font-black">
                마자 스튜디오는 이 규정들을 100% 철저하게 준수하는 완벽한 화이트햇(White-Hat) 시스템입니다.
              </span>"
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
