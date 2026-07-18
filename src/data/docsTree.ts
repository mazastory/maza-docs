import {
  Rocket, Puzzle, LogIn, LayoutTemplate, Globe, Server, Box,
  Cpu, FileText, Image, Sparkles, Trophy, Target, Shield,
  Search, ShieldCheck, Zap, HelpCircle, SearchCheck, DollarSign, Settings,
  GraduationCap, PlayCircle, Smartphone, Link, Compass, CheckCircle2, Lock, Star, Presentation, MonitorPlay
} from 'lucide-react';

export interface DocPage {
  id: string;
  title: string;
  description?: string;
  icon?: any;
  sectionId: string;
  pageId: string;
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
      { id: 'intro', sectionId: 'getting-started', pageId: 'intro', title: '마자 스튜디오란?', description: '오토파일럿 시스템 소개', icon: Compass },
      { id: 'extension', sectionId: 'getting-started', pageId: 'extension', title: '익스텐션 & 모바일 설치', description: '크롬 및 PWA 앱 설정 가이드', icon: Puzzle },
      { id: 'onboarding', sectionId: 'getting-started', pageId: 'onboarding', title: '로그인 & 온보딩', description: 'API Key 및 필수 환경 설정', icon: LogIn }
    ]
  },
  {
    id: 'golden-path',
    title: '핵심 튜토리얼 (Golden Path)',
    icon: Star,
    color: 'amber',
    pages: [
      { id: 'step01', sectionId: 'golden-path', pageId: 'step01', title: 'Step 1: 로그인', description: '크롬 확장 앱 및 API 설정', icon: LogIn },
      { id: 'step02', sectionId: 'golden-path', pageId: 'step02', title: 'Step 2: 대시보드', description: '마이 사이트 인터페이스 가이드', icon: LayoutTemplate },
      { id: 'step03', sectionId: 'golden-path', pageId: 'step03', title: 'Step 3: 플랫폼 선택', description: '마자 블로그, 티스토리, 워드프레스', icon: Box },
      { id: 'step04', sectionId: 'golden-path', pageId: 'step04', title: 'Step 4: 사이트 세팅', description: '목적 및 도메인, 약관 설정', icon: Settings },
      { id: 'step05', sectionId: 'golden-path', pageId: 'step05', title: 'Step 5: 에이전트 설정', description: '톤앤매너 및 언어 세팅', icon: Cpu },
      { id: 'step06', sectionId: 'golden-path', pageId: 'step06', title: 'Step 6: 블루프린트 발급', description: '자동화 템플릿 설계', icon: FileText },
      { id: 'step07', sectionId: 'golden-path', pageId: 'step07', title: 'Step 7: 구글 인프라 연결', description: 'GA4, 서치콘솔 원클릭 연동', icon: Globe },
      { id: 'step08', sectionId: 'golden-path', pageId: 'step08', title: 'Step 8: 품질 검사 (QC)', description: 'AI 포스팅 품질 자동 검수', icon: SearchCheck },
      { id: 'step09', sectionId: 'golden-path', pageId: 'step09', title: 'Step 9: 애드센스 신청', description: '구글 검토 요청 및 스크립트', icon: DollarSign },
      { id: 'step10', sectionId: 'golden-path', pageId: 'step10', title: 'Step 10: 트렌드 헌터', description: '실시간 검색어 오토파일럿', icon: Target },
      { id: 'step11', sectionId: 'golden-path', pageId: 'step11', title: 'Step 11: 사이트 관리', description: '통계 확인 및 발행 주기 조절', icon: ShieldCheck }
    ]
  },
  {
    id: 'demos',
    title: '라이브 데모 (Live Demos)',
    icon: MonitorPlay,
    color: 'teal',
    pages: [
      { id: 'crowdfunding', sectionId: 'demos', pageId: 'crowdfunding', title: '크라우드 펀딩 프리미엄 데모', description: '투자자용 다크 테마 데모', icon: Presentation },
      { id: 'qc-demo', sectionId: 'demos', pageId: 'qc-demo', title: 'QC Clinic 라이브 데모', description: '품질 검사 및 자동 보강 시뮬레이션', icon: SearchCheck },
      { id: 'trend-demo', sectionId: 'demos', pageId: 'trend-demo', title: '트렌드 헌터 라이브 데모', description: '실시간 검색어 기반 타겟팅', icon: Target }
    ]
  },
  {
    id: 'site-setup',
    title: '내 사이트 및 블로그 세팅',
    icon: LayoutTemplate,
    color: 'emerald',
    pages: [
      { id: 'my-site', sectionId: 'site-setup', pageId: 'my-site', title: '마이 사이트 통합 관리', description: '다중 블로그 통제 대시보드', icon: LayoutTemplate },
      { id: 'blog-setup', sectionId: 'site-setup', pageId: 'blog-setup', title: '블로그 목적별 세팅 가이드', description: '애드센스, 수익화, 퍼스널 모드 상세 가이드', icon: Settings },
      { id: 'maza-blog', sectionId: 'site-setup', pageId: 'maza-blog', title: '마자 독립 블로그 (Zero-IT)', description: '가장 강력한 자동화 추천 모델', icon: Sparkles },
      { id: 'domain-guide', sectionId: 'site-setup', pageId: 'domain-guide', title: '개인 도메인 연결 DNS 가이드', description: '포크번, 가비아 A레코드 설정', icon: Globe },
      { id: 'tistory', sectionId: 'site-setup', pageId: 'tistory', title: '티스토리 세팅', description: '티스토리 자동화 연동', icon: Box },
      { id: 'wordpress', sectionId: 'site-setup', pageId: 'wordpress', title: '워드프레스 세팅', description: '워드프레스 REST API 연동', icon: Server },
      { id: 'premium', sectionId: 'site-setup', pageId: 'premium', title: '프리미엄 블로그 제작 의뢰', description: '초기 세팅 턴키 서비스', icon: Trophy }
    ]
  },
  {
    id: 'pipeline',
    title: '자동화 파이프라인 (핵심 기능)',
    icon: Cpu,
    color: 'blue',
    pages: [
      { id: 'trend-hunter', sectionId: 'pipeline', pageId: 'trend-hunter', title: '황금 니치 발굴 & 트렌드 헌터', description: '실시간 검색어 크롤링 봇', icon: Target },
      { id: 'blueprint', sectionId: 'pipeline', pageId: 'blueprint', title: '블루프린트 갤러리', description: '수익화 템플릿 복제', icon: FileText },
      { id: 'autopilot', sectionId: 'pipeline', pageId: 'autopilot', title: '오토파일럿 제어 정책', description: '자동 예약 및 딜레이 설정', icon: PlayCircle },
      { id: 'vision-writer', sectionId: 'pipeline', pageId: 'vision-writer', title: '비전 엔진 (Vision Writer)', description: '이미지 기반 리뷰 포스팅', icon: Image }
    ]
  },
  {
    id: 'quality-monetization',
    title: '품질(QC) 및 수익화',
    icon: DollarSign,
    color: 'orange',
    pages: [
      { id: 'qc-clinic', sectionId: 'quality-monetization', pageId: 'qc-clinic', title: 'QC Clinic 및 자동 보강', description: '거절 사유 원천 차단 Auto-fix', icon: SearchCheck },
      { id: 'adsense-demo', sectionId: 'quality-monetization', pageId: 'adsense-demo', title: '애드센스 모의 심사', description: '인프라 및 SEO 스크립트 검증', icon: ShieldCheck },
      { id: 'adsense-strategy', sectionId: 'quality-monetization', pageId: 'adsense-strategy', title: '애드센스 승인 카테고리', description: '승인 100% 정보성 기획법', icon: Target },
      { id: 'adsense-guide', sectionId: 'quality-monetization', pageId: 'adsense-guide', title: '애드센스 승인 신청 가이드', description: '검토 요청 및 결과 분석', icon: CheckCircle2 }
    ]
  },
  {
    id: 'seo-index',
    title: 'SEO & 검색 노출',
    icon: Search,
    color: 'rose',
    pages: [
      { id: 'seo-strategy', sectionId: 'seo-index', pageId: 'seo-strategy', title: 'SEO 샌드박스 돌파 전략', description: '구글 봇 크롤링 원리', icon: Rocket },
      { id: 'sitemap-rss', sectionId: 'seo-index', pageId: 'sitemap-rss', title: '사이트맵 & RSS 제출', description: '서치콘솔 기초 세팅', icon: Link },
      { id: 'seo-index-guide', sectionId: 'seo-index', pageId: 'seo-index-guide', title: '색인 요청 완벽 가이드', description: '누락 방지 및 색인 강제 요청', icon: SearchCheck },
      { id: 'tistory-domain', sectionId: 'seo-index', pageId: 'tistory-domain', title: '티스토리 2차 도메인 SEO', description: '저품질 방지 방안', icon: Globe }
    ]
  },
  {
    id: 'academy',
    title: '마자 아카데미',
    icon: GraduationCap,
    color: 'violet',
    pages: [
      { id: 'zero-it', sectionId: 'academy', pageId: 'zero-it', title: '제로 IT 워크플로우', description: '자동화 인프라의 비밀', icon: Zap },
      { id: 'why-maza-blog', sectionId: 'academy', pageId: 'why-maza-blog', title: '왜 마자 블로그인가?', description: '14가지 강력한 장점', icon: Sparkles },
      { id: 'getting-started', sectionId: 'academy', pageId: 'getting-started', title: '초보자를 위한 워크플로우', description: '9단계 자동화 여정', icon: Rocket },
      { id: 'pro-tips', sectionId: 'academy', pageId: 'pro-tips', title: '프로 팁 & 노하우', description: '다국어와 오토파일럿 활용법', icon: Star },
      { id: 'use-cases', sectionId: 'academy', pageId: 'use-cases', title: '실전 활용 사례', description: '다양한 비즈니스 모델', icon: Box }
    ]
  },
  {
    id: 'safety',
    title: '안전 & 정책',
    icon: Shield,
    color: 'red',
    pages: [
      { id: 'w05', sectionId: 'safety', pageId: 'w05', title: 'W-05 안전 프로토콜', description: '물리적 지연 및 동시성 제어', icon: Lock },
      { id: 'account-safety', sectionId: 'safety', pageId: 'account-safety', title: '계정 보호 및 보안', description: '밴(Ban) 방지 가이드', icon: ShieldCheck },
      { id: 'google-policies', sectionId: 'safety', pageId: 'google-policies', title: '구글 정책 방어 가이드', description: '3-Zero 시스템의 합법성', icon: CheckCircle2 }
    ]
  },
  {
    id: 'faq',
    title: '자주 묻는 질문',
    icon: HelpCircle,
    color: 'slate',
    pages: [
      { id: 'adsense-faq', sectionId: 'faq', pageId: 'adsense-faq', title: '애드센스 승인 FAQ', description: '애드센스 관련 자주 묻는 질문', icon: Zap },
      { id: 'technical-faq', sectionId: 'faq', pageId: 'technical-faq', title: '기술 & SEO FAQ', description: '색인, URL, 서치콘솔 관련 FAQ', icon: Search },
      { id: 'policy-faq', sectionId: 'faq', pageId: 'policy-faq', title: '정책 & 보안 FAQ', description: '계정 보호 및 정책 관련 FAQ', icon: ShieldCheck }
    ]
  }
];

export function findDocPage(sectionId: string, pageId: string): DocPage | null {
  const section = DOCS_TREE.find(s => s.id === sectionId);
  if (!section) return null;
  return section.pages.find(p => p.pageId === pageId) ?? null;
}

export function getAllPages(): DocPage[] {
  return DOCS_TREE.flatMap(s => s.pages);
}

export function getAdjacentPages(sectionId: string, pageId: string): { prev: DocPage | null; next: DocPage | null } {
  const allPages = getAllPages();
  const idx = allPages.findIndex(p => p.sectionId === sectionId && p.pageId === pageId);
  return {
    prev: idx > 0 ? allPages[idx - 1] : null,
    next: idx < allPages.length - 1 ? allPages[idx + 1] : null,
  };
}
