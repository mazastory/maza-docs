import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Search, Menu, X, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import DocsSidebar from '../components/docs/DocsSidebar';
import DocsTOC from '../components/docs/DocsTOC';
import DocsSearch from '../components/docs/DocsSearch';
import { DOCS_TREE, findDocPage, getAdjacentPages } from '../data/docsTree';

// ─── Lazy page components ────────────────────────────────────────────────────
const PageIntro = lazy(() => import('../components/docs/pages/PageIntro'));
const PageSEOIndex = lazy(() => import('../components/docs/pages/PageSEOIndex'));

const Placeholder = ({ title }: { title: string }) => (
  <article className="prose-doc">
    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-6">{title}</h1>
    <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center">
      <p className="text-slate-500 font-medium">이 문서는 현재 최신 마크다운 형식으로 작성(이전) 중입니다.</p>
    </div>
  </article>
);

// ─── Page registry ────────────────────────────────────────────────────────────
const PAGE_REGISTRY: Record<string, Record<string, () => React.ReactElement>> = {
  'getting-started': {
    intro: () => <PageIntro />,
    extension: () => <Placeholder title="익스텐션 설치" />,
    onboarding: () => <Placeholder title="로그인 & 온보딩" />,
  },
  platform: {
    tistory: () => <Placeholder title="티스토리 세팅" />,
    wordpress: () => <Placeholder title="워드프레스 세팅" />,
    blogspot: () => <Placeholder title="블로그스팟 세팅" />,
    subdomain: () => <Placeholder title="서브도메인 개설" />,
  },
  features: {
    autopilot: () => <Placeholder title="오토파일럿" />,
    aiwriter: () => <Placeholder title="AI 라이터" />,
    visionwriter: () => <Placeholder title="비전 라이터" />,
    bridge: () => <Placeholder title="Maza Bridge 활용" />,
  },
  adsense: {
    'challenge-flow': () => <Placeholder title="챌린지 성공 순서도" />,
    strategy: () => <Placeholder title="수익화 전략 설계" />,
    'adsense-guide': () => <Placeholder title="승인 신청 가이드" />,
  },
  seo: {
    'sitemap-rss': () => <Placeholder title="사이트맵 & RSS 제출" />,
    'index-request': () => <PageSEOIndex />,
  },
  safety: {
    w05: () => <Placeholder title="W-05 안전 프로토콜" />,
    'account-safety': () => <Placeholder title="계정 보호 가이드" />,
  },
  faq: {
    'adsense-faq': () => <Placeholder title="애드센스 승인 FAQ" />,
    'technical-faq': () => <Placeholder title="기술 & SEO FAQ" />,
    'policy-faq': () => <Placeholder title="정책 & 보안 FAQ" />,
    all: () => <Placeholder title="모든 질문" />,
  },
};


// ─── TOC definitions ──────────────────────────────────────────────────────────
const PAGE_TOC: Record<string, Record<string, { id: string; title: string; level: 2 | 3 }[]>> = {
  'getting-started': {
    intro: [
      { id: 'intro', title: '마자 스튜디오란?', level: 2 },
      { id: 'one-engine', title: '원 엔진 파이프라인', level: 2 },
      { id: 'core-philosophy', title: '핵심 설계 철학', level: 2 },
      { id: 'w05-brief', title: 'W-05 안전 프로토콜', level: 2 },
    ],
  },
  seo: {
    'index-request': [
      { id: 'why-zero', title: '실적 0 = 정상', level: 2 },
      { id: 'manual-request', title: '수동 색인 요청', level: 2 },
      { id: 'main-vs-individual', title: '메인 vs 개별 주소', level: 2 },
      { id: 'korean-url', title: '한글 URL 인코딩', level: 2 },
      { id: 'other-methods', title: '추가 색인 방법', level: 2 },
    ],
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Docs() {
  const { sectionId = 'getting-started', pageId = 'intro' } = useParams<{ sectionId: string; pageId: string }>();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ⌘K / Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close sidebar on navigation
  useEffect(() => setSidebarOpen(false), [sectionId, pageId]);

  const page = findDocPage(sectionId, pageId);
  const { prev, next } = getAdjacentPages(sectionId, pageId);
  const headings = PAGE_TOC[sectionId]?.[pageId] ?? [];

  const PageContent = PAGE_REGISTRY[sectionId]?.[pageId];
  const section = DOCS_TREE.find(s => s.id === sectionId);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* ── Global Search ── */}
      <DocsSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Top Header ── */}
      <header className="sticky top-0 z-50 h-14 bg-white/95 backdrop-blur-sm border-b border-slate-100 flex items-center px-4 gap-3">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo */}
        <a href="https://mazastudio.kr" className="flex items-center gap-2 shrink-0 group">
          <div className="w-7 h-7 rounded-lg overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
            <img src="/logo.png" alt="MAZA" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-black uppercase tracking-tighter italic hidden sm:block">
            Maza<span className="text-indigo-600">Studio</span>
          </span>
          <span className="text-slate-300 hidden sm:block">/</span>
          <span className="text-sm font-black text-slate-500 hidden sm:block">Docs</span>
        </a>

        {/* Search Bar (center) */}
        <div className="flex-1 flex justify-center px-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 w-full max-w-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-all group"
          >
            <Search size={13} className="text-slate-400" />
            <span className="flex-1 text-left">문서 검색...</span>
            <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-black text-slate-400 shadow-sm">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right actions */}
        <a
          href="https://mazastudio.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-colors shadow-sm"
        >
          앱 열기
        </a>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">

        {/* ── Left Sidebar ── */}
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`fixed lg:sticky top-14 z-40 lg:z-auto h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-slate-100 transition-transform duration-300 overflow-y-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <DocsSidebar onNavigate={() => setSidebarOpen(false)} />
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 px-6 lg:px-12 py-10 max-w-3xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">
            <Link to="/docs/getting-started/intro" className="hover:text-indigo-600 transition-colors">Docs</Link>
            <span>/</span>
            {section && <span className="text-slate-500">{section.title}</span>}
            {page && (
              <>
                <span>/</span>
                <span className="text-slate-800">{page.title}</span>
              </>
            )}
          </nav>

          {/* Page Content */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
            }
          >
            {PageContent ? (
              <PageContent />
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="text-5xl">🔍</div>
                <h2 className="text-2xl font-black text-slate-800">페이지를 찾을 수 없습니다</h2>
                <p className="text-slate-500">
                  <Link to="/docs/getting-started/intro" className="text-indigo-600 underline font-bold">
                    처음으로 돌아가기
                  </Link>
                </p>
              </div>
            )}
          </Suspense>

          {/* Prev/Next Navigation */}
          <div className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div>
              {prev && (
                <Link
                  to={`/docs/${prev.sectionId}/${prev.pageId}`}
                  className="group flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                >
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <ChevronLeft size={12} /> 이전
                  </span>
                  <span className="text-sm font-black text-slate-700 group-hover:text-indigo-700 transition-colors">{prev.title}</span>
                </Link>
              )}
            </div>
            <div className="flex justify-end">
              {next && (
                <Link
                  to={`/docs/${next.sectionId}/${next.pageId}`}
                  className="group flex flex-col p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-right w-full"
                >
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1 justify-end">
                    다음 <ChevronRight size={12} />
                  </span>
                  <span className="text-sm font-black text-slate-700 group-hover:text-indigo-700 transition-colors">{next.title}</span>
                </Link>
              )}
            </div>
          </div>
        </main>

        {/* ── Right TOC ── */}
        <aside className="hidden xl:block sticky top-14 h-[calc(100vh-3.5rem)] w-56 shrink-0 border-l border-slate-100 overflow-y-auto">
          <DocsTOC headings={headings} />
        </aside>
      </div>
    </div>
  );
}
