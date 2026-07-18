import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Search, Menu, X, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import DocsSidebar from '../components/docs/DocsSidebar';
import DocsTOC from '../components/docs/DocsTOC';
import DocsSearch from '../components/docs/DocsSearch';
import { DOCS_TREE, findDocPage, getAdjacentPages } from '../data/docsTree';

// ─── Lazy page components ────────────────────────────────────────────────────
// Getting Started
const PageIntro = lazy(() => import('../components/docs/pages/PageIntro'));
const PageExtensionGuide = lazy(() => import('../components/docs/pages/guides/PageExtensionGuide'));
const PagePWAInstallGuide = lazy(() => import('../components/docs/pages/guides/PagePWAInstallGuide'));
const PageOnboarding = lazy(() => import('../components/docs/pages/PageOnboarding'));

// Golden Path
const Step01Login = lazy(() => import('../components/docs/pages/golden_path/Step01Login'));
const Step02Dashboard = lazy(() => import('../components/docs/pages/golden_path/Step02Dashboard'));
const Step03Domain = lazy(() => import('../components/docs/pages/golden_path/Step03Domain'));
const Step04BlogSetup = lazy(() => import('../components/docs/pages/golden_path/Step04BlogSetup'));
const Step05Agent = lazy(() => import('../components/docs/pages/golden_path/Step05Agent'));
const Step06Blueprints = lazy(() => import('../components/docs/pages/golden_path/Step06Blueprints'));
const Step07GoogleConnect = lazy(() => import('../components/docs/pages/golden_path/Step07GoogleConnect'));
const Step08QC = lazy(() => import('../components/docs/pages/golden_path/Step08QC'));
const Step09Adsense = lazy(() => import('../components/docs/pages/golden_path/Step09Adsense'));
const Step10MazaIssue = lazy(() => import('../components/docs/pages/golden_path/Step10MazaIssue'));
const Step11BlogManage = lazy(() => import('../components/docs/pages/golden_path/Step11BlogManage'));

// Site Setup
const PageMySite = lazy(() => import('../components/docs/pages/PageMySite'));
const PageMazaBlog = lazy(() => import('../components/docs/pages/PageMazaBlog'));
const PageDomainGuide = lazy(() => import('../components/docs/pages/guides/PageDomainGuide'));
const PageTistory = lazy(() => import('../components/docs/pages/PageTistory'));
const PageWordpress = lazy(() => import('../components/docs/pages/PageWordpress'));
const PagePremiumService = lazy(() => import('../components/docs/pages/PagePremiumService'));

// Pipeline
const PageNicheWriter = lazy(() => import('../components/docs/pages/PageNicheWriter'));
const PageDemoTrendHunter = lazy(() => import('../components/docs/pages/demos/PageDemoTrendHunter'));
const PageBlueprintGallery = lazy(() => import('../components/docs/pages/PageBlueprintGallery'));
const PageAutopilot = lazy(() => import('../components/docs/pages/PageAutopilot'));
const PageVisionWriter = lazy(() => import('../components/docs/pages/PageVisionWriter'));

// Demos
const PageDemoCrowdFunding = lazy(() => import('../components/docs/pages/demos/PageDemoCrowdFunding'));
const PageDemoQCClinic = lazy(() => import('../components/docs/pages/demos/PageDemoQCClinic'));
const PageDemoAdsense = lazy(() => import('../components/docs/pages/demos/PageDemoAdsense'));


// Quality & Monetization
const PageAdsenseStrategy = lazy(() => import('../components/docs/pages/strategy/PageAdsenseStrategy'));
const PageAdsenseGuide = lazy(() => import('../components/docs/pages/PageAdsenseGuide'));

// SEO & Indexing
const PageSEOStrategy = lazy(() => import('../components/docs/pages/strategy/PageSEOStrategy'));
const PageSitemapRSS = lazy(() => import('../components/docs/pages/PageSitemapRSS'));
const PageSEOIndex = lazy(() => import('../components/docs/pages/PageSEOIndex'));
const PageTistoryCustomDomain = lazy(() => import('../components/docs/pages/strategy/PageTistoryCustomDomain'));

// Academy
const PageZeroITWorkflow = lazy(() => import('../components/docs/pages/concept/PageZeroITWorkflow'));
const PageWhyMazaBlog = lazy(() => import('../components/docs/pages/concept/PageWhyMazaBlog'));
const PageAcademyGettingStarted = lazy(() => import('../components/docs/pages/academy/PageAcademyGettingStarted'));
const PageAcademyProTips = lazy(() => import('../components/docs/pages/academy/PageAcademyProTips'));
const PageAcademyUseCases = lazy(() => import('../components/docs/pages/academy/PageAcademyUseCases'));

// Safety
const PageW05 = lazy(() => import('../components/docs/pages/PageW05'));
const PageAccountSafety = lazy(() => import('../components/docs/pages/PageAccountSafety'));
const PageGooglePoliciesDefense = lazy(() => import('../components/docs/pages/academy/PageGooglePoliciesDefense'));

// FAQ
const PageAdsenseFAQ = lazy(() => import('../components/docs/pages/PageAdsenseFAQ'));
const PageTechnicalFAQ = lazy(() => import('../components/docs/pages/PageTechnicalFAQ'));
const PagePolicyFAQ = lazy(() => import('../components/docs/pages/PagePolicyFAQ'));


// ─── Page registry ────────────────────────────────────────────────────────────
const PAGE_REGISTRY: Record<string, Record<string, () => React.ReactElement>> = {
  'getting-started': {
    'intro': () => <PageIntro />,
    'extension': () => <PageExtensionGuide />,
    'onboarding': () => <PageOnboarding />,
  },
  'golden-path': {
    'step01': () => <Step01Login />,
    'step02': () => <Step02Dashboard />,
    'step03': () => <Step03Domain />,
    'step04': () => <Step04BlogSetup />,
    'step05': () => <Step05Agent />,
    'step06': () => <Step06Blueprints />,
    'step07': () => <Step07GoogleConnect />,
    'step08': () => <Step08QC />,
    'step09': () => <Step09Adsense />,
    'step10': () => <Step10MazaIssue />,
    'step11': () => <Step11BlogManage />,
  },
  'site-setup': {
    'my-site': () => <PageMySite />,
    'blog-setup': () => <Step04BlogSetup />,
    'maza-blog': () => <PageMazaBlog />,
    'domain-guide': () => <PageDomainGuide />,
    'tistory': () => <PageTistory />,
    'wordpress': () => <PageWordpress />,
    'premium': () => <PagePremiumService />,
  },
  'pipeline': {
    'trend-hunter': () => <PageDemoTrendHunter />,
    'blueprint': () => <PageBlueprintGallery />,
    'autopilot': () => <PageAutopilot />,
    'vision-writer': () => <PageVisionWriter />,
  },
  'demos': {
    'crowdfunding': () => <PageDemoCrowdFunding />,
    'qc-demo': () => <PageDemoQCClinic />,
    'trend-demo': () => <PageDemoTrendHunter />,
  },
  'quality-monetization': {
    'qc-clinic': () => <PageDemoQCClinic />,
    'adsense-demo': () => <PageDemoAdsense />,
    'adsense-strategy': () => <PageAdsenseStrategy />,
    'adsense-guide': () => <PageAdsenseGuide />,
  },
  'seo-index': {
    'seo-strategy': () => <PageSEOStrategy />,
    'sitemap-rss': () => <PageSitemapRSS />,
    'seo-index-guide': () => <PageSEOIndex />,
    'tistory-domain': () => <PageTistoryCustomDomain />,
  },
  'academy': {
    'zero-it': () => <PageZeroITWorkflow />,
    'why-maza-blog': () => <PageWhyMazaBlog />,
    'getting-started': () => <PageAcademyGettingStarted />,
    'pro-tips': () => <PageAcademyProTips />,
    'use-cases': () => <PageAcademyUseCases />,
  },
  'safety': {
    'w05': () => <PageW05 />,
    'account-safety': () => <PageAccountSafety />,
    'google-policies': () => <PageGooglePoliciesDefense />,
  },
  'faq': {
    'adsense-faq': () => <PageAdsenseFAQ />,
    'technical-faq': () => <PageTechnicalFAQ />,
    'policy-faq': () => <PagePolicyFAQ />,
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
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Docs() {
  const { sectionId = 'getting-started', pageId = 'intro' } = useParams<{ sectionId: string; pageId: string }>();

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
      <div className={`flex flex-1 mx-auto w-full ${sectionId === 'demos' ? 'max-w-none' : 'max-w-[1400px]'}`}>

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
        <main className={`flex-1 min-w-0 py-10 ${sectionId === 'demos' ? 'max-w-none px-0' : 'px-6 lg:px-12 max-w-3xl'}`}>
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
