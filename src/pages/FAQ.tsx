import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Globe, 
  ChevronRight
} from 'lucide-react';
import DocsPageHeader from '../components/DocsPageHeader';

const FAQ_DATA = [
  {
    category: "애드센스 승인 가이드",
    icon: ShieldCheck,
    questions: [
      { q: "AI가 생성한 글도 애드센스 승인이 가능한가요?", a: "네, 가능합니다. 구글의 공식 입장은 'AI 생성 여부'보다 '콘텐츠의 유용성과 독창성'을 중시합니다. 마자 스튜디오의 Humanize 엔진은 단순 AI 텍스트를 구글의 E-E-A-T(경험, 전문성, 권위, 신뢰) 가이드라인에 맞게 재구성하여 승인 확률을 극대화합니다." },
      { q: "애드센스 승인까지 보통 얼마나 걸리나요?", a: "사용자의 도메인 상태와 포스팅 품질에 따라 다르지만, 마자의 오토파일럿 커리큘럼을 성실히 이행할 경우 평균 45일 이내에 승인 결과를 얻는 것을 목표로 합니다." },
      { q: "가치 없는 콘텐츠로 반려되었습니다. 어떻게 하죠?", a: "주로 텍스트 양이 부족하거나 정보의 가치가 낮을 때 발생합니다. 마자 스튜디오의 'Validation Score' 기능을 활용해 모든 포스팅이 80점 이상을 유지하도록 관리해 주세요." }
    ]
  },
  {
    category: "기술적인 궁금증",
    icon: Zap,
    questions: [
      { q: "원클릭 자동 구축(Zero-IT)은 어떤 원리인가요?", a: "사용자의 구글 계정 권한을 통해 서치콘솔 등록, GA4 속성 생성, 사이트맵 제출을 API로 자동 처리합니다. 복잡한 코딩이나 수동 등록 과정 없이 클릭 한 번으로 인프라가 구축됩니다." },
      { q: "크롬 익스텐션이 꼭 필요한가요?", a: "네, 티스토리의 API 정책 변경으로 인해 직접적인 서버 발행이 제한적입니다. 마자 익스텐션은 브라우저 세션을 통해 안전하게 글을 주입하므로 저품질 리스크를 최소화하며 발행할 수 있는 가장 안전한 방법입니다." }
    ]
  },
  {
    category: "정책 및 보안 안내",
    icon: Globe,
    questions: [
      { q: "구글 API 데이터는 어떻게 보호되나요?", a: "마자 스튜디오는 구글의 '제한적 사용(Limited Use)' 규정을 엄격히 준수합니다. 수집된 데이터는 오직 사용자의 사이트 세팅 목적으로만 사용되며, 제3자에게 판매되거나 마케팅 용도로 활용되지 않습니다." },
      { q: "계정 정지 위험은 없나요?", a: "마자는 구글의 웹마스터 가이드라인을 준수합니다. 과도한 스팸성 발행을 방지하기 위해 W-05 프로토콜(3시간 간격 발행)을 강제하여 계정의 안전을 최우선으로 보호합니다." }
    ]
  }
];

export default function FAQ() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // --- Dynamic SEO: FAQPage Schema ---
  React.useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_DATA.flatMap(cat => cat.questions.map(q => ({
        "@type": "Question",
        "name": q.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.a
        }
      })))
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-page-schema';
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    
    return () => {
      const existingScript = document.getElementById('faq-page-schema');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F8] pt-24 pb-32 px-8">
      <DocsPageHeader
        badge="공식 가이드 및 지원"
        title="자주 묻는 질문 (FAQ)"
        description="마자 스튜디오의 기술적 철학과 서비스 이용에 관한 핵심 답변을 정리했습니다. 원하시는 질문을 클릭하여 상세 내용을 확인하세요."
        ctaLinks={[
          { href: '/usage-guide', label: '기능 사용 가이드' },
          { href: '/installation-guide', label: '블로그 세팅 가이드' }
        ]}
      />

      <div className="max-w-4xl mx-auto space-y-20">
        {/* Categories & Questions in a single flow */}
        <div className="space-y-16">
           {FAQ_DATA.map((cat, i) => (
             <section key={i} className="space-y-8">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                      <cat.icon size={16} />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">{cat.category}</h3>
                </div>

                <div className="space-y-4">
                   {cat.questions.map((q, idx) => {
                     const id = `${cat.category}-${idx}`;
                     const isOpen = expandedFaq === id;
                     return (
                       <article key={id} className="group">
                          <button 
                            onClick={() => setExpandedFaq(isOpen ? null : id)}
                            className={`w-full px-8 py-7 bg-white border rounded-2xl flex items-center justify-between text-left transition-all ${isOpen ? 'border-indigo-600 shadow-xl ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}
                          >
                             <span className="font-bold text-slate-800 text-base leading-snug">{q.q}</span>
                             <ChevronRight className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-90 text-indigo-600' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="px-8 pt-6 pb-10 animate-in fade-in slide-in-from-top-2 duration-300">
                               <p className="text-slate-500 font-medium leading-loose text-base whitespace-pre-wrap pl-2 border-l-2 border-indigo-100">
                                 {q.a}
                               </p>
                            </div>
                          )}
                       </article>
                     );
                   })}
                </div>
             </section>
           ))}
        </div>

        {/* Simple Footer CTA */}
        <div className="pt-20 border-t border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-2">
             <p className="text-slate-900 font-black text-2xl italic tracking-tighter">더 궁금한 점이 있으신가요?</p>
             <p className="text-slate-400 text-sm font-bold">궁금한 점이 해결되지 않으셨나요? 공식 이메일로 문의하시면 신속히 답변 드립니다.</p>
          </div>
          <div className="bg-white border border-slate-100 px-8 py-5 rounded-2xl shadow-sm space-y-1">
             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">공식 지원 이메일</p>
             <p className="text-xl font-black text-slate-900 italic selection:bg-indigo-100">hello@mazastudio.kr</p>
          </div>
        </div>
      </div>
    </div>
  );
}

