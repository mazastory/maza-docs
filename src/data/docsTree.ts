import {
  Rocket, Puzzle, LogIn, LayoutTemplate, Globe, Server, Box,
  Cpu, FileText, Image, Sparkles, Trophy, Target, Shield,
  Search, ShieldCheck, Zap, HelpCircle
} from 'lucide-react';

export interface DocPage {
  id: string;
  title: string;
  description?: string;
  icon?: any;
  /** URL: /docs/:sectionId/:pageId */
  sectionId: string;
  pageId: string;
  /** Heading anchors for TOC */
  headings?: { id: string; title: string; level: 2 | 3 }[];
}

export interface DocSection {
  id: string;
  title: string;
  icon: any;
  color: string;
  pages: DocPage[];
}

export const DOCS_TREE: DocSection[] = [
  {
    id: 'getting-started',
    title: '시작하기',
    icon: Rocket,
    color: 'indigo',
    pages: [
      {
        id: 'intro',
        sectionId: 'getting-started',
        pageId: 'intro',
        title: '마자 스튜디오란?',
        description: 'Maza Autopilot OS 소개 및 핵심 철학',
        icon: Sparkles,
      },
      {
        id: 'extension',
        sectionId: 'getting-started',
        pageId: 'extension',
        title: '익스텐션 설치',
        description: 'Maza Bridge 크롬 익스텐션 설치 가이드',
        icon: Puzzle,
      },
      {
        id: 'onboarding',
        sectionId: 'getting-started',
        pageId: 'onboarding',
        title: '로그인 & 온보딩',
        description: '구글 계정 로그인 및 초기 세팅',
        icon: LogIn,
      },
    ],
  },
  {
    id: 'platform',
    title: '플랫폼 연동',
    icon: Globe,
    color: 'sky',
    pages: [
      {
        id: 'tistory',
        sectionId: 'platform',
        pageId: 'tistory',
        title: '티스토리 세팅',
        description: 'RPA 자동 발행 설정 가이드',
        icon: LayoutTemplate,
      },
      {
        id: 'wordpress',
        sectionId: 'platform',
        pageId: 'wordpress',
        title: '워드프레스 세팅',
        description: 'REST API 연동 가이드',
        icon: Globe,
      },
      {
        id: 'blogspot',
        sectionId: 'platform',
        pageId: 'blogspot',
        title: '블로그스팟 세팅',
        description: 'Google OAuth 간편 연동',
        icon: Server,
      },
      {
        id: 'subdomain',
        sectionId: 'platform',
        pageId: 'subdomain',
        title: '서브도메인 개설',
        description: 'Maza 원클릭 블로그 (준비 중)',
        icon: Box,
      },
    ],
  },
  {
    id: 'features',
    title: '핵심 기능',
    icon: Cpu,
    color: 'emerald',
    pages: [
      {
        id: 'autopilot',
        sectionId: 'features',
        pageId: 'autopilot',
        title: '오토파일럿',
        description: '24시간 자율주행 자동 발행 엔진',
        icon: Cpu,
      },
      {
        id: 'aiwriter',
        sectionId: 'features',
        pageId: 'aiwriter',
        title: 'AI 라이터',
        description: '실시간 E-E-A-T 고품질 집필 엔진',
        icon: FileText,
      },
      {
        id: 'visionwriter',
        sectionId: 'features',
        pageId: 'visionwriter',
        title: '비전 라이터',
        description: '경험 사진 기반 스토리텔링 엔진',
        icon: Image,
      },
      {
        id: 'bridge',
        sectionId: 'features',
        pageId: 'bridge',
        title: 'Maza Bridge 활용',
        description: '스마트 컨텍스트 패널 활용법',
        icon: Sparkles,
      },
    ],
  },
  {
    id: 'adsense',
    title: 'AdSense 챌린지',
    icon: Trophy,
    color: 'amber',
    pages: [
      {
        id: 'challenge-flow',
        sectionId: 'adsense',
        pageId: 'challenge-flow',
        title: '챌린지 성공 순서도',
        description: '단계별 애드센스 승인 로드맵',
        icon: Trophy,
      },
      {
        id: 'strategy',
        sectionId: 'adsense',
        pageId: 'strategy',
        title: '수익화 전략 설계',
        description: '니치 선택 및 수익화 블루프린트',
        icon: Target,
      },
      {
        id: 'adsense-guide',
        sectionId: 'adsense',
        pageId: 'adsense-guide',
        title: '승인 신청 가이드',
        description: '서치콘솔~애드센스 신청 전체 흐름',
        icon: Trophy,
      },
    ],
  },
  {
    id: 'seo',
    title: 'SEO & 검색 노출',
    icon: Search,
    color: 'teal',
    pages: [
      {
        id: 'sitemap-rss',
        sectionId: 'seo',
        pageId: 'sitemap-rss',
        title: '사이트맵 & RSS 제출',
        description: '구글 서치콘솔에 사이트맵 등록하기',
        icon: Search,
      },
      {
        id: 'index-request',
        sectionId: 'seo',
        pageId: 'index-request',
        title: '색인 요청 완벽 가이드',
        description: '색인 속도를 앞당기는 4가지 방법',
        icon: Rocket,
      },
    ],
  },
  {
    id: 'safety',
    title: '안전 & 정책',
    icon: Shield,
    color: 'rose',
    pages: [
      {
        id: 'w05',
        sectionId: 'safety',
        pageId: 'w05',
        title: 'W-05 안전 프로토콜',
        description: '3시간 간격 발행으로 계정 보호',
        icon: Shield,
      },
      {
        id: 'account-safety',
        sectionId: 'safety',
        pageId: 'account-safety',
        title: '계정 보호 가이드',
        description: '절대 해서는 안 되는 행동들',
        icon: ShieldCheck,
      },
    ],
  },
  {
    id: 'faq',
    title: '자주 묻는 질문',
    icon: HelpCircle,
    color: 'violet',
    pages: [
      {
        id: 'adsense-faq',
        sectionId: 'faq',
        pageId: 'adsense-faq',
        title: '애드센스 승인 FAQ',
        description: '애드센스 관련 자주 묻는 질문',
        icon: Zap,
      },
      {
        id: 'technical-faq',
        sectionId: 'faq',
        pageId: 'technical-faq',
        title: '기술 & SEO FAQ',
        description: '색인, URL, 서치콘솔 관련 FAQ',
        icon: Search,
      },
      {
        id: 'policy-faq',
        sectionId: 'faq',
        pageId: 'policy-faq',
        title: '정책 & 보안 FAQ',
        description: '계정 보호 및 정책 관련 FAQ',
        icon: ShieldCheck,
      },
    ],
  },
];

/** 섹션 ID + 페이지 ID로 페이지 찾기 */
export function findDocPage(sectionId: string, pageId: string): DocPage | null {
  const section = DOCS_TREE.find(s => s.id === sectionId);
  if (!section) return null;
  return section.pages.find(p => p.pageId === pageId) ?? null;
}

/** 모든 페이지 flat list (검색용) */
export function getAllPages(): DocPage[] {
  return DOCS_TREE.flatMap(s => s.pages);
}

/** 다음/이전 페이지 계산 */
export function getAdjacentPages(sectionId: string, pageId: string): { prev: DocPage | null; next: DocPage | null } {
  const allPages = getAllPages();
  const idx = allPages.findIndex(p => p.sectionId === sectionId && p.pageId === pageId);
  return {
    prev: idx > 0 ? allPages[idx - 1] : null,
    next: idx < allPages.length - 1 ? allPages[idx + 1] : null,
  };
}
