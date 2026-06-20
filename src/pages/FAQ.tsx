import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Globe, 
  ChevronRight, Info, Search
} from 'lucide-react';

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
  },
  {
    category: "SEO 및 검색 노출",
    icon: Search,
    questions: [
      { q: "사이트맵을 제출했는데 서치 콘솔 실적이 0입니다. 정상인가요?", a: "네, 지극히 정상입니다. 사이트맵 제출 후 구글 봇이 새 사이트를 인지하고 색인을 생성하여 결과에 반영하기까지 보통 3일~7일 정도가 소요됩니다." },
      { q: "구글 색인(Indexing) 속도를 빠르게 앞당기는 방법이 있나요?", a: "가장 확실한 방법은 구글 서치 콘솔 상단 검색창에 블로그 메인 주소(예: https://example.com/)를 입력하고 '색인 생성 요청' 버튼을 수동으로 누르는 것입니다. 구글 봇을 VIP 호출하는 효과가 있습니다.\n\n또한, 오토파일럿을 통해 하루 5개씩 일정한 시간에 꾸준히 발행하는 것이 가장 좋습니다. 구글 봇의 크롤링 주기가 짧아져 나중에는 글이 올라오자마자 색인되는 수준에 이르게 됩니다. 추가로 트위터(X)나 핀터레스트, 지식iN 등에 최신 글 링크를 2~3개 공유해 두면 구글 봇이 링크를 타고 들어와 색인 속도가 비약적으로 빨라집니다." },
      { q: "색인 요청 시 블로그 메인 주소를 넣어야 하나요, 아니면 개별 글 주소를 넣어야 하나요?", a: "초기 단계이거나 평상시에는 '메인 주소(예: https://example.com/)'만 한 번 넣어두시면 됩니다. 구글 봇이 메인 페이지에 방문해 최신 글들의 링크를 알아서 타고 들어갑니다.\n\n다만, '이 글은 방금 썼는데 1시간 만에 당장 구글에 띄워야 해!' 하는 특정 핵심 글이 있다면 그 글의 '정확한 전체 URL 주소'를 서치콘솔에 넣어 개별적으로 색인을 요청하시면 됩니다." },
      { q: "글 제목이 한글인데 복사하니 외계어(% 기호 등)처럼 뜹니다. 이대로 서치 콘솔에 넣어도 되나요?", a: "네, 지극히 정상입니다! 인터넷 브라우저가 한글 주소를 컴퓨터가 읽기 편한 기호로 자동 변환(URL 인코딩)해 주는 현상입니다.\n\n구글은 이 외계어 같은 주소를 원래의 한글 제목으로 똑똑하게 인식하므로, 주소창에 뜨는 전체 주소를 쭉 복사해서 변환된 그대로 서치 콘솔에 넣고 엔터를 치시면 완벽합니다." }
    ]
  }
];

interface FAQProps {
  initialCategory?: string;
  hideNav?: boolean;
}

export default function FAQ({ initialCategory, hideNav = false }: FAQProps) {
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
      <div className="max-w-4xl mx-auto space-y-20">
        
        {/* Minimal Header */}
        <div className="space-y-6 border-b border-slate-200 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 font-black text-[9px] uppercase tracking-widest">
            <Info size={12} /> 공식 가이드 및 지원
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
            자주 묻는 질문 <span className="text-indigo-600">(FAQ)</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-xl">
            마자 스튜디오의 기술적 철학과 서비스 이용에 관한 핵심 답변을 정리했습니다. <br />
            원하시는 질문을 클릭하여 상세 내용을 확인하세요.
          </p>
        </div>

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

