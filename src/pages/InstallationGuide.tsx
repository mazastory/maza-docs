import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Download, Globe, ShieldCheck, Zap, 
  ArrowRight, ArrowUp, CheckCircle2, Monitor, 
  Puzzle, ExternalLink, HelpCircle, Sparkles, Trophy,
  ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Copy,
  LayoutTemplate, Server, Box, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type GuideCategory = 'extension' | 'tistory' | 'wordpress' | 'blogspot' | 'subdomain' | 'adsense_challenge' | 'maza_bridge';

interface Step {
  title: string;
  desc: string;
  badge: string;
  image: string;
  tip?: string;
}

interface GuideData {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  steps: Step[];
}

const GUIDE_DATA: Record<GuideCategory, GuideData> = {
  extension: {
    title: "익스텐션 연동",
    subtitle: "Maza Bridge 설치 가이드",
    icon: Puzzle,
    color: "indigo",
    steps: [
      {
        title: "1. 익스텐션 압축 파일 다운로드 📥",
        desc: "마자스튜디오 대시보드(또는 아래 다운로드 버튼)에서 `maza-extension.zip` 파일을 다운로드한 뒤, 찾기 쉬운 위치(예: 다운로드 폴더 또는 바탕화면)에 저장해 줍니다.",
        badge: "DOWNLOAD ZIP",
        image: "/screenshots/step_01_dashboard.webp",
        tip: "압축 파일 내에 Tistory 연동 및 RPA 자동 발행에 필요한 핵심 백그라운드 엔진이 내장되어 있습니다."
      },
      {
        title: "2. 압축 해제 📂",
        desc: "다운로드한 `maza-extension.zip` 파일의 압축을 해제합니다. 폴더 내에 `manifest.json` 파일이 있는 위치가 경로가 됩니다.",
        badge: "EXTRACT ZIP",
        image: "/screenshots/step_02_extract.webp",
        tip: "압축을 해제한 폴더의 이름이나 위치를 변경하지 마세요. 크롬 로드 후 경로가 바뀌면 다시 로드해야 합니다."
      },
      {
        title: "3. 크롬 확장 프로그램 관리자 열기 🌐",
        desc: "크롬 브라우저 주소창에 `chrome://extensions`를 입력해 이동하거나, 크롬 우측 상단의 [퍼즐 아이콘] -> [확장 프로그램 관리]를 클릭합니다.",
        badge: "CHROME EXTENSIONS",
        image: "/screenshots/step_03.webp",
        tip: "다른 브라우저(웨일, 엣지 등)를 사용 중이시라면 크롬 브라우저에서 진행하시는 것을 권장합니다."
      },
      {
        title: "4. 개발자 모드(Developer Mode) ON ⚙️",
        desc: "확장 프로그램 관리 페이지 우측 상단에 위치한 '개발자 모드' 스위치를 켜서 활성화합니다.",
        badge: "DEVELOPER MODE",
        image: "/screenshots/step_04.webp",
        tip: "개발자 모드가 켜져야 스토어 외부의 압축 해제된 확장 프로그램을 수동으로 등록할 수 있습니다."
      },
      {
        title: "5. 압축 해제된 확장 프로그램 로드 클릭 🚀",
        desc: "개발자 모드가 켜지면 좌측 상단에 나타나는 '압축해제된 확장 프로그램을 로드합니다' 버튼을 클릭합니다.",
        badge: "LOAD UNPACKED",
        image: "/screenshots/step_05.webp",
        tip: "가장 첫 번째 버튼입니다. 클릭 시 파일 선택(폴더 선택) 창이 열립니다."
      },
      {
        title: "6. 익스텐션 선택과 핀고정 📌",
        desc: "탐색기 창에서 `maza-extension` 폴더를 선택해 로드한 뒤, 주소창 우측 퍼즐 아이콘을 눌러 'Maza Bridge'를 상단 바에 고정(Pin)합니다.",
        badge: "LOAD & PIN",
        image: "/screenshots/step_06.webp",
        tip: "핀으로 고정해 두시면 익스텐션의 연동 상태(녹색 연결 불빛)를 실시간으로 빠르게 모니터링할 수 있습니다."
      },
      {
        title: "7. 익스텐션 로드 및 활성화 확인 ✅",
        desc: "확장 프로그램 목록에 'Maza Bridge' 카드가 생성되고, 우측 하단 스위치가 파란색으로 '켜짐(ON)' 상태인지 확인합니다.",
        badge: "CHECK STATUS",
        image: "/screenshots/step_07_ok.webp",
        tip: "정상적으로 등록되었다면 우측 하단 스위치가 켜져 있어야 백그라운드 엔진이 동작합니다."
      },
      {
        title: "8. 관리자 창 닫기 및 자동화 준비 끝! 🚀",
        desc: "수고하셨습니다! 이제 설정이 모두 끝났으므로 크롬 확장 프로그램 관리자 창은 완전히 닫고 사용하셔도 됩니다.",
        badge: "READY TO AUTOPILOT",
        image: "/screenshots/step_08_close.webp",
        tip: "마자스튜디오 익스텐션은 별도로 창을 띄우지 않아도 백그라운드에서 유저를 대신해 완벽하게 자동 발행을 수행합니다."
      }
    ]
  },
  tistory: {
    title: "티스토리 세팅",
    subtitle: "RPA 자동 발행 설정",
    icon: LayoutTemplate,
    color: "orange",
    steps: [
      {
      title:"1. 회원가입",
      badge:"SIGN UP",
      image:"/screenshots/tistory/01_signup.webp",
      desc:"티스토리 계정 생성"
      },

      {
      title:"2. 블로그명 · 사이트주소 설정",
      badge:"BLOG INFO",
      image:"/screenshots/tistory/02_blog_basic.webp",
      desc:"블로그명 설정"
      },

      {
      title:"3. 카테고리 관리",
      badge:"CATEGORY",
      image:"/screenshots/tistory/03_category.webp",
      desc:"카테고리 생성"
      },

      {
      title:"4. 스킨 변경",
      badge:"SKIN",
      image:"/screenshots/tistory/04_skin.webp",
      desc:"스킨 템플릿을 변경하여 블로그 디자인을 맞춤 설정합니다."
      },

      {
      title:"5. HTML 편집",
      badge:"HTML",
      image:"/screenshots/tistory/05_html.webp",
      desc:"HTML 편집 모드에서 블로그 콘텐츠 구조를 직접 수정합니다."
      },

      {
      title:"6. 모바일웹 설정",
      badge:"MOBILE",
      image:"/screenshots/tistory/06_mobile.webp",
      desc:"모바일 웹뷰 설정을 통해 모바일 방문자 경험을 최적화합니다."
      },

      {
      title:"7. 블로그 설정",
      badge:"BLOG SETTING",
      image:"/screenshots/tistory/07_setting.webp",
      desc:"블로그 기본 설정을 확인하고 공개 범위, 검색 노출 옵션을 조정합니다."
      },

      {
      title:"8. 주소 설정",
      badge:"URL",
      image:"/screenshots/tistory/08_url.webp",
      desc:"블로그 주소 및 카테고리 URL 구조를 원하는 형태로 설정합니다."
      },

      {
      title:"9. 도메인 연결",
      badge:"DOMAIN",
      image:"/screenshots/tistory/10_domain.webp",
      desc:"연결하려는 도메인을 입력하고 Tistory 블로그와 매핑합니다."
      },

      {
      title:"10. RSS 설정",
      badge:"RSS",
      image:"/screenshots/tistory/11_rss.webp",
      desc:"RSS 피드를 활성화하여 외부 서비스에 블로그 내용을 제공할 수 있게 합니다."
      },
    ]
  },
  adsense_challenge: {
    title: "AdSense 챌린지",
    subtitle: "승인 준비 및 색인 요청 가이드",
    icon: Trophy,
    color: "sky",
    steps: [
      {
        title: "1. 챌린지 시작하기",
        badge: "START",
        image: "/screenshots/ad/ad_01.webp",
        desc: "마자스튜디오 챌린지 탭에서 AdSense 챌린지를 시작합니다."
      },
      {
        title: "2. 플랫폼 정보 등록",
        badge: "CONNECT",
        image: "/screenshots/ad/ad_02.webp",
        desc: "티스토리/워드프레스/블로그스팟 중 운영 중인 플랫폼을 선택하고 블로그 정보를 정확히 입력합니다."
      },
      {
        title: "3. 구글 인프라 연결",
        badge: "GOOGLE",
        image: "/screenshots/ad/ad_03.webp",
        desc: "AdSense, GA4, Search Console을 차례대로 연결하여 수익화 인프라를 구성합니다."
      },
      {
        title: "4. 애널리틱스 1회연결",
        badge: "GOOGLE",
        image: "/screenshots/ad/ad_04.webp",
        desc: "AdSense, GA4, Search Console을 차례대로 연결하여 수익화 인프라를 구성합니다."
      },
       {
        title: "5. 애널리틱스 두개의 동의 클릭",
        badge: "GOOGLE",
        image: "/screenshots/ad/ad_05.webp",
        desc: "AdSense, GA4, Search Console을 차례대로 연결하여 수익화 인프라를 구성합니다."
      },
      {
        title: "6. 정책 페이지 연결",
        badge: "POLICY",
        image: "/screenshots/ad/ad_06.webp",
        desc: "개인정보처리방침, 이용약관, 광고정책 페이지를 생성하고 챌린지 세팅에 연결합니다."
      },
       {
        title: "7. 수익화 블로그 캐릭터 고르기",
        badge: "POLICY",
        image: "/screenshots/ad/ad_07.webp",
        desc: "나만의 수익화 블로그 캐릭터 고르기 블로그의 메인 방향성을 재미있고 든든한 정답 패키지 캐릭터로 고르세요."
      },
      {
        title: "8. 콘텐츠 발행 준비",
        badge: "CONTENT",
        image: "/screenshots/ad/ad_08.webp",
        desc: "니치 글 5개와 경험 글 5개를 작성하고 발행 전 자동 검수를 통과합니다."
      },
      {
        title: "9. 색인 요청",
        badge: "INDEX",
        image: "/screenshots/ad/ad_09.webp",
        desc: "Search Console에 sitemap/RSS를 제출하고 즉시 색인 요청을 보냅니다."
      },
      {
        title: "9-1. 서치콘솔 속성 추가",
        badge: "SEARCH CONSOLE",
        image: "/screenshots/ad/ad_09_1.webp",
        desc: "구글 서치콘솔 첫 화면이 뜨면 'URL 접두어' 영역에 내 블로그 주소를 입력하고 계속을 눌러 소유권을 확인합니다."
      },
      {
        title: "10. 승인 신청",
        badge: "APPLY",
        image: "/screenshots/ad/ad_10.webp",
        desc: "AdSense 신청 사이트에서 내 블로그를 등록하고 신청을 완료합니다."
      },
      {
        title: "11. 상태 확인",
        badge: "MONITOR",
        image: "/screenshots/ad/ad_11.webp",
        desc: "승인 대기 상태를 확인하고, 이중 확인이 필요한 항목을 다시 점검합니다."
      },
      {
        title: "12. 추가 글쓰기 (오토파일럿)",
        badge: "AUTOPILOT",
        image: "/screenshots/ad/ad_12.webp",
        desc: "챌린지 완료 후 두 번째부터는 '니치 포스팅 (오토파일럿)' 메뉴에서 무제한으로 수익성 글쓰기를 이어나가세요."
      }
    ]
  },
  wordpress: {
    title: "워드프레스 세팅",
    subtitle: "REST API 연동",
    icon: Globe,
    color: "sky",
    steps: [
      {
        title: "1. 워드프레스 관리자 프로필 진입 👤",
        desc: "워드프레스 관리자(WP-Admin) 대시보드에서 우측 상단 프로필 이미지를 클릭한 뒤 '프로필 편집'으로 이동합니다.",
        badge: "USER PROFILE",
        image: "/screenshots/wp_step_01.webp",
        tip: "관리자 권한이 있는 계정으로 로그인해야 합니다. self-hosted와 wordpress.com 모두 동일한 방식으로 설정할 수 있습니다."
      },
      {
        title: "2. 어플리케이션 비밀번호 생성 🔑",
        desc: "프로필 편집 페이지 하단에서 '새로운 어플리케이션 비밀번호 이름'에 MazaStudio 등 식별 가능한 이름을 입력하고 생성 버튼을 누릅니다.",
        badge: "GENERATE API KEY",
        image: "/screenshots/wp_step_02.webp",
        tip: "워드프레스 로그인 비밀번호는 절대 입력하지 마세요. 전용 앱 비밀번호만 마자스튜디오에 연결하면 됩니다."
      },
      {
        title: "3. 비밀번호 복사 및 연동 완료 📋",
        desc: "화면에 표시된 24자리 앱 비밀번호를 복사하여 마자스튜디오 'My Site'의 워드프레스 설정 창에 붙여넣고 저장합니다.",
        badge: "CONNECT WP",
        image: "/screenshots/wp_step_03.webp",
        tip: "비밀번호는 새로 발급한 뒤 바로 복사해야 합니다. 창을 닫으면 다시 확인할 수 없으니 즉시 저장하세요."
      }
    ]
  },
  blogspot: {
    title: "블로그스팟 세팅",
    subtitle: "Google OAuth 간편 연동",
    icon: Server,
    color: "amber",
    steps: [
      {
        title: "1. 마자스튜디오 My Site 메뉴 접속 🌐",
        desc: "마자스튜디오 좌측 사이드바에서 'My Site(사이트 관리)'로 이동한 뒤, 상단의 '블로그스팟(Blogger) 연동' 버튼을 클릭합니다.",
        badge: "CONNECT BLOGSPOT",
        image: "/screenshots/blog_step_01.webp",
        tip: "블로그스팟은 크롬 익스텐션 설치가 필요 없는 100% 서버 기반 API 자동화 플랫폼입니다."
      },
      {
        title: "2. 구글 계정으로 안전하게 로그인 🛡️",
        desc: "블로그스팟을 운영 중인 구글 계정을 선택하고, Blogger API 접근 및 글쓰기 권한을 허용합니다. 로그인한 계정에 자동화할 블로그가 포함되어 있는지 꼭 확인하세요.",
        badge: "GOOGLE OAUTH",
        image: "/screenshots/blog_step_02.webp",
        tip: "OAuth 로그인 과정에서 권한 요청 창이 뜨면 '허용'을 클릭합니다. 계정이 다르면 연동 대상 블로그 목록이 나타나지 않습니다."
      },
      {
        title: "3. 발행 타겟 블로그 선택 및 완료 🎯",
        desc: "해당 구글 계정에 연결된 블로그스팟 목록에서 자동화할 블로그를 정확히 선택하고 저장하면 세팅이 완료됩니다.",
        badge: "SELECT TARGET",
        image: "/screenshots/blog_step_03.webp",
        tip: "선택한 블로그가 올바른 도메인인지 다시 한 번 확인하세요. 블로그 ID가 저장되어야 자동 발행이 정상 동작합니다."
      }
    ]
  },
  subdomain: {
    title: "서브도메인 개설",
    subtitle: "Maza 원클릭 블로그",
    icon: Box,
    color: "emerald",
    steps: [
      {
        title: "1. 마자 블로그 개인 사이트 세팅 🎯",
        desc: "마자스튜디오는 승인된 루트 도메인 아래에 서브도메인 블로그를 원클릭으로 생성하는 서비스를 준비 중입니다. 도메인, 호스팅, SSL, SEO, 법적 문서까지 마자가 한 번에 설정해 드립니다.",
        badge: "COMING SOON",
        image: "/screenshots/coming_soon.webp",
        tip: "정식 공개 시에는 별도 티스토리/워드프레스/블로그스팟 설정 없이, 마자 블로그만으로 개인 사이트를 바로 운영할 수 있습니다."
      }
    ]
  },
  maza_bridge: {
    title: "Maza Bridge 활용",
    subtitle: "스마트 컨텍스트 패널",
    icon: Sparkles,
    color: "indigo",
    steps: [
      {
        title: "1. MAZA Bridge 스마트 컨텍스트 🎯",
        desc: "유튜브, 뉴스 등 다른 웹사이트를 보다가 MAZA Studio 탭으로 돌아오면, 방금 전까지 보고 있던 화면을 분석하여 우측에 맞춤형 액션 패널을 띄워줍니다.",
        badge: "INTRO",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
        tip: "클릭 한 번만으로 보고 있던 콘텐츠를 내 블로그의 새로운 포스팅으로 재창조할 수 있습니다."
      },
      {
        title: "2. 유튜브 영상 맞춤 액션 📺",
        desc: "유튜브에서 정보성 영상을 발견했다면 탭을 전환해 보세요. 영상 요약, 스크립트 기반 글쓰기, 주제 기반 니치 글쓰기 버튼이 제공됩니다.",
        badge: "YOUTUBE",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop",
        tip: "특히 '스크립트 추출 후 글쓰기(PRO)'는 정보성 블로그 작성 시 가장 강력한 기능입니다."
      },
      {
        title: "3. 블로그 및 뉴스 기사 액션 📝",
        desc: "텍스트 기반 페이지를 보고 오셨다면 핵심 내용 요약, 아이디어 금고 저장, AI 리라이팅 기능을 활용할 수 있습니다.",
        badge: "ARTICLE",
        image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop",
        tip: "AI 리라이팅 기능으로 원본 글을 유사 문서에 걸리지 않는 완전히 새로운 포스팅으로 재작성할 수 있습니다."
      },
      {
        title: "4. 이미지 & 키워드 맞춤 액션 🖼️🔍",
        desc: "멋진 이미지를 섬네일로 지정하거나, 구글/네이버 검색창 키워드를 즉시 가져와 돈이 되는 니치 글로 만들 수 있습니다.",
        badge: "IMAGE & KEYWORD",
        image: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1200&auto=format&fit=crop",
        tip: "복사 + 붙여넣기의 늪에서 벗어나 눈으로 보고 클릭 한 번으로 나만의 콘텐츠를 생산해 보세요!"
      }
    ]
  }
};

const GUIDE_CATEGORIES: { id: GuideCategory; label: string; icon: React.ElementType }[] = [
  { id: 'extension', label: '익스텐션 설치', icon: Puzzle },
  { id: 'tistory', label: '티스토리 세팅', icon: LayoutTemplate },
  { id: 'wordpress', label: '워드프레스 세팅', icon: Globe },
  { id: 'blogspot', label: '블로그스팟 세팅', icon: Server },
  { id: 'subdomain', label: '서브도메인 개설', icon: Box },
  { id: 'adsense_challenge', label: 'AdSense 챌린지', icon: Trophy },
  { id: 'maza_bridge', label: 'Bridge 활용', icon: Sparkles }
];

interface InstallationGuideProps {
  initialCategory?: GuideCategory;
}

export default function InstallationGuide({ initialCategory }: InstallationGuideProps) {
  const location = useLocation();
  const getCategoryFromSearch = (): GuideCategory | null => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category') as GuideCategory | null;
    return category && GUIDE_DATA[category] ? category : null;
  };

  const [activeCategory, setActiveCategory] = useState<GuideCategory>(() => {
    return getCategoryFromSearch() ?? initialCategory ?? 'extension';
  });
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDevModeOn, setIsDevModeOn] = useState<boolean>(false);
  const [downloadSource, setDownloadSource] = useState<'dashboard' | 'challenge'>('dashboard');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const activeData = GUIDE_DATA[activeCategory];
  const steps = activeData.steps;

  // Reset steps and error state when category changes
  useEffect(() => {
    setActiveStep(0);
    setIsPlaying(false);
    setImageError(false);
    setDownloadSource('dashboard');
  }, [activeCategory]);

  useEffect(() => {
    const categoryFromSearch = getCategoryFromSearch();
    if (categoryFromSearch) {
      setActiveCategory(categoryFromSearch);
    }
  }, [location.search]);

  // Handle image load error to show generic fallback
  const handleImageError = () => {
    setImageError(true);
  };

  // Reset image error when step changes
  useEffect(() => {
    setImageError(false);
  }, [activeStep]);

  // Auto-play timer (with special handling for extension download sub-views)
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        // If we're in the extension guide and on step 0 (download screen),
        // show both `dashboard` and `challenge` views sequentially before
        // moving to the next step.
        if (activeCategory === 'extension' && activeStep === 0) {
          if (downloadSource === 'dashboard') {
            setDownloadSource('challenge');
            return; // hold on this step until next tick
          }

          if (downloadSource === 'challenge') {
            setDownloadSource('dashboard');
            setActiveStep(1);
            return;
          }
        }

        // If we're in the extension guide and on step 3 (developer mode),
        // show both `off` and `on` views sequentially before moving on.
        if (activeCategory === 'extension' && activeStep === 3) {
          if (!isDevModeOn) {
            setIsDevModeOn(true);
            return; // hold on this step until next tick
          }

          setActiveStep(4);
          return;
        }

        // Default behaviour: advance to next step
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 5000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isPlaying, steps.length, activeCategory, activeStep, downloadSource, isDevModeOn]);

  const handleNext = () => setActiveStep((prev) => (prev + 1) % steps.length);
  const handlePrev = () => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);

  // Generate image source logic
  const getCurrentImageSrc = () => {
    if (imageError) return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"; // beautiful generic fallback
    if (activeCategory === 'extension') {
      if (activeStep === 0) return downloadSource === 'dashboard' ? "/screenshots/step_01_dashboard.webp" : "/screenshots/step_01_challenge.webp";
      if (activeStep === 3) return isDevModeOn ? "/screenshots/step_developer_on.webp" : "/screenshots/step_developer_off.webp";
    }
    return steps[activeStep].image;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 font-sans pb-24 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-${activeData.color}-600/10 rounded-full blur-[150px] animate-pulse transition-colors duration-1000`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-${activeData.color}-400/10 rounded-full blur-[150px] animate-pulse transition-colors duration-1000`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-overlay" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 lg:py-20 relative z-10 space-y-12">
        
        {/* Header & Platform Selector */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="space-y-4 pt-4">
            <h1 className="text-4xl lg:text-5xl font-black italic tracking-tighter text-white leading-tight uppercase">
              {activeData.title} <span className={`text-${activeData.color}-400 italic`}>가이드</span>
            </h1>
            <p className="text-sm font-bold text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {activeData.subtitle}를 완벽하게 세팅하는 과정입니다. <br />
              아래 탭에서 필요한 항목을 바로 선택하세요.
            </p>
          </div>

        </div>

        {/* Dynamic Presentation Hub */}
        <div className="grid lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
          
          {/* Left Panel: Step Selector (Sidebar) */}
          <div className="lg:col-span-4 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 p-6 space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className={`text-xs font-black text-${activeData.color}-400 tracking-wider uppercase`}>세팅 프로세스 ({steps.length}단계)</h3>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  isPlaying ? `bg-${activeData.color}-500 text-white` : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                <span>{isPlaying ? '자동 재생 중' : '자동 재생'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {steps.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <motion.button
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      key={`${activeCategory}-${idx}`}
                      onClick={() => {
                        setActiveStep(idx);
                        setIsPlaying(false);
                      }}
                      className={`w-full text-left p-4 rounded-2xl flex items-start gap-4 transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-r from-${activeData.color}-500/20 to-${activeData.color}-500/5 border border-${activeData.color}-500/30` 
                          : 'border border-transparent hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-black text-xs border ${
                        isActive 
                          ? `bg-${activeData.color}-500 text-white border-${activeData.color}-400 shadow-md shadow-${activeData.color}-500/20` 
                          : 'bg-slate-900/60 text-slate-400 border-white/10'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className={`text-[11px] font-black tracking-tight truncate uppercase ${isActive ? `text-${activeData.color}-300` : 'text-slate-300'}`}>
                          {step.title.includes('.') ? step.title.split('. ')[1] : step.title}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-500 truncate">{step.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel: Active Step Carousel Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step Summary Box */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-950/80 rounded-[32px] border border-white/10 p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`px-3 py-1 bg-${activeData.color}-500/10 border border-${activeData.color}-500/20 rounded-full text-[9px] font-black text-${activeData.color}-400 uppercase tracking-widest`}>
                  {steps[activeStep].badge}
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Step {activeStep + 1} / {steps.length}
                </span>
              </div>
              <h2 className="text-xl lg:text-2xl font-black text-white italic tracking-tight uppercase leading-snug">
                {steps[activeStep].title}
              </h2>
              <p className="text-xs font-bold text-slate-400 leading-relaxed">
                {steps[activeStep].desc}
              </p>

              {/* Special Copy Block for Extension Step 3 */}
              {activeCategory === 'extension' && activeStep === 2 && (
                <div 
                  onClick={() => {
                    navigator.clipboard.writeText("chrome://extensions");
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="mt-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 lg:p-6 cursor-pointer hover:bg-rose-500/20 hover:border-rose-500/50 transition-all group active:scale-[0.98]"
                >
                  <span className="text-xl lg:text-[28px] font-black text-rose-500 tracking-wider font-mono">
                    chrome://extensions
                  </span>
                  <div className={`shrink-0 px-4 py-2 lg:px-6 lg:py-3 rounded-xl text-xs lg:text-sm font-black flex items-center gap-2 transition-all shadow-lg ${isCopied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20 group-hover:scale-105'}`}>
                    {isCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    <span>{isCopied ? '복사 완료!' : '복사하기'}</span>
                  </div>
                </div>
              )}
              
              {steps[activeStep].tip && (
                <div className={`p-4 bg-${activeData.color}-500/5 border border-${activeData.color}-500/10 rounded-2xl flex items-start gap-2.5`}>
                  <span className="text-xs">💡</span>
                  <p className={`text-[10px] font-bold text-${activeData.color}-300/80 leading-relaxed`}>
                    {steps[activeStep].tip}
                  </p>
                </div>
              )}
            </div>

            {/* Interactive Image Frame */}
            <div className={`p-2 bg-gradient-to-b from-${activeData.color}-500/20 to-transparent rounded-[36px] border border-${activeData.color}-500/30 shadow-3xl overflow-hidden relative group`}>
              <div className="bg-[#08090b] rounded-[34px] p-3 aspect-video relative flex items-center justify-center overflow-hidden">
                
                {/* Dynamic Location Radar Marker (CSS Overlay) - Only for Extension currently */}
                <AnimatePresence mode="wait">
                  {activeCategory === 'extension' && activeStep === 0 && downloadSource === 'dashboard' && (
                    <motion.div
                      key="marker-dashboard"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute z-40 flex flex-col items-center pointer-events-none"
                      style={{ top: '15%', left: '62.5%', transform: 'translate(-50%, -50%)' }}
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-12 h-12 bg-rose-500/40 rounded-full animate-ping" />
                        <div className="w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
                      </div>
                      <div className="mt-3 bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
                        <ArrowUp size={12} /> 다운로드 버튼 위치
                      </div>
                    </motion.div>
                  )}
                  {activeCategory === 'extension' && activeStep === 0 && downloadSource === 'challenge' && (
                    <motion.div
                      key="marker-challenge"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute z-40 flex flex-col items-center pointer-events-none"
                      style={{ top: '55%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-12 h-12 bg-rose-500/40 rounded-full animate-ping" />
                        <div className="w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
                      </div>
                      <div className="mt-3 bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
                        <ArrowUp size={12} /> 다운로드 클릭!
                      </div>
                    </motion.div>
                  )}
                  {activeCategory === 'extension' && activeStep === 1 && (
                    <motion.div
                      key="marker-extract"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute z-40 flex flex-col items-center pointer-events-none"
                      style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-16 h-16 border-4 border-indigo-500/60 rounded-xl animate-pulse" />
                      </div>
                      <div className="mt-4 bg-indigo-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
                        압축 풀기 완료 폴더
                      </div>
                    </motion.div>
                  )}
                  {activeCategory === 'extension' && activeStep === 3 && (
                    <motion.div
                      key={`marker-dev-${isDevModeOn}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute z-40 flex flex-col items-center pointer-events-none"
                      style={isDevModeOn ? { top: '15%', left: '15%' } : { top: '12%', right: '5%' }}
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-10 h-10 bg-emerald-500/40 rounded-full animate-ping" />
                        <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
                      </div>
                      <div className="mt-2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
                        {isDevModeOn ? '버튼 생성 확인!' : '스위치 켜기'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Extension Only Toggle UIs */}
                {activeCategory === 'extension' && activeStep === 0 && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-1.5 rounded-full flex gap-1 border border-white/10 z-30 shadow-2xl">
                    <button 
                      onClick={() => setDownloadSource('dashboard')}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${downloadSource === 'dashboard' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      🗺️ 대시보드 우측
                    </button>
                    <button 
                      onClick={() => setDownloadSource('challenge')}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${downloadSource === 'challenge' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      🏆 챌린지 탭
                    </button>
                  </div>
                )}

                {activeCategory === 'extension' && activeStep === 3 && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-1.5 rounded-full flex gap-1 border border-white/10 z-30 shadow-2xl">
                    <button 
                      onClick={() => setIsDevModeOn(false)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${!isDevModeOn ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      ❌ 꺼짐 (기본 상태)
                    </button>
                    <button 
                      onClick={() => setIsDevModeOn(true)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${isDevModeOn ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      ✔️ 켜짐 (설정 완료)
                    </button>
                  </div>
                )}

                {/* Missing Image Placeholder Layer */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${activeCategory}-${activeStep}-${activeCategory === 'extension' && activeStep === 0 ? downloadSource : (activeStep === 3 ? isDevModeOn : '')}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    src={getCurrentImageSrc()}
                    alt={steps[activeStep].title}
                    onError={handleImageError}
                    className="w-full h-full object-contain rounded-[24px]"
                  />
                  {imageError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 rounded-[24px] space-y-4">
                      <div className={`p-4 bg-${activeData.color}-500/20 rounded-full animate-pulse`}>
                        <activeData.icon size={32} className={`text-${activeData.color}-400`} />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-sm font-black text-white uppercase tracking-widest">스크린샷 등록 대기 중</p>
                        <p className="text-[10px] text-slate-400 font-mono bg-black/50 px-3 py-1 rounded-md">{steps[activeStep].image}</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>

                {/* Left/Right Overlays for Quick Swiping */}
                <button 
                  onClick={handlePrev}
                  className="absolute left-6 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 active:scale-90 transition-all shadow-xl z-20"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-6 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 active:scale-90 transition-all shadow-xl z-20"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Progress Slider Indicator at the Bottom */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-lg px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/5 z-20">
                <button onClick={handlePrev} className="text-slate-400 hover:text-white transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1.5">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeStep === idx ? `w-6 bg-${activeData.color}-500` : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
                <button onClick={handleNext} className="text-slate-400 hover:text-white transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Quick Actions Panel - Only show download button if in extension guide */}
            <div className="flex flex-col sm:flex-row gap-4">
              {activeCategory === 'extension' && (
                <a 
                  href="/maza-extension.zip"
                  download
                  className={`flex-1 p-5 bg-gradient-to-tr from-${activeData.color}-600 to-${activeData.color}-800 text-white rounded-[24px] text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xl shadow-${activeData.color}-600/30`}
                >
                  <Download size={16} /> 익스텐션 다운로드
                </a>
              )}
              <button 
                onClick={() => window.location.href = '/'}
                className="flex-1 p-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <span>대시보드로 돌아가기</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>

        {/* mastery support link */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
          <div className="p-8 bg-gradient-to-br from-indigo-950/20 to-slate-950/60 rounded-[32px] border border-indigo-500/10 text-white flex flex-col justify-between gap-6 relative overflow-hidden shadow-2xl">
             <div className="space-y-2.5 relative z-10">
                <h3 className="text-xl font-black italic tracking-tighter uppercase">도움이 더 필요하신가요?</h3>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed">설치 과정에서 의문이 생기거나 폴더 로드 시 경로 에러가 있다면, 연동 오류 즉시 보고 기능을 통해 라이브 지원을 신청하세요.</p>
             </div>
             <button className="w-full md:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
               <ExternalLink size={12} /> 실시간 원격 지원 요청
             </button>
          </div>

          <div className="p-8 bg-gradient-to-br from-emerald-950/20 to-slate-950/60 rounded-[32px] border border-emerald-500/10 text-white flex flex-col justify-between gap-6 relative overflow-hidden shadow-2xl">
             <div className="space-y-2.5 relative z-10">
                <h3 className="text-xl font-black italic tracking-tighter uppercase">수익화 마스터리 매뉴얼</h3>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed">마자스튜디오 챌린지의 단계별 훈련 로드맵과 10개 챕터의 상세 애드센스 승인 전술을 매뉴얼에서 즉시 열람할 수 있습니다.</p>
             </div>
             <button 
               onClick={() => window.location.href = '/guide'}
               className="w-full md:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
             >
               <ArrowRight size={12} /> 마스터리 매뉴얼 열기
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
