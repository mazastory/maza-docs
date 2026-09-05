import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, FileText, Globe2, TrendingUp, ShieldCheck, Zap, AlertTriangle, BookOpen } from "lucide-react";

// Whitepaper Content Data
const chapters = [
  {
    id: "ch1",
    title: "1. 도메인 매각 노하우",
    subtitle: "가치 있는 도메인 선점과 매각",
    icon: <Globe2 className="w-5 h-5" />,
    content: (
      <>
        <h2>1. 도메인 매각 노하우 (Domain Flipping)</h2>
        <p>디지털 자산 매각의 가장 첫 단계는 '도메인' 그 자체의 가치를 극대화하는 것입니다. 트래픽이나 애드센스 수익이 없어도, 도메인만으로 수천 달러에 거래되는 <strong>'도메인 플리핑(Domain Flipping)'</strong>은 이미 거대한 비즈니스입니다.</p>
        
        <h3>어떤 도메인이 비싸게 팔리는가?</h3>
        <ul>
            <li><strong>Expired Domains (만료 도메인):</strong> 과거에 정상적으로 운영되다가 만료된 도메인은 이미 구글에 색인된 역사(Age)와 타 사이트로부터 받은 백링크(Backlink) 점수를 유지하고 있습니다. 이런 도메인을 낙찰받아 마자로 사이트를 씌우면, 신규 도메인보다 훨씬 비싼 가치를 인정받습니다.</li>
            <li><strong>Brandability (브랜드 확장성):</strong> 'best-running-shoes-2026.com' 같은 너무 좁은 EMD 보다는, 'RunnerAvenue.com'처럼 브랜드화가 가능한 포괄적인 이름이 2026년 매각 트렌드에서 훨씬 높은 평가를 받습니다.</li>
            <li><strong>.com의 절대 권력:</strong> 아무리 새로운 최상위 도메인이 유행해도, 미디어 블로그 시장의 바이어들은 90% 이상 무조건 '.com'을 선호합니다.</li>
        </ul>

        <div className="highlight-box">
            <h4>💡 MAZA Studio 매각 전략</h4>
            <p>마자로 찍어낼 사이트의 도메인을 고를 때, ExpiredDomains.net에서 백링크가 살아있는 2~3년 된 만료 도메인을 10달러에 구매하세요. 마자로 글 100개를 세팅해 한 달만 돌리면, 바이어들은 "오래된 도메인 + 풍부한 콘텐츠" 조합에 500달러 이상을 지불합니다.</p>
        </div>
      </>
    )
  },
  {
    id: "ch2",
    title: "2. 스타터 사이트 판매",
    subtitle: "빈 껍데기 블로그로 수익 창출",
    icon: <Zap className="w-5 h-5" />,
    content: (
      <>
        <h2>2. 스타터 사이트(Starter Site) 매각 전략</h2>
        <p>초보자들이 가장 오해하는 것이 <strong>"수익이 나야만 블로그를 팔 수 있다"</strong>는 생각입니다. 하지만 플리파(Flippa)에는 월 수익이 $0 인 이른바 '스타터 사이트(Starter Site)'만을 전문적으로 사들이는 거대한 바이어층이 존재합니다.</p>

        <h3>빈 껍데기 100개 글이 500달러가 되는 마법</h3>
        <p>미국의 바이어들은 워드프레스 테마 세팅, 플러그인 설정, 초기 100개의 글을 작성하는 '초기 인프라 구축'을 극도로 귀찮아합니다. 이들은 이미 구글의 샌드박스(Sandbox) 기간을 거치고, 기초 콘텐츠가 꽉 차 있는 <strong>'레디메이드(Ready-made)' 사이트</strong>를 사서 즉시 광고를 붙이기를 원합니다.</p>

        <ul>
            <li><strong>마이크로 니치(Micro-Niche) 타겟팅:</strong> '건강' 같은 광범위한 주제가 아니라, '실내 고양이 당뇨병 관리' 처럼 극도로 뾰족한 주제로 100개의 글을 묶어야 바이어가 좋아합니다.</li>
            <li><strong>실로 아키텍처(Silo Architecture):</strong> 100개의 글이 서로 완벽하게 내부 링크로 연결되어 있는 SEO 구조를 보여주면 가치가 급상승합니다.</li>
            <li><strong>구글 색인(Indexing) 증명:</strong> 구글 서치콘솔에 해당 100개의 글이 정상적으로 '색인(Index)' 되었다는 스크린샷 하나가 수백 달러의 가치를 만들어냅니다.</li>
        </ul>

        <div className="highlight-box">
            <h4>💡 MAZA 턴키(Turn-key) 전략</h4>
            <p>마자를 이용해 하루 만에 100개의 고품질 영어 글을 생성하고 2달 정도 묵혀둡니다. 구글 색인이 완료되면 이를 Flippa에 "SEO 최적화가 끝난 스타터 사이트"로 올립니다. 원가 15달러로 만든 사이트가 최소 200~500달러에 팔려나가는 마진 3000%의 비즈니스입니다.</p>
        </div>
      </>
    )
  },
  {
    id: "ch6",
    title: "6. 남의 땅에 집 짓지 마라",
    subtitle: "티스토리/네이버의 뼈아픈 진실",
    icon: <AlertTriangle className="w-5 h-5" />,
    content: (
      <>
        <h2>6. 남의 땅에 집 짓지 마라: 티스토리/네이버의 뼈아픈 진실</h2>
        <p>기존 고객들과 대화하다 보면 이런 질문을 자주 받습니다. <br/><em>"제가 키우던 티스토리나 네이버 블로그도 마자로 고쳐서 팔 수 있나요?"</em></p>
        
        <div className="warning-box">
            <h4>⚠️ 팩트 폭행: 당신의 티스토리는 당신의 자산이 아닙니다.</h4>
            <p>냉정하게 들리겠지만, 남의 땅(플랫폼)에 지은 집은 절대 자산이 될 수 없습니다. 내일 카카오가 티스토리 서버를 닫거나 정책을 바꿔도 당신은 아무런 권리를 주장할 수 없습니다. 소유권(도메인 통제권)이 없는 자산을 플리파에서 타인에게 비싸게 판다고요? 그건 미국 바이어들을 속이는 행위이자 사기(Fraud)입니다.</p>
        </div>

        <h3>마자의 해답: "버리고 독립하라"</h3>
        <p>마자는 남의 플랫폼에 기생하는 방식을 단호히 거부합니다. 기존에 네이버나 티스토리에 쏟았던 당신의 텍스트 콘텐츠(원고)만 긁어서 마자로 가져오세요. 마자는 그 콘텐츠를 <strong>당신이 100% 소유권을 가진 독립 도메인(Maza Astro 시스템)</strong> 위에 새롭게 건축해 드립니다. 그것이 진짜 디지털 자산가로 가는 유일한 길입니다.</p>
      </>
    )
  },
  {
    id: "ch9",
    title: "9. 2026 플리파 트렌드",
    subtitle: "CEO Blake Hutchison 인사이트",
    icon: <TrendingUp className="w-5 h-5" />,
    content: (
      <>
        <h2>9. 2026 플리파(Flippa) 트렌드 & CEO 인사이트</h2>
        <p>마자 스튜디오가 향하는 비전은 정확히 2026년 플리파의 행보와 맞닿아 있습니다. Flippa의 CEO <strong>Blake Hutchison</strong>의 최신 인터뷰와 마켓 동향을 요약했습니다.</p>

        <h3>"마이크로 M&A의 폭발, 그리고 AI의 도입"</h3>
        <ul>
            <li><strong>Lauren AI의 등장:</strong> 2026년, Flippa는 바이어가 원하는 매물을 찾아주는 AI 딜 소싱 에이전트 'Lauren AI'를 전면에 내세웠습니다. 바이어들이 '안전하고 검증된(Verified)' 자산만을 필터링해서 사고 싶어 한다는 뜻입니다. <strong>마자 인증 뱃지(QC Badge)</strong>가 강력한 힘을 발휘하는 이유입니다.</li>
            <li><strong>AI Generated Asset의 재평가:</strong> 2026년 CEO Blake의 스탠스는 <em>"AI가 생산했든 사람이 썼든, 트래픽을 만들고 구조(Structure)가 탄탄한 콘텐츠는 자산이다."</em> 즉, 마자처럼 품질 관리를 통과한 정교한 AI 콘텐츠 그룹은 정당한 밸류에이션을 받기 시작했습니다.</li>
            <li><strong>1인 미디어 기업의 M&A:</strong> 개인이 집에서 30개의 마이크로 블로그 네트워크를 구축하고, 이를 패키지로 10만 달러에 매각하는 'Solo-M&A'가 2026년 플리파의 가장 뜨거운 섹터입니다.</li>
        </ul>

        <div className="highlight-box">
            <h4>🎯 최종 결론</h4>
            <p>마자 스튜디오는 단순한 '블로그 자동 포스팅 프로그램'이 아닙니다. 마자는 당신을 2026년 글로벌 마이크로 M&A 시장에 가장 빠르고 안전하게 상장시켜 줄 <strong>디지털 자산 생산 및 매각 솔루션</strong>입니다.</p>
        </div>
      </>
    )
  }
];

export default function Whitepaper() {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);

  // Auto-scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeChapter]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 md:fixed md:h-screen md:overflow-y-auto z-20 shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">MAZA 백서</h1>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Global Business 2026</p>
        </div>
        
        <nav className="p-4 space-y-1">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => setActiveChapter(chapter.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                activeChapter === chapter.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div>
                <div className={`font-bold text-sm mb-0.5 ${activeChapter === chapter.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {chapter.title}
                </div>
                <div className={`text-xs ${activeChapter === chapter.id ? 'text-indigo-500 font-medium' : 'text-slate-400'}`}>
                  {chapter.subtitle}
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeChapter === chapter.id ? 'text-indigo-500 translate-x-1' : 'text-slate-300 group-hover:translate-x-0.5'}`} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-80">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
          <AnimatePresence mode="wait">
            {chapters.map((chapter) => (
              activeChapter === chapter.id && (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="prose-doc"
                >
                  {chapter.content}
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </main>
      
      {/* Back to Home Button */}
      <Link to="/" className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-full font-bold shadow-xl shadow-slate-900/20 hover:scale-105 transition-transform flex items-center gap-2 z-50">
        홈으로 가기
      </Link>
    </div>
  );
}
