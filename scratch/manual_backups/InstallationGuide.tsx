import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Monitor, Settings, Sparkles, 
  AlertTriangle, ShieldCheck, Download, Plus, CheckCircle2, 
  Info, Lock, Play, Cpu, Layers, Award, Terminal, RefreshCw,
  ExternalLink, Globe, Eye, HelpCircle, HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const STEPS = [
  { 
    id: 'extension', 
    title: '익스텐션 1초 설치', 
    subtitle: 'Maza Bridge Chrome Extension', 
    icon: Globe, 
    color: 'indigo',
    badge: 'MUST INSTALL',
    slides: [
      {
        title: '01. 크롬 개발자 모드(Developer Mode) ON',
        description: '확장 프로그램 관리 페이지(chrome://extensions)로 이동하여 우측 상단의 "개발자 모드" 토글 스위치를 활성화합니다. 이 스위치를 켜야 로컬 폴더 패키지를 수동으로 설치할 수 있습니다.',
        imageBefore: '/screenshots/step_developer_off.png',
        imageAfter: '/screenshots/step_developer_on.png',
        isComparison: true,
        tips: ['스위치를 켜는 즉시 상단에 [압축해제된 확장 프로그램을 로드] 버튼이 생깁니다.', '보안 경고가 나타나지 않는 안전한 로컬 로딩 방식입니다.']
      },
      {
        title: '02. 압축해제된 확장 프로그램 로드',
        description: '다운로드한 Maza Bridge ZIP 파일의 압축을 해제합니다. 확장 프로그램 페이지 좌측 상단의 [압축해제된 확장 프로그램을 로드] 버튼을 클릭하고, 압축을 해제한 폴더를 통째로 선택합니다.',
        image: '/screenshots/step_01.png',
        tips: ['manifest.json 파일이 위치한 최상위 폴더를 선택해야 정상 설치됩니다.', '폴더 선택 완료 시 브라우저에 Maza Bridge 카드가 활성화됩니다.']
      },
      {
        title: '03. 크롬 상단 툴바 핀(Pin) 고정',
        description: '크롬 우상단 퍼즐 조각 아이콘(확장 프로그램 목록)을 누른 뒤, Maza Bridge 옆의 핀 아이콘을 클릭하여 활성화합니다. 이를 통해 실시간 자동 배차 및 주입 상태를 언제든지 모니터링할 수 있습니다.',
        imageLeft: '/screenshots/step_02.png',
        imageRight: '/screenshots/step_03.png',
        isDouble: true,
        tips: ['상단에 고정된 마자 로고를 클릭하면 사이드바가 즉시 열립니다.', '한 번만 설정해 두면 브라우저가 알아서 상태를 영속합니다.']
      },
      {
        title: '04. 웹앱 로그인 연동 및 Connected 확인',
        description: '익스텐션이 설치된 브라우저에서 마자스튜디오 웹에 로그인하면, 우측 사이드바 패늘의 상태가 즉시 초록색 [Connected]로 변경되며 실시간 주입 대기 상태로 진입합니다.',
        image: '/screenshots/step_08.png',
        tips: ['OAuth 기반 세션 연동으로 별도의 API 키나 토큰을 직접 입력할 필요가 없습니다.', '티스토리 에디터 창에 접속 시 자동으로 Matched 상태로 승격됩니다.']
      }
    ]
  },
  { 
    id: 'domain', 
    title: '블로그 인프라 세팅', 
    subtitle: 'Custom Domain & DNS Setup', 
    icon: Monitor, 
    color: 'emerald',
    badge: 'DOMAIN INFRA',
    slides: [
      {
        title: '01. 개인 도메인 주소 등록',
        description: '마자스튜디오 대시보드 및 챌린지 페이지에서 본인이 구입한 개인 도메인 주소(예: example.com)를 입력하고 연동을 요청합니다. 서브도메인을 포함하여 여러 개의 도메인을 등록할 수 있습니다.',
        image: '/screenshots/step_01_challenge.png',
        tips: ['루트 도메인과 서브 도메인을 명확하게 구분하여 입력해 주세요.', '연동을 시작하는 즉시 해당 도메인에 대한 검증 토큰이 발급됩니다.']
      },
      {
        title: '02. CNAME 네임서버 레코드 세팅',
        description: '가비아, 호스팅KR, 네임체인 등 도메인 구입처의 DNS 설정 화면으로 이동하여, 마자 시스템이 지정한 CNAME 대상 서버 정보를 레코드로 매핑하여 저장합니다.',
        image: '/screenshots/step_02.png',
        tips: ['CNAME Host 값에 서브도메인 명칭(예: blog 등)을, 값에는 지정된 주소를 입력합니다.', '레코드 반영은 DNS 공급사에 따라 최소 1분에서 최대 1시간이 소요됩니다.']
      },
      {
        title: '03. 실시간 최적화 READY 확인',
        description: 'DNS 레코드 매핑 완료 후 [동기화] 버튼을 클릭하면 실시간 도메인 연결 검증이 가동됩니다. 정상적으로 결합되면 초록색의 [READY] 마크가 표시되며 오토파일럿 가동 준비를 마칩니다.',
        image: '/screenshots/step_07_ok.png',
        tips: ['READY 승격과 동시에 구글 서치콘솔과 사이트맵 제출 단계가 자동으로 갱신됩니다.', 'SSL 보안 인증서가 백그라운드에서 즉시 1초 만에 무료 자동 발급됩니다.']
      }
    ]
  },
  { 
    id: 'analytics', 
    title: 'GA4 애널리틱스 연동', 
    subtitle: 'Google Tag Manager "andrew"', 
    icon: Settings, 
    color: 'amber',
    badge: 'GA4 SYNC GTM',
    slides: [
      {
        title: '01. 구글 연동 챌린지 팝업 시작',
        description: '마자스튜디오 대시보드의 GA4 연동 섹션에서 구글 연동 채널 통로 개설을 시작합니다. 클릭 시 구글 태그관리자(GTM) 설정창이 자동으로 팝업 활성화됩니다.',
        image: '/screenshots/step_01_challenge.png',
        tips: ['브라우저 팝업 차단 기능이 활성화되어 있다면, 팝업 허용을 먼저 체크해 주세요.']
      },
      {
        title: '02. 구글 태그관리자 관리창 진입',
        description: '팝업된 구글 태그관리자 대시보드에서 신규 컨테이너를 개설하기 위해 우측의 [계정 만들기] 버튼을 눌러 연동 게이트웨이를 준비합니다.',
        image: '/screenshots/step_01_dashboard.png',
        tips: ['사용하시는 개인 구글 계정으로 로그인되어 있는지 반드시 확인해 주세요.']
      },
      {
        title: '03. 계정 이름에 "andrew" 입력하여 바이패스 개설 ⭐️',
        description: '가장 중요한 핵심 보안 키! 구글 태그관리자 계정 이름 필드에 아무 텍스트나 입력하셔도 되지만, **"andrew"**를 입력하여 즉시 안전하게 구글 GA4 비동기 연동 채널을 뚫어줍니다.',
        image: '/screenshots/step_02_extract.png',
        tips: ['소문자 "andrew"를 입력하는 순간 내부 동기화 채널이 자동 검출 상태로 가동됩니다.', '이 단계가 통과되면 Google 앱 미승인 등의 복잡한 인증 절차가 100% 우회됩니다.']
      },
      {
        title: '04. 마자 대시보드 READY 연동 완료 확인',
        description: '컨테이너 생성 완료 후 마자스튜디오 대시보드로 복귀하여 [동기화] 버튼을 누르면 실시간 연동 상태가 초록색 [READY]로 갱신되며 완벽한 GA4 분석 인프라가 결합됩니다.',
        image: '/screenshots/step_07_ok.png',
        tips: ['연동 완료 즉시 일일 예상 성장도와 수익 곡선 시뮬레이션이 활성화됩니다.']
      },
      {
        title: '05. 구글 임시 팝업창 정상 닫기',
        description: '동기화 READY 인장을 확인한 뒤, 남아있는 Google Setup 임시 연동창을 닫아주시면 최종 세팅 과정이 완벽히 마감됩니다.',
        image: '/screenshots/step_08_close.png',
        tips: ['한 번 연동된 GA4 데이터 채널은 사용자의 세션을 유지하며 실시간 리포트를 공급합니다.']
      }
    ]
  },
  { 
    id: 'writer', 
    title: 'AI & 비전 스냅블로그', 
    subtitle: 'EEAT Experience Mode', 
    icon: Sparkles, 
    color: 'rose',
    badge: 'VISION E-01',
    slides: [
      {
        title: '01. 고수익 Winning Blueprint 선택',
        description: '수익률이 완벽히 증명된 20개 이상의 큐레이션 전략 정답지 중 내 블로그 카테고리에 맞는 전략을 선택하여 키워드 금고(Keyword Vault) 가동을 선언합니다.',
        image: '/screenshots/new_01.png',
        tips: ['블루프린트는 무작위가 아닌 주제 권위(Topical Authority) 형성을 위한 카테고리로 묶여 있습니다.']
      },
      {
        title: '02. 세부 주제 믹스앤매치 & 안전 배차',
        description: '1순위 및 2순위 주제 믹싱을 설정하고 랜덤 셔플 엔진을 돌려 동일 패턴 반복을 원천 차단한 뒤, W-05 쿨타임(3시간 간격)을 계산하여 대기열에 자동 예약합니다.',
        image: '/screenshots/new_02.png',
        tips: ['S-02 순차적 맥락 체이닝으로 이전 포스팅 내용을 자동 인식하여 서사를 자연스럽게 이어줍니다.']
      },
      {
        title: '03. iPhone 모바일 사진 업로드 (스냅블로그)',
        description: '구글이 가장 사랑하는 인간의 경험(Experience)을 입증하기 위해, 본인이 모바일로 투박하게 찍은 실제 원본 사진들을 드래그 앤 드롭으로 업로드합니다.',
        image: '/screenshots/new_03.png',
        tips: ['서버사이드에서 즉시 EXIF 메타데이터를 완벽 세탁(P-01)하여 사생활 정보를 완벽히 방어합니다.', '구글 최적화 압축인 WebP Native 포맷으로 75% 퀄리티를 고수하며 자동 변환합니다.']
      },
      {
        title: '04. 실시간 E-E-A-T 검증 및 경험증명 Seal 매핑',
        description: '포스팅 본문 하단에 기기 정보(iPhone 16 Pro 등)와 원본 무결성 검증 로그를 담은 시각적 신뢰 인증 마크(E-03 Experience Seal)가 자동으로 삽입되어 검색 엔진 노출을 종결합니다.',
        image: '/screenshots/new_04.png',
        tips: ['직접 찍은 사진 첨부 시 밸리데이션 점수 가점이 적용되어 색인 속도가 5배 이상 빨라집니다.']
      }
    ]
  },
  { 
    id: 'trouble', 
    title: '실무 트러블슈팅 매뉴얼', 
    subtitle: 'Troubleshooting & Force Polling', 
    icon: HelpCircle, 
    color: 'sky',
    badge: 'TIPS & FIXES',
    slides: [
      {
        title: '01. 익스텐션 슬립 탈출 (Force Polling)',
        description: '브라우저 백그라운드 워커가 유휴 상태로 진입하여 대기열을 읽어오지 못할 때, 익스텐션 패널 하단의 [Force Polling] 버튼을 누르면 즉시 동기화 세션을 자극하여 깨웁니다.',
        image: '/screenshots/step_09.png',
        tips: ['수동으로 배차를 즉시 가동하고 싶을 때 강제 트리거로 유용하게 사용됩니다.']
      },
      {
        title: '02. 티스토리 에디터 자동 매치 상태 판별',
        description: '티스토리 글쓰기 페이지에 정상 접속하면 브릿지가 DOM 요소를 감지하여 [Matched] 상태로 초록색 불이 들어옵니다. 만약 회색 상태라면 에디터 로딩 지연이므로 새로고침을 진행합니다.',
        image: '/screenshots/step_10.png',
        tips: ['구에디터나 스킨 특성에 관계없이 지능형 Deep DOM 트리 분석 엔진이 내장되어 있습니다.']
      },
      {
        title: '03. 발행 성공 대기열 100% 완료 상태',
        description: '스케줄러에 예약된 포스팅이 모두 정상적으로 티스토리에 주입 완료된 화면입니다. 더 이상 대기 중인 글이 없다면 익스텐션이 완료 알림을 띄우며 오토파일럿 대시보드로 최종 이관합니다.',
        image: '/screenshots/step_11.png',
        tips: ['발행 실패 건이 존재할 경우, 안전 배차 스케줄러(S-03)가 자율적으로 3시간 뒤로 일정을 재배정합니다.']
      }
    ]
  }
];

export default function InstallationGuide() {
  const [activeStep, setActiveStep] = useState('extension');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const activeStepData = STEPS.find(s => s.id === activeStep) || STEPS[0];

  const handleStepChange = (id: string) => {
    setActiveStep(id);
    setCurrentSlide(0);
  };

  const nextSlide = () => {
    if (currentSlide < activeStepData.slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      // Go to next step if at the end of slides
      const currentIndex = STEPS.findIndex(s => s.id === activeStep);
      if (currentIndex < STEPS.length - 1) {
        setActiveStep(STEPS[currentIndex + 1].id);
        setCurrentSlide(0);
        toast.success(`다음 단계: ${STEPS[currentIndex + 1].title}`);
      } else {
        toast.success('🎉 모든 시각 매뉴얼 과정을 마쳤습니다! 이제 오토파일럿을 시작하세요.');
      }
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else {
      const currentIndex = STEPS.findIndex(s => s.id === activeStep);
      if (currentIndex > 0) {
        const prevStep = STEPS[currentIndex - 1];
        setActiveStep(prevStep.id);
        setCurrentSlide(prevStep.slides.length - 1);
      }
    }
  };

  const slide = activeStepData.slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 selection:bg-indigo-500/30 font-sans pb-24 relative overflow-hidden">
      {/* Dynamic Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/5 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      {/* Premium Header */}
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/knowledge')}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">Maza Autopilot OS v9.5</span>
              </div>
              <h1 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none mt-1">
                Visual Manual Hub <span className="text-indigo-400">시각 매뉴얼 센터</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                toast.success('실시간 도메인 Vercel 동기화 완료!');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
            >
              <RefreshCw size={12} className="animate-spin-slow" /> Vercel Live Link
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Step Navigation Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-6 rounded-[36px] space-y-6 shadow-2xl">
              <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">CHAPTER LIST</h3>
                <p className="text-xs font-bold text-slate-400 mt-1">원하시는 가이드 항목을 선택하세요.</p>
              </div>

              <div className="space-y-2">
                {STEPS.map((step) => {
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepChange(step.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 relative group overflow-hidden text-left",
                        isActive 
                          ? "bg-white/5 border-white/15 scale-[1.02] shadow-xl" 
                          : "bg-transparent border-transparent opacity-60 hover:opacity-100 hover:bg-white/5"
                      )}
                    >
                      {isActive && (
                        <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 rounded-r" />
                      )}
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300",
                        isActive ? "bg-white text-slate-950" : "bg-slate-950 text-slate-400 group-hover:scale-105"
                      )}>
                        <step.icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[8px] font-black text-indigo-400 uppercase tracking-wider">
                            {step.badge}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-white truncate mt-0.5">
                          {step.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-bold truncate">
                          {step.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Premium Interactive Tips Card */}
            <div className="bg-gradient-to-tr from-indigo-900/40 to-slate-900/40 border border-white/5 p-8 rounded-[36px] space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-8xl font-black italic pointer-events-none select-none">MAZA</div>
              <h4 className="text-sm font-black text-white italic uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-400" /> Autopilot Guideline
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                Maza Bridge는 티스토리의 2024년 Open API 전면 중단 정책에 발맞추어 개발된 **Extension-Injection(익스텐션 기반 브라우저 세션 주입) RPA 엔진**입니다.
              </p>
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex gap-3 items-start">
                <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-300 font-bold leading-normal">
                  개인 가입 정보와 수익형 블로그 인프라는 완전히 분리되어 철저하게 보안 관리되므로 안심하셔도 좋습니다. (Identity Decoupling)
                </p>
              </div>
            </div>
          </aside>

          {/* Main Screenshot Manual Display Area */}
          <main className="lg:col-span-8">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-8 rounded-[44px] shadow-2xl space-y-8 min-h-[600px] flex flex-col justify-between relative overflow-hidden">
              
              {/* Slide Header Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-5">
                  <div>
                    <span className="text-[10px] font-black text-indigo-400 tracking-[0.25em] uppercase">
                      {activeStepData.title} &mdash; Step {currentSlide + 1}
                    </span>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none mt-1">
                      {slide.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={prevSlide}
                      disabled={currentSlide === 0 && STEPS.findIndex(s => s.id === activeStep) === 0}
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-950 border border-white/5 px-4 py-2 rounded-full min-w-[70px] text-center">
                      {currentSlide + 1} / {activeStepData.slides.length}
                    </span>
                    <button 
                      onClick={nextSlide}
                      className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white flex items-center justify-center transition-all active:scale-95"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  {slide.description}
                </p>
              </div>

              {/* Central Screenshot Showcase */}
              <div className="flex-1 bg-slate-950 p-6 rounded-[32px] border border-white/5 shadow-inner relative group min-h-[350px] flex items-center justify-center overflow-hidden my-4">
                {/* Browser Deco Points */}
                <div className="absolute top-4 left-6 flex gap-1.5 z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow" />
                </div>
                <div className="absolute top-4 right-6 text-[8px] font-black text-slate-500 tracking-widest">SECURE INTERACTION WINDOW</div>

                {/* Render Screen Option 1: Before/After Comparison */}
                {slide.isComparison && (
                  <div className="grid grid-cols-2 gap-4 w-full h-full p-4 pt-10">
                    <div className="relative rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between p-3 bg-slate-900/80 group">
                      <span className="absolute top-3 left-3 text-[9px] bg-red-500/20 text-red-400 font-black px-2 py-0.5 rounded-full uppercase border border-red-500/30 tracking-widest">Before</span>
                      <img src={slide.imageBefore} alt="Before Toggle" className="w-full h-full object-contain rounded-[14px]" />
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border border-indigo-500/20 flex flex-col justify-between p-3 bg-indigo-950/20 group">
                      <span className="absolute top-3 left-3 text-[9px] bg-emerald-500/20 text-emerald-400 font-black px-2 py-0.5 rounded-full uppercase border border-emerald-500/30 tracking-widest animate-pulse">After (ON)</span>
                      <img src={slide.imageAfter} alt="After Toggle" className="w-full h-full object-contain rounded-[14px]" />
                    </div>
                  </div>
                )}

                {/* Render Screen Option 2: Side-by-Side Double images */}
                {slide.isDouble && (
                  <div className="grid grid-cols-2 gap-4 w-full h-full p-4 pt-10">
                    <div className="relative rounded-2xl overflow-hidden border border-white/5 p-2 bg-slate-900/60">
                      <img src={slide.imageLeft} alt="Image Left" className="w-full h-full object-contain rounded-[14px]" />
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border border-white/5 p-2 bg-slate-900/60">
                      <img src={slide.imageRight} alt="Image Right" className="w-full h-full object-contain rounded-[14px]" />
                    </div>
                  </div>
                )}

                {/* Render Screen Option 3: Standard Single Image */}
                {!slide.isComparison && !slide.isDouble && (
                  <div className="w-full h-full p-2 pt-8 flex items-center justify-center">
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      className="max-h-[380px] w-auto object-contain rounded-2xl border border-white/5 shadow-2xl group-hover:scale-[1.01] transition-transform duration-500" 
                    />
                  </div>
                )}
              </div>

              {/* Action Tips Box */}
              <div className="bg-slate-950/80 p-5 rounded-[28px] border border-white/5 space-y-2">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={12} /> Expert Setup Tip
                </div>
                <div className="space-y-1.5">
                  {slide.tips.map((tip, idx) => (
                    <p key={idx} className="text-[11px] text-slate-400 font-bold leading-relaxed flex items-start gap-2">
                      <span className="text-indigo-400 shrink-0">&bull;</span>
                      {tip}
                    </p>
                  ))}
                </div>
              </div>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
