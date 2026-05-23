import { useState, useEffect, lazy, Suspense } from "react";
import {
  Settings, Download, Rocket, BarChart3, Sparkles, HelpCircle, Loader2
} from "lucide-react";
import { cn } from "../lib/utils";

// Lazy load each chapter — 각 챕터가 필요할 때만 로드됨
const ChapterSetup     = lazy(() => import("../components/knowledge/ChapterSetup"));
const ChapterExtension = lazy(() => import("../components/knowledge/ChapterExtension"));
const ChapterUsage     = lazy(() => import("../components/knowledge/ChapterUsage"));
const ChapterAnalytics = lazy(() => import("../components/knowledge/ChapterAnalytics"));
const ChapterROI       = lazy(() => import("../components/knowledge/ChapterROI"));
const ChapterFAQ       = lazy(() => import("../components/knowledge/ChapterFAQ"));

type TabId = 'setup_guide' | 'extension_install' | 'program_usage' | 'analytics_sync' | 'zero_it_value' | 'faq_page';

interface KnowledgeHubProps {
  isIntegrated?: boolean;
  initialTab?: string;
  hideIntegratedTabs?: boolean;
  onComplete?: () => void;
}

const SECTIONS = [
  { id: 'setup_guide',       title: '🛠️ CH.1 블로그 세팅',         desc: '플랫폼별 인프라 구축',          icon: Settings   },
  { id: 'extension_install', title: '🔌 CH.2 익스텐션 설치',        desc: 'Chrome 브릿지 장착',            icon: Download   },
  { id: 'program_usage',     title: '🚀 CH.3 프로그램 사용법',      desc: 'AI Writer & 스냅블로그',         icon: Rocket     },
  { id: 'analytics_sync',    title: '📊 CH.4 GA4 연동',            desc: 'Andrew 통로 개설',              icon: BarChart3  },
  { id: 'zero_it_value',     title: '🦄 CH.5 제로 IT & ROI',       desc: '원클릭 오토파일럿 가치',         icon: Sparkles   },
  { id: 'faq_page',          title: '❓ CH.6 실무 FAQ',             desc: '자주 묻는 질문 총정리',          icon: HelpCircle },
];

const TAB_ALIAS: Record<string, TabId> = {
  extension: 'extension_install',
  blueprint: 'program_usage',
  keywords:  'program_usage',
  series_mastery: 'program_usage',
  master:    'program_usage',
  platforms: 'setup_guide',
  multisite: 'setup_guide',
  subdomain_strategy: 'setup_guide',
  adsense_multi: 'setup_guide',
  efficiency: 'zero_it_value',
  faq_page:  'faq_page',
};

const ChapterLoader = () => (
  <div className="flex items-center justify-center py-24">
    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
  </div>
);

export default function KnowledgeHub({
  isIntegrated = false,
  initialTab = 'setup_guide',
  hideIntegratedTabs = false,
}: KnowledgeHubProps) {
  const [activeTab, setActiveTab] = useState<TabId>('setup_guide');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') || initialTab;
    const resolved = TAB_ALIAS[tabParam] ?? (tabParam as TabId) ?? 'setup_guide';
    setActiveTab(resolved);
  }, [initialTab]);

  return (
    <div className={`${isIntegrated ? '' : 'max-w-7xl mx-auto py-16 px-6'} space-y-10`}>
      {/* Hero Header */}
      {!isIntegrated && (
        <div className="text-center space-y-4 pt-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-600 text-white font-black text-[11px] tracking-[0.3em] uppercase shadow-xl">
            <Sparkles size={13} fill="currentColor" /> MAZA KNOWLEDGE BASE
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">
            MAZA <span className="text-indigo-600">KNOWLEDGE.</span>
          </h1>
          <p className="text-base font-bold text-slate-400 tracking-tight">
            IT 장벽과 복잡한 세팅의 모든 고통,{" "}
            <span className="text-slate-900">마자 지식 센터에서 마스터하세요.</span>
          </p>
        </div>
      )}

      {/* Chapter Navigation Grid */}
      {!hideIntegratedTabs && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id as TabId)}
                className={cn(
                  "p-4 rounded-2xl text-left transition-all flex flex-col gap-3 border group relative overflow-hidden",
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl ring-4 ring-indigo-100'
                    : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-300 hover:shadow-md'
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                  isActive ? "bg-white/15 text-white" : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                )}>
                  <Icon size={15} />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-black leading-tight">{section.title}</div>
                  <div className={cn("text-[9px] font-bold leading-tight hidden md:block", isActive ? "text-indigo-200" : "text-slate-400")}>
                    {section.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Chapter Content — lazy loaded */}
      <div className="min-h-[400px]">
        <Suspense fallback={<ChapterLoader />}>
          {activeTab === 'setup_guide'       && <ChapterSetup />}
          {activeTab === 'extension_install' && <ChapterExtension />}
          {activeTab === 'program_usage'     && <ChapterUsage />}
          {activeTab === 'analytics_sync'    && <ChapterAnalytics />}
          {activeTab === 'zero_it_value'     && <ChapterROI />}
          {activeTab === 'faq_page'          && <ChapterFAQ />}
        </Suspense>
      </div>
    </div>
  );
}
