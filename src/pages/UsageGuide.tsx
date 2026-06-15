import React, { useState, useEffect } from 'react';
import { 
  Zap, Compass, Image, Eye, ShieldAlert, Sparkles, BookOpen, 
  ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Play, Pause,
  Share2, Award, Heart, Cpu, FileText, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type UsageCategory = 'autopilot' | 'aiwriter' | 'visionwriter';

interface FeatureStep {
  title: string;
  desc: string;
  badge: string;
  image: string;
  tip?: string;
}

interface UsageData {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  desc: string;
  steps: FeatureStep[];
}

const USAGE_DATA: Record<UsageCategory, UsageData> = {
  autopilot: {
    title: "오토파일럿 (Autopilot)",
    subtitle: "자율주행 완전 자동 발행",
    icon: Cpu,
    color: "indigo",
    desc: "Niche Hunter에서 검증된 Winning Blueprint와 Keyword Vault를 통해 24시간 쉬지 않고 안전하게 블로그를 성장시키는 자율주행 엔진입니다.",
    steps: [
      {
        title: "1. Niche Hunter에서 Winning Blueprint 선택 🎯",
        desc: "애드센스 승인 및 고수익 테마가 미리 설계된 Blueprint 도서관에서 원하는 공략집을 선택합니다.",
        badge: "STEP 01: SELECT BLUEPRINT",
        image: "/screenshots/usage_autopilot_01.webp",
        tip: "블루프린트는 검색 엔진에 가장 부합하는 카테고리 구조와 키워드를 수학적으로 계산해 놓은 치트키입니다."
      },
      {
        title: "2. Keyword Vault 셔플 및 시리즈 예약 🎰",
        desc: "사전 발췌된 황금 키워드 금고(Vault)를 셔플 엔진을 돌려 무작위화하고, 순차적으로 배차(Scheduling)할 시리즈 테마를 설정합니다.",
        badge: "STEP 02: SHUFFLE & SERIES",
        image: "/screenshots/usage_autopilot_02.webp",
        tip: "동일 패턴의 글이 반복 발행되는 것을 막기 위해 반드시 랜덤 셔플 엔진을 거칩니다."
      },
      {
        title: "3. W-05 안전 쿨타임 스케줄러 가동 🛡️",
        desc: "발행 간격을 최소 3시간(10,800초) 이상으로 강제하여 저품질 필터링과 어뷰징 제재로부터 계정을 철저하게 방어합니다.",
        badge: "STEP 03: W-05 SCHEDULE",
        image: "/screenshots/usage_autopilot_03.webp",
        tip: "서버가 백그라운드에서 주기적으로 대기열을 체크하며, 실패 시 다음 발행 가능 타임으로 자동 재스케줄링(S-03)을 수행합니다."
      }
    ]
  },
  aiwriter: {
    title: "AI 라이터 (AI Writer)",
    subtitle: "실시간 초고품질 집필 엔진",
    icon: FileText,
    color: "sky",
    desc: "5단계(분석-목차-본문-이미지-SEO 최적화) 파이프라인을 거쳐, 구글 검색엔진이 열광하는 최적의 Rich-Text 포스팅을 실시간 스트리밍으로 집필합니다.",
    steps: [
      {
        title: "1. 주제 입력 및 목차 구조 설계 📝",
        desc: "작성하고 싶은 메인 키워드를 입력하면, AI가 상위 노출 중인 문서들을 분석해 H2, H3 헤딩이 유기적으로 조합된 완벽한 목차를 먼저 짜줍니다.",
        badge: "STEP 01: ANALYZE & OUTLINE",
        image: "/screenshots/usage_writer_01.webp",
        tip: "구글 SEO 100점 점수판을 실시간으로 확인하며 H2/H3 태그 개수를 마음껏 다듬으실 수 있습니다."
      },
      {
        title: "2. 실시간 Streaming 집필 모니터링 ⚡",
        desc: "AI가 목차별 본문을 실시간으로 타이핑하듯 한 단락씩 써내려갑니다. 유저는 관제탑에서 완성되어 가는 고품질 서사를 지켜보며 수정할 수 있습니다.",
        badge: "STEP 02: STREAMING WRITE",
        image: "/screenshots/usage_writer_02.webp",
        tip: "단순 텍스트 생성이 아닙니다. 표(Table), 인용구, 소제목 등이 가미된 애드센스 승인 특화 서식으로 집필됩니다."
      },
      {
        title: "3. SEO Validation 점수 검증 및 즉시 복사 🏆",
        desc: "본문 길이(1,500자 이상), 이미지 포함 여부, 내부 링크 앵커링 등 마자 100점 만점 검증 시스템을 완수하면, 클릭 한 번으로 서식 깨짐 없이 클립보드에 복사해 갈 수 있습니다.",
        badge: "STEP 03: VALIDATE & COPY",
        image: "/screenshots/usage_writer_03.webp",
        tip: "복사 버튼을 누르면 Rich-Text로 자동 복사되어 티스토리나 워드프레스 에디터에 붙여넣었을 때 서식이 100% 그대로 유지됩니다."
      }
    ]
  },
  visionwriter: {
    title: "비전 라이터 (Vision Writer)",
    subtitle: "경험 기반 (E-E-A-T) 독점 스토리텔러",
    icon: Image,
    color: "emerald",
    desc: "AI가 그리는 가상 이미지를 배제하고, 유저가 일상이나 여행에서 찍은 실제 스마트폰 사진을 세탁하여 구글이 최고 신뢰도를 부여하는 '인간적 경험 증명' 블로그 글을 생성합니다.",
    steps: [
      {
        title: "1. 나의 실제 사진(iPhone/Android) 업로드 📸",
        desc: "직접 다녀온 맛집, 여행지, 제품 리뷰 등 일상에서 폰으로 투박하게 찍어둔 실제 사진들을 마자 비전 라이터에 업로드합니다.",
        badge: "STEP 01: UPLOAD EXPERIENCE",
        image: "/screenshots/usage_vision_01.webp",
        tip: "구글은 AI 그림보다 인물, 동행인, 장소 등 인간의 숨결이 묻어난 현실 사진에 압도적인 가중치를 둡니다."
      },
      {
        title: "2. P-01 메타데이터 세탁 및 EXIF 청소 🧼",
        desc: "업로드된 원본 이미지에서 촬영 기기(아이폰/갤럭시 등) 정보를 제외한 GPS 정보, 촬영자 고유 정보 등 민감한 개인정보를 서버 사이드에서 흔적 없이 세탁(Scrubbing)합니다.",
        badge: "STEP 02: METADATA CLEANING",
        image: "/screenshots/usage_vision_02.webp",
        tip: "세탁 후, 기기 정보(Make/Model)만을 추출해 AI에게 넘겨 '이 기기로 2026년에 찍은 생생한 현장 경험'임을 인증하는 세련된 서사가 자동으로 생성됩니다."
      },
      {
        title: "3. 경험 인증 인장 (Verification Seal) 자동 삽입 🎖️",
        desc: "본문 하단에 기기 정보, 세탁 토큰, 그리고 경험 증명 코드가 내장된 시각적 배지가 자동으로 박혀 검색 심사 봇에게 완벽한 독창성(EEAT)을 어필합니다.",
        badge: "STEP 03: VERIFICATION SEAL",
        image: "/screenshots/usage_vision_03.webp",
        tip: "이 방식을 통해 작성된 경험 포스팅은 카테고리 권위(Topic Authority) 획득 및 상위 노출에 압도적으로 강력합니다."
      }
    ]
  }
};

export default function UsageGuide() {
  const [activeCategory, setActiveCategory] = useState<UsageCategory>('autopilot');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const activeData = USAGE_DATA[activeCategory];
  const steps = activeData.steps;

  // Reset states when category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveStep(0);
      setIsPlaying(false);
      setImageError(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  // Handle image load error to show premium fallback
  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageError(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [activeStep]);

  // Auto-play timer for slide deck
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const handleNext = () => setActiveStep((prev) => (prev + 1) % steps.length);
  const handlePrev = () => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);

  const getThemeColors = (color: string) => {
    switch (color) {
      case 'sky':
        return {
          bg: 'bg-sky-50',
          text: 'text-sky-600',
          border: 'border-sky-100',
          glow: 'shadow-sky-100',
          badgeBg: 'bg-sky-100',
          accent: 'sky'
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-600',
          border: 'border-emerald-100',
          glow: 'shadow-emerald-100',
          badgeBg: 'bg-emerald-100',
          accent: 'emerald'
        };
      case 'indigo':
      default:
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-600',
          border: 'border-indigo-100',
          glow: 'shadow-indigo-100',
          badgeBg: 'bg-indigo-100',
          accent: 'indigo'
        };
    }
  };

  const theme = getThemeColors(activeData.color);

  // Return elegant generated mockups if real screenshots are not present
  const getStepImage = () => {
    if (imageError) {
      if (activeCategory === 'autopilot') {
        return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"; // clean dashboard analytics
      }
      if (activeCategory === 'aiwriter') {
        return "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop"; // writing on notebook
      }
      if (activeCategory === 'visionwriter') {
        return "https://images.unsplash.com/photo-1502982722883-b4fc345cd7c3?q=80&w=1200&auto=format&fit=crop"; // photographer with phone/camera
      }
    }
    return steps[activeStep].image;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* 🚀 Header */}
      <header className="relative bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-xl rotate-3 hover:rotate-12 transition-transform duration-300">
              <Zap size={22} className="text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">Maza Pilot Edition</span>
              </div>
              <h1 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase mt-0.5">핵심 기능 사용 설명서</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="/installation-guide"
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-2xl border border-slate-200/50 transition-all flex items-center gap-2"
            >
              <Compass size={14} /> 인프라 설치 가이드
            </a>
            <a 
              href="/mysite"
              className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-slate-200 transition-all flex items-center gap-2 group"
            >
              내 블로그 관리로 이동 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        
        {/* 🗺️ Main Menu Navigation (Interactive Tabs) */}
        <section className="bg-white p-6 rounded-[36px] shadow-sm border border-slate-100/80">
          <div className="flex flex-col md:flex-row gap-4">
            {(Object.keys(USAGE_DATA) as UsageCategory[]).map((cat) => {
              const data = USAGE_DATA[cat];
              const isSelected = activeCategory === cat;
              const activeTheme = getThemeColors(data.color);
              
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-1 p-6 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden flex items-start gap-4 ${
                    isSelected 
                      ? `${activeTheme.bg} ${activeTheme.border} border-2 shadow-lg ${activeTheme.glow}` 
                      : "bg-slate-50 border-slate-200/50 hover:bg-slate-100/50"
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${isSelected ? "bg-white text-" + activeTheme.accent + "-600 shadow-md" : "bg-white border border-slate-200 text-slate-400"}`}>
                    <data.icon size={22} className={isSelected ? activeTheme.text : ""} />
                  </div>
                  <div className="space-y-1 z-10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">FEATURE SYSTEM</div>
                    <div className="text-base font-black text-slate-800">{data.title}</div>
                    <div className="text-[11px] font-semibold text-slate-500">{data.subtitle}</div>
                  </div>
                  {isSelected && (
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${activeTheme.accent}-500/5 rounded-full blur-2xl -mr-6 -mt-6`} />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 📺 Guide Interactive Theatre */}
        <section className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Steps Flow Controllers */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Context Summary Cards */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${theme.bg} ${theme.text}`}>
                <Sparkles size={11} className="animate-spin" /> {activeData.subtitle}
              </span>
              <h2 className="text-3xl font-black italic tracking-tighter text-slate-800">{activeData.title}</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{activeData.desc}</p>
            </div>

            {/* Stepper Steps List */}
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveStep(idx);
                      setIsPlaying(false);
                    }}
                    className={`w-full p-6 text-left rounded-3xl transition-all duration-300 flex items-start gap-4 border ${
                      isActive 
                        ? `bg-white shadow-xl ${theme.border} border-2 translate-x-2` 
                        : "bg-white hover:bg-slate-50/50 border-slate-100"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${isActive ? `${theme.bg} ${theme.text}` : "bg-slate-50 text-slate-400"}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className={`text-[9px] font-black uppercase tracking-widest ${isActive ? theme.text : "text-slate-400"}`}>
                        {step.badge}
                      </div>
                      <h4 className="text-sm font-black text-slate-800">{step.title}</h4>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2 pt-2 border-t border-slate-100">
                              {step.desc}
                            </p>
                            {step.tip && (
                              <div className={`p-4 ${theme.bg} rounded-2xl border ${theme.border} mt-3 flex items-start gap-2.5`}>
                                <CheckCircle2 size={14} className={`${theme.text} mt-0.5 flex-shrink-0`} />
                                <span className={`text-[10px] font-bold leading-relaxed ${theme.text}`}>{step.tip}</span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Premium Visual Stage */}
          <div className="lg:col-span-7 bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl space-y-6">
            
            {/* Visual Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-slate-900"></span>
                <span className="text-[10px] font-black text-slate-800 tracking-widest uppercase">Maza Pilot Guide Simulator</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 ${
                    isPlaying 
                      ? "bg-rose-50 text-rose-600 border border-rose-100" 
                      : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                  }`}
                >
                  {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                  {isPlaying ? 'PAUSE AUTO' : 'AUTO ROTATE'}
                </button>
                
                <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-0.5">
                  <button onClick={handlePrev} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-[11px] font-black text-slate-800 px-3 min-w-[50px] text-center">
                    {activeStep + 1} / {steps.length}
                  </span>
                  <button onClick={handleNext} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Screenshot Stage */}
            <div className="bg-slate-950 rounded-[36px] overflow-hidden aspect-[16/10] relative group shadow-2xl border border-slate-900/10">
              <img 
                src={getStepImage()}
                alt={steps[activeStep].title}
                onError={handleImageError}
                className="w-full h-full object-cover select-none group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
              
              {/* Overlay Glass Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-slate-950/80 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{steps[activeStep].badge}</div>
                  <h4 className="text-xs font-black text-white">{steps[activeStep].title}</h4>
                </div>
                <div className={`px-3 py-1 bg-white/10 text-white rounded-full text-[9px] font-black tracking-widest uppercase`}>
                  SCREENSHOT PREVIEW
                </div>
              </div>
            </div>

            {/* Bottom Alert/Notes */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm flex-shrink-0">
                <ShieldAlert size={18} />
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight">수익화 골든 룰 (Monetization Rule)</h5>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  모든 자동 발행 글은 구글 서치콘솔 색인 검증(Verification)을 마자의 인공지능이 매일 실시간으로 확인하며, 애드센스 광고 효율을 극대화하기 위해 적재적소에 애드센스 코드를 자동 배치합니다.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 🏆 Feature Comparison Table */}
        <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase">기능별 수익화 기여도 비교</h3>
            <p className="text-xs text-slate-400 font-medium">나의 집필 스타일과 블로그 목적에 맞는 최적의 도구를 조합해 보세요.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="pb-4 pl-4">발행 엔진 종류</th>
                  <th className="pb-4">구글 SEO 점수</th>
                  <th className="pb-4">집필 속도</th>
                  <th className="pb-4">가장 추천하는 용도</th>
                  <th className="pb-4">애드센스 승인 기여도</th>
                  <th className="pb-4 pr-4 text-right">핵심 장점</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
                <tr>
                  <td className="py-5 pl-4 flex items-center gap-2.5 font-black text-indigo-600"><Cpu size={16} /> 오토파일럿</td>
                  <td className="py-5 text-slate-800">80 ~ 90점 (우수)</td>
                  <td className="py-5 font-black text-slate-800">초당 1개 발행 가능</td>
                  <td className="py-5">대량의 주제 권위 확보</td>
                  <td className="py-5 text-emerald-500">★★★★☆ (매우 높음)</td>
                  <td className="py-5 pr-4 text-right font-black text-slate-800">24시간 자율 무인 발행</td>
                </tr>
                <tr>
                  <td className="py-5 pl-4 flex items-center gap-2.5 font-black text-sky-600"><FileText size={16} /> AI 라이터</td>
                  <td className="py-5 text-slate-800">95 ~ 100점 (만점급)</td>
                  <td className="py-5 font-black text-slate-800">건당 약 1.5분 소요</td>
                  <td className="py-5">핵심 전략 키워드 정밀 상위 노출</td>
                  <td className="py-5 text-emerald-500">★★★★★ (극상)</td>
                  <td className="py-5 pr-4 text-right font-black text-slate-800">실시간 목차 & SEO 가이드</td>
                </tr>
                <tr>
                  <td className="py-5 pl-4 flex items-center gap-2.5 font-black text-emerald-600"><Image size={16} /> 비전 라이터</td>
                  <td className="py-5 text-slate-800">98 ~ 100점 (독점 등급)</td>
                  <td className="py-5 font-black text-slate-800">건당 약 2분 소요</td>
                  <td className="py-5">실제 일상 맛집, 여행, 리뷰 발행</td>
                  <td className="py-5 text-emerald-500">★★★★★+ (치트키)</td>
                  <td className="py-5 pr-4 text-right font-black text-slate-800">사용자 사진 & EXIF 안심 세탁</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* 🛡️ Premium Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-20 border-t border-slate-200/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-bold text-slate-400">
        <div>© 2026 Maza Autopilot OS. All Rights Reserved.</div>
        <div className="flex items-center gap-6">
          <a href="/privacy" className="hover:text-slate-600">개인정보처리방침</a>
          <a href="/terms" className="hover:text-slate-600">이용약관</a>
          <a href="/faq" className="hover:text-slate-600">고객센터</a>
        </div>
      </footer>

    </div>
  );
}
