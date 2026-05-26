import { useState, useEffect } from "react";
import { 
  CheckCircle2, ShieldCheck, Globe, Info,
  Zap, Search, Trophy, BarChart3, Target,
  Download, MousePointer2, LayoutGrid,
  Monitor, Sparkles, CalendarClock, Flag, Camera, PenTool,
  BookOpen, Rocket, DollarSign, Layers, Globe2,
  Coins, TrendingUp, Server, ArrowRight, ArrowLeft, HelpCircle,
  Activity, Layout, Link, Edit3, Settings, ArrowDown,
  Plus, AlertTriangle, X, Eye, Send, Loader2, Star, ChevronRight, Cpu, FileText, ExternalLink, Puzzle
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

// --- Efficiency & ROI Data ---
const EFFICIENCY_METRICS = [
  { 
    category: '기초 인프라 구축', 
    manual: 8, 
    maza: 0.1, 
    unit: '시간', 
    desc: '도메인 연결, 서치콘솔/GA4 인증, 약관 생성, 사이트맵 등록 등',
    icon: ShieldCheck,
    color: 'text-rose-500',
    bg: 'bg-rose-50'
  },
  { 
    category: '초기 콘텐츠 10개 집필', 
    manual: 40, 
    maza: 0.5, 
    unit: '시간', 
    desc: '키워드 분석, 1500자+ 고품질 본문 작성, SEO 최적화 및 이미지 매칭',
    icon: PenTool,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  { 
    category: '수익화 전략 설계', 
    manual: 5, 
    maza: 0.1, 
    unit: '시간', 
    desc: '고단가 고수익 니치 탐색 및 카테고리 구조 설계',
    icon: Target,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50'
  }
];

interface KnowledgeHubProps {
  isIntegrated?: boolean;
  initialTab?: 'niche' | 'legal' | 'seo' | 'efficiency' | 'extension' | 'blueprint' | 'platforms' | 'multisite' | 'adsense_multi' | 'revenue_max' | 'subdomain_strategy' | 'series_mastery' | 'keywords' | 'master' | 'adsense_challenge' | 'faq_page';
  hideIntegratedTabs?: boolean;
  onComplete?: () => void;
}

export default function KnowledgeHub({ 
  isIntegrated = false, 
  initialTab = 'blueprint', 
  hideIntegratedTabs = false,
  onComplete 
}: KnowledgeHubProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 5 Chapters + 1 FAQ Chapter state
  const [activeTab, setActiveTab] = useState<'setup_guide' | 'extension_install' | 'program_usage' | 'analytics_sync' | 'adsense_challenge' | 'zero_it_value' | 'faq_page'>('setup_guide');
  
  const [site, setSite] = useState<any>(null);
  const [blogUrl, setBlogUrl] = useState<string>(localStorage.getItem('m_blog_url') || '');
  const [isUrlEdit, setIsUrlEdit] = useState(false);

  // Sub-tab state within Chapter 1 (Setup Guide)
  const [platformTab, setPlatformTab] = useState<'tistory' | 'blogger' | 'wordpress' | 'scaling'>('tistory');

  // Sub-tab state within Chapter 3 (Program Usage)
  const [usageTab, setUsageTab] = useState<'autotext' | 'snapblog' | 'authority'>('autotext');

  // Interactive FAQ page state
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Carousel slide indexes for visual manuals
  const [ch1Slide, setCh1Slide] = useState(0);
  const [ch2Slide, setCh2Slide] = useState(0);
  const [ch3Slide, setCh3Slide] = useState(0);
  const [ch4Slide, setCh4Slide] = useState(0);
  const [ch6Slide, setCh6Slide] = useState(0);


  // Reorganized ultra-premium 5-chapter array + FAQ tab
  const SECTIONS = [
    {
      id: 'setup_guide',
      title: '🛠️ CHAPTER 1: 블로그 세팅 방법',
      desc: '티스토리 / 블로거 / 워드프레스 맞춤 인프라 궤도',
      icon: Settings
    },
    {
      id: 'extension_install',
      title: '🔌 CHAPTER 2: 익스텐션 1초 설치',
      desc: 'Maza Bridge Chrome 익스텐션 및 배차 세션 수동 장착',
      icon: Download
    },
    {
      id: 'program_usage',
      title: '🚀 CHAPTER 3: 프로그램 사용법',
      desc: '정보성 AI Writer & 비전 스냅블로그 경험증명 결합',
      icon: Rocket
    },
    {
      id: 'analytics_sync',
      title: '📊 CHAPTER 4: GA4 애널리틱스 연동',
      desc: 'Andrew 최초 1회 통로 개설 및 다계정 독립 분리',
      icon: BarChart3
    },
    {
      id: 'adsense_challenge',
      title: '🎯 CHAPTER 5: AdSense 챌린지',
      desc: '오토파일럿으로 합격 운용 및 실전 랭킹',
      icon: Trophy
    },
    {
      id: 'zero_it_value',
      title: '🦄 CHAPTER 6: 제로 IT 혁신 & ROI',
      desc: '수동 작업 고통과 마자 원클릭 오토파일럿 대조',
      icon: Sparkles
    },
    {
      id: 'faq_page',
      title: '❓ CHAPTER 6: 실무 FAQ 마스터',
      desc: '다계정 연동, W-05 쿨타임, 포스팅 색인 오류 총정리',
      icon: HelpCircle
    }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const validTabs = ['efficiency', 'extension', 'blueprint', 'platforms', 'multisite', 'adsense_multi', 'revenue_max', 'subdomain_strategy', 'keywords', 'series_mastery', 'master', 'adsense_challenge', 'faq_page'];
    
    const resolveTab = (tabStr: string | null) => {
      if (!tabStr) return 'setup_guide';
      if (tabStr === 'extension') return 'extension_install';
      if (tabStr === 'adsense_challenge') return 'adsense_challenge';
      if (['blueprint', 'keywords', 'series_mastery', 'master'].includes(tabStr)) return 'program_usage';
      if (['platforms', 'multisite', 'subdomain_strategy', 'adsense_multi'].includes(tabStr)) return 'setup_guide';
      if (tabStr === 'efficiency') return 'zero_it_value';
      if (tabStr === 'faq_page') return 'faq_page';
      return 'setup_guide';
    };

    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(resolveTab(tabParam) as any);
      // Map specific sub-tabs if matching
      if (['platforms'].includes(tabParam)) setPlatformTab('tistory');
      if (['multisite', 'subdomain_strategy', 'adsense_multi'].includes(tabParam)) setPlatformTab('scaling');
      if (['blueprint', 'keywords'].includes(tabParam)) setUsageTab('autotext');
      if (['series_mastery', 'master'].includes(tabParam)) setUsageTab('authority');
    } else if (initialTab) {
      setActiveTab(resolveTab(initialTab) as any);
      if (['platforms'].includes(initialTab)) setPlatformTab('tistory');
      if (['multisite', 'subdomain_strategy', 'adsense_multi'].includes(initialTab)) setPlatformTab('scaling');
      if (['blueprint', 'keywords'].includes(initialTab)) setUsageTab('autotext');
      if (['series_mastery', 'master'].includes(initialTab)) setUsageTab('authority');
    }
  }, [initialTab]);

  useEffect(() => {
    if (user) fetchSite();
  }, [user]);

  const fetchSite = async () => {
    const { data } = await supabase.from('ms_sites').select('*').eq('user_id', user?.id).order('updated_at', { ascending: false }).limit(1).maybeSingle();
    setSite(data);
    if (data?.domain && !blogUrl) {
      setBlogUrl(data.domain);
    }
  };

  const getGlobalAdminLink = (path: string) => {
    const url = (blogUrl || "").toLowerCase();
    const cleanUrl = url.replace('https://', '').replace('http://', '').split('/')[0] || "blog.com";
    
    if (url.includes('blogspot.com')) {
      const mappings: Record<string, string> = {
        "/config": "https://www.blogger.com/blog/settings/",
        "/design/skin/edit": "https://www.blogger.com/blog/themes/edit/",
        "/mobile": "https://www.blogger.com/blog/settings/",
        "/plugin": "https://www.blogger.com/blog/layout/",
        "/category": "https://www.blogger.com/blog/posts/",
        "/design/sidebar": "https://www.blogger.com/blog/layout/",
        "/comment": "https://www.blogger.com/blog/comments/",
        "/statistics": "https://www.blogger.com/blog/stats/"
      };
      return mappings[path] || "https://www.blogger.com";
    } else if (url.includes('wordpress.com') || url.includes('/wp-admin')) {
      const wpBase = url.startsWith('http') ? `https://${cleanUrl}` : `http://${cleanUrl}`;
      const mappings: Record<string, string> = {
        "/config": `${wpBase}/wp-admin/options-general.php`,
        "/design/skin/edit": `${wpBase}/wp-admin/theme-editor.php`,
        "/mobile": `${wpBase}/wp-admin/options-writing.php`,
        "/plugin": `${wpBase}/wp-admin/plugins.php`,
        "/category": `${wpBase}/wp-admin/edit-tags.php?taxonomy=category`,
        "/design/sidebar": `${wpBase}/wp-admin/widgets.php`,
        "/comment": `${wpBase}/wp-admin/edit-comments.php`,
        "/statistics": `${wpBase}/wp-admin/index.php?page=stats`
      };
      return mappings[path] || `${wpBase}/wp-admin/`;
    }

    // 티스토리 특화 매핑 (기본값)
    const tistoryMappings: Record<string, string> = {
      "/config": `https://${cleanUrl}/manage/setting`,
      "/design/skin/edit": `https://${cleanUrl}/manage/design/skin/edit`,
      "/mobile": `https://${cleanUrl}/manage/setting/mobile`,
      "/plugin": `https://${cleanUrl}/manage/revenue`,
      "/category": `https://${cleanUrl}/manage/category`,
      "/design/sidebar": `https://${cleanUrl}/manage/design/sidebar`,
      "/comment": `https://${cleanUrl}/manage/comment`,
      "/statistics": `https://${cleanUrl}/manage/statistics`
    };

    return tistoryMappings[path] || `https://${cleanUrl}/manage${path}`;
  };

  const handleSaveUrl = () => {
    localStorage.setItem('m_blog_url', blogUrl);
    setIsUrlEdit(false);
    toast.success("블로그 주소가 저장되었습니다. 이제 모든 링크가 유저님 블로그에 맞춰 자동 생성됩니다.");
  };

  const getTistoryLink = (path: string) => {
    if (!blogUrl) return "https://www.tistory.com";
    const cleanUrl = blogUrl.replace('https://', '').replace('http://', '').split('/')[0];
    return `https://${cleanUrl}/manage${path}`;
  };

  return (
    <div className={`${isIntegrated ? '' : 'max-w-7xl mx-auto py-16 px-6'} space-y-16`}>
      {/* Header & Manifesto: The Savior Intro */}
      {!isIntegrated && (
        <div className="space-y-8 max-w-5xl mx-auto pt-8">
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white font-black text-[11px] tracking-[0.4em] uppercase shadow-2xl shadow-indigo-200 border-2 border-indigo-400/30"
            >
               <Sparkles size={14} fill="currentColor" /> MAZA AUTOPILOT OS v8.2 KNOWLEDGE BASE
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-8xl font-black tracking-tighter italic uppercase text-slate-900 leading-[0.8]">
                MAZA <span className="text-indigo-600">KNOWLEDGE GURU.</span>
              </h1>
              <p className="text-xl font-black text-slate-400 tracking-tight uppercase italic">
                IT 장벽과 복잡한 세팅의 모든 고통, <br />
                <span className="text-slate-900">마자의 프리미엄 지식 센터에서 1초 만에 마스터하세요.</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grouped Navigation Hub: Styled as 6 Interactive Cards */}
      {!hideIntegratedTabs && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id as any)}
              className={cn(
                "p-4 rounded-[24px] text-left transition-all flex flex-col justify-between h-32 border relative overflow-hidden group",
                activeTab === section.id 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50/50' 
                  : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-600 hover:shadow-lg'
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                activeTab === section.id ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
              )}>
                <section.icon size={16} />
              </div>
              <div className="space-y-0.5 relative z-10">
                <div className="text-[10px] font-black uppercase tracking-tight leading-tight">{section.title}</div>
                <div className={cn("text-[8px] font-bold leading-tight", activeTab === section.id ? "text-indigo-200" : "text-slate-400")}>
                  {section.desc}
                </div>
              </div>
              <div className="absolute -right-3 -bottom-3 text-slate-100 font-black text-6xl italic pointer-events-none group-hover:scale-105 transition-transform" style={{ opacity: activeTab === section.id ? 0.05 : 0.2 }}>
                {section.id === 'setup_guide' && '1'}
                {section.id === 'extension_install' && '2'}
                {section.id === 'program_usage' && '3'}
                {section.id === 'analytics_sync' && '4'}
                {section.id === 'adsense_challenge' && '5'}
                {section.id === 'zero_it_value' && '6'}
                {section.id === 'faq_page' && 'Q'}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* CHAPTER 1: 블로그 세팅 방법 (setup_guide) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === 'setup_guide' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
          {/* Global Infra Orbit: Blog Link & Settings */}
          <div className="bg-slate-900 p-10 rounded-[64px] shadow-3xl relative overflow-hidden border border-white/5">
             <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
             <div className="relative z-10 space-y-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                   <div className="space-y-3 text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/20">
                         🌍 GLOBAL INFRA ORBIT
                      </div>
                      <h4 className="text-white text-3xl font-black italic tracking-tighter">어떤 플랫폼이든 고민하지 마세요. <br /><span className="text-indigo-400">마자가 길을 열어둡니다.</span></h4>
                      <p className="text-slate-400 text-xs font-bold">운영 중인 블로그 URL 주소를 입력하면 마자가 알아서 최적의 설정 페이지들을 1초 만에 연동해 드립니다.</p>
                   </div>
                   <div className="w-full md:w-auto shrink-0">
                      {isUrlEdit ? (
                        <div className="flex gap-2 bg-white/5 p-2 rounded-[24px] border border-white/10">
                          <input 
                            type="text" 
                            value={blogUrl} 
                            onChange={(e) => setBlogUrl(e.target.value)}
                            placeholder="any-blog.blogspot.com"
                            className="bg-transparent px-6 py-3 text-sm font-bold w-full md:w-64 outline-none text-white"
                          />
                          <button onClick={handleSaveUrl} className="bg-indigo-600 text-white px-8 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Connect</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-6 bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-xl">
                          <div>
                             <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Connected URL</div>
                             <p className="text-xl font-black italic text-white tracking-tighter">{blogUrl || "Link your platform"}</p>
                          </div>
                          <button onClick={() => setIsUrlEdit(true)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors">
                             <Edit3 size={18} />
                          </button>
                        </div>
                      )}
                   </div>
                </div>

                {/* Link to Official Installation Guide for Settings */}
                <div className="pt-8 border-t border-white/10">
                  <a 
                    href="/installation-guide" 
                    className="block w-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-all" />
                     <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                              <Settings size={32} className="text-white" />
                           </div>
                           <div>
                              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-white/20">
                                 Official Settings Guide
                              </div>
                              <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-1">
                                 ⚙️ 플랫폼별 상세 세팅 가이드 보기
                              </h4>
                              <p className="text-indigo-100 font-medium text-sm">
                                 티스토리, 워드프레스, 블로그스팟 등 각 플랫폼별 정확한 세팅 방법은 설치 가이드에서 확인하세요.
                              </p>
                           </div>
                        </div>
                        <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-2 transition-transform shadow-lg">
                           <ArrowRight size={20} />
                        </div>
                     </div>
                  </a>
                </div>
             </div>
          </div>
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────── */}
      {/* CHAPTER 2: 익스텐션 1초 설치 (extension_install) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === 'extension_install' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
          {/* Extension Hero */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl border border-indigo-500/20">
             <div className="absolute top-0 right-0 p-12 opacity-10 italic font-black text-8xl pointer-events-none uppercase tracking-tighter">Manual</div>
             <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-6">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 border border-indigo-500/30">
                      <Sparkles size={14} className="text-indigo-400" /> MAZA BRIDGE ENGINE PRO
                   </div>
                   <h3 className="text-5xl font-black italic tracking-tighter leading-tight uppercase">
                      마자 매뉴얼 <br />
                      <span className="text-indigo-400">MAZA MANUAL</span>
                   </h3>
                   <p className="text-indigo-100/60 font-medium text-base leading-relaxed">
                      마자 브릿지 익스텐션은 단순한 도구가 아닌, 웹앱과 블로그 플랫폼을 잇는 <br />
                      실시간 오케스트레이터입니다. 설치부터 배차까지 완벽 가이드를 확인하세요.
                   </p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/10 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
                   <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-[0_0_50px_rgba(79,70,229,0.4)] relative group">
                      <Globe size={48} className="animate-spin-slow group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg">
                         <CheckCircle2 size={16} />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-2xl font-black italic tracking-tight text-white">Maza Bridge v3.1.0 PRO</div>
                      <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Orchestration & Injection Engine</div>
                   </div>
                </div>
             </div>
          </div>

          {/* Standalone Installation Guide Link */}
          <a 
            href="/installation-guide" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-all" />
             <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                      <Puzzle size={32} className="text-white" />
                   </div>
                   <div>
                      <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-white/20">
                         Step-by-Step Tutorial
                      </div>
                      <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-1">
                         🖥️ 초고화질 스크린샷 1초 설치 완벽 가이드
                      </h4>
                      <p className="text-indigo-100 font-medium text-sm">
                         어려운 텍스트 설명 대신, 실제 화면을 보며 클릭 3번만에 설치를 끝내세요. (새 탭에서 열기)
                      </p>
                   </div>
                </div>
                <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-2 transition-transform shadow-lg">
                   <ExternalLink size={20} />
                </div>
             </div>
          </a>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
             {/* Sidebar Guide */}
             <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8 group hover:border-indigo-600 transition-all">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                         <Layout size={28} />
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-slate-900 tracking-tight">커맨드 사이드바 (Sidebar)</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time Monitoring Hub</p>
                      </div>
                   </div>
                   <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Matched Monitoring</div>
                </div>
                <div className="space-y-4">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                         IDENTITY: 계정 연동 확인
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                         웹앱에서 로그인한 계정 정보가 사이드바 상단에 <span className="text-indigo-600 font-black">Connected</span> 상태로 표시되어야 합니다. 토큰이 유효하지 않으면 자동 발행이 불가능합니다.
                      </p>
                   </div>
                   <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-indigo-900">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                         MATCHED: 도메인 매칭 로직
                      </div>
                      <p className="text-[11px] text-indigo-800/70 font-medium leading-relaxed">
                         현재 브라우저 탭의 주소가 마자에 등록된 도메인과 일치하면 <span className="text-emerald-600 font-black">Matched</span> 로 표시됩니다. 일치하지 않을 경우 배차 명령을 통해 해당 탭으로 자동 이동합니다.
                      </p>
                   </div>
                </div>
             </div>

             {/* Orchestrator Guide */}
             <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8 group hover:border-slate-900 transition-all">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-900 text-white rounded-3xl flex items-center justify-center">
                         <Zap size={28} fill="currentColor" />
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-slate-900 tracking-tight">오토파일럿 배차 (Dispatch)</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Zero-Jump Autonomous Flow</p>
                      </div>
                   </div>
                   <div className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">Proactive Tasking</div>
                </div>
                <div className="space-y-4">
                   <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-3 shadow-2xl">
                      <div className="flex items-center gap-2 text-xs font-black text-indigo-400">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                         명령 기반 강제 타겟팅
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                         하단 오토파일럿 바에서 블로그를 선택해 [발행]을 누르면, 익스텐션이 <span className="text-white font-black">해당 도메인의 탭을 직접 찾거나 생성</span>하여 콘텐츠를 주입합니다. 유저는 이동할 필요가 없습니다.
                      </p>
                   </div>
                   <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-rose-900">
                         <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                         W-05 SAFETY: 3시간 발행 간격
                      </div>
                      <p className="text-[11px] text-rose-800/70 font-medium leading-relaxed">
                         계정 보호를 위해 동일 블로그에 대한 자동 발행은 최소 <span className="text-rose-600 font-black">3시간(10,800초)</span>의 간격을 강제합니다. 엔진이 자율적으로 배차 시간을 조절합니다.
                      </p>
                   </div>
                </div>
             </div>
          </div>

          {/* Installation Steps: Redesigned */}
          <div className="space-y-8">
             <div className="text-center">
                <h4 className="text-2xl font-black italic tracking-tighter uppercase">Extension Installation Guide</h4>
                <p className="text-sm text-slate-400 font-medium">단 3분이면 마자의 모든 자동화 기능을 사용할 수 있습니다.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg flex flex-col justify-between h-80 group">
                   <div className="flex justify-between items-center">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">01</div>
                      <Download className="text-slate-200 group-hover:text-indigo-400" size={24} />
                   </div>
                   <div className="space-y-1">
                      <div className="text-sm font-black uppercase italic tracking-tight">Download Package</div>
                      <p className="text-[10px] text-slate-400 font-bold">최신 익스텐션 소스 파일을 다운로드합니다.</p>
                   </div>
                   <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = '/maza-extension.zip';
                        link.download = 'maza-extension.zip';
                        link.click();
                        toast.success('익스텐션 다운로드 시작!');
                      }}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all"
                   >
                      ZIP 파일 다운로드
                   </button>
                </div>

                {/* Step 2 */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg flex flex-col justify-between h-80 group">
                   <div className="flex justify-between items-center">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">02</div>
                      <Settings className="text-slate-200 group-hover:text-indigo-400" size={24} />
                   </div>
                   <div className="space-y-1">
                      <div className="text-sm font-black uppercase italic tracking-tight">Enable Dev Mode</div>
                      <p className="text-[10px] text-slate-400 font-bold">chrome://extensions 페이지에서 개발자 모드를 활성화하세요.</p>
                   </div>
                   <button 
                      onClick={() => {
                        navigator.clipboard.writeText('chrome://extensions');
                        toast.success('주소가 복사되었습니다! 새 탭에 붙여넣으세요.');
                      }}
                      className="w-full py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-indigo-600 transition-all"
                   >
                      설정 주소 복사
                   </button>
                </div>

                {/* Step 3 */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg flex flex-col justify-between h-80 group">
                   <div className="flex justify-between items-center">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">03</div>
                      <Rocket className="text-slate-200 group-hover:text-indigo-400" size={24} />
                   </div>
                   <div className="space-y-1">
                      <div className="text-sm font-black uppercase italic tracking-tight">Load Unpacked</div>
                      <p className="text-[10px] text-slate-400 font-bold">압축해제된 확장 프로그램 로드 버튼으로 폴더를 선택합니다.</p>
                   </div>
                   <div className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] text-center border border-emerald-100">
                      SETTING COMPLETE
                   </div>
                </div>
             </div>
          </div>

          {/* Troubleshooting Section */}
          <div className="p-10 bg-slate-50 rounded-[48px] border border-slate-100 space-y-6">
             <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-indigo-600" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Troubleshooting (자주 묻는 질문)</h4>
             </div>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <div className="text-[11px] font-black text-slate-800">Q. 사이드바가 계속 'Disconnected' 상태입니다.</div>
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed">웹앱에서 로그아웃 후 다시 로그인해보세요. 익스텐션이 실행 중인 상태에서 로그인을 해야 토큰이 정상적으로 동기화됩니다.</p>
                </div>
                <div className="space-y-1">
                   <div className="text-[11px] font-black text-slate-800">Q. 티스토리 글쓰기 화면에서 본문이 주입되지 않습니다.</div>
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed">티스토리 구버전 에디터이거나 특수 스킨일 경우 감지가 늦어질 수 있습니다. 사이드바 하단의 [Force Polling] 버튼을 눌러 강제 주입을 시도하세요.</p>
                </div>
             </div>
          </div>


            {/* Visual Extension Installation Walkthrough */}
            <div className="mt-12 bg-slate-900 border border-indigo-500/20 rounded-[48px] p-10 space-y-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none text-9xl italic font-black text-white">BRIGDE</div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 border border-indigo-500/30 mb-3">
                     🔌 Visual Manual
                  </div>
                  <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight">
                    마자 브릿지 설치 시각 매뉴얼
                  </h4>
                  <p className="text-slate-400 text-xs font-bold leading-relaxed mt-1">
                    크롬 브라우저에 브릿지 익스텐션을 설치하는 전 과정을 시각적으로 확인하세요.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => setCh2Slide(prev => prev > 0 ? prev - 1 : 3)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-all active:scale-95"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
                    {ch2Slide + 1} / 4
                  </span>
                  <button 
                    onClick={() => setCh2Slide(prev => prev < 3 ? prev + 1 : 0)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-all active:scale-95"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
                {/* Screenshot Frame */}
                <div className="md:col-span-7 bg-slate-950 p-4 rounded-[40px] border border-white/5 shadow-2xl relative group">
                  <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="aspect-[16/10] overflow-hidden rounded-[28px] border border-white/5 relative bg-slate-900 flex items-center justify-center">
                    {ch2Slide === 0 && (
                      <div className="grid grid-cols-2 gap-2 w-full h-full p-2">
                        <div className="relative rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between p-3 bg-slate-900/80">
                          <span className="absolute top-2 left-2 text-[8px] bg-red-500/20 text-red-400 font-bold px-1.5 py-0.5 rounded uppercase">Before</span>
                          <img src="/screenshots/step_developer_off.webp" alt="개발자모드 끔" className="w-full h-full object-contain rounded" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between p-3 bg-indigo-950/40">
                          <span className="absolute top-2 left-2 text-[8px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded uppercase">After (ON)</span>
                          <img src="/screenshots/step_developer_on.webp" alt="개발자모드 켬" className="w-full h-full object-contain rounded" />
                        </div>
                      </div>
                    )}
                    {ch2Slide === 1 && <img src="/screenshots/step_01.webp" alt="압축해제 로드" className="w-full h-full object-cover object-top animate-fade-in" />}
                    {ch2Slide === 2 && (
                      <div className="grid grid-cols-2 gap-2 w-full h-full p-2">
                        <div className="relative rounded-2xl overflow-hidden border border-white/5 p-2 bg-slate-950/40">
                          <img src="/screenshots/step_02.webp" alt="설치완료" className="w-full h-full object-contain" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden border border-white/5 p-2 bg-slate-950/40">
                          <img src="/screenshots/step_03.webp" alt="핀고정" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}
                    {ch2Slide === 3 && <img src="/screenshots/step_08.webp" alt="사이드바 상태 패널" className="w-full h-full object-cover object-top animate-fade-in" />}
                  </div>
                </div>

                {/* Explanation text */}
                <div className="md:col-span-5 space-y-6">
                  {ch2Slide === 0 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Step 01</div>
                      <h5 className="text-xl font-black text-white italic tracking-tight">크롬 개발자 모드 ON (Dev Mode)</h5>
                      <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                        크롬 우상단 메뉴의 [확장 프로그램 관리] 또는 주소창에 <span className="text-indigo-400 font-bold underline">chrome://extensions</span>를 입력하여 확장 관리 창으로 이동한 후, 우상단의 <strong>[개발자 모드] 스위치를 활성화</strong>합니다.
                      </p>
                      <ul className="text-[10px] text-slate-400 font-bold space-y-2 border-t border-white/5 pt-4">
                        <li className="flex items-center gap-2">✔️ 스위치를 켜야 로컬 폴더 임포트 메뉴가 활성화됩니다.</li>
                        <li className="flex items-center gap-2">✔️ 마자 브릿지는 보안상 어떠한 개인정보도 수집하지 않습니다.</li>
                      </ul>
                    </div>
                  )}
                  {ch2Slide === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Step 02</div>
                      <h5 className="text-xl font-black text-white italic tracking-tight">압축해제된 확장 프로그램 로드</h5>
                      <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                        다운로드한 ZIP 패키지를 폴더에 압축 해제합니다. 관리 창 좌측 상단의 <strong>[압축해제된 확장 프로그램을 로드]</strong> 버튼을 누른 후, 압축을 해제한 폴더를 통째로 선택합니다.
                      </p>
                      <ul className="text-[10px] text-slate-400 font-bold space-y-2 border-t border-white/5 pt-4">
                        <li className="flex items-center gap-2">✔️ manifest.json 파일이 들어있는 최상위 폴더를 골라야 합니다.</li>
                        <li className="flex items-center gap-2">✔️ 성공 시 마자 브릿지 카드가 크롬 목록에 생성됩니다.</li>
                      </ul>
                    </div>
                  )}
                  {ch2Slide === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Step 03</div>
                      <h5 className="text-xl font-black text-white italic tracking-tight">설치 성공 및 상단 고정(Pin)</h5>
                      <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                        설치가 완료되면 크롬 우측 상단의 퍼즐 조각 아이콘(확장 프로그램 목록)을 클릭하고, **Maza Bridge 옆의 핀(Pin) 아이콘**을 눌러 언제든 상태를 볼 수 있도록 활성화합니다.
                      </p>
                      <ul className="text-[10px] text-slate-400 font-bold space-y-2 border-t border-white/5 pt-4">
                        <li className="flex items-center gap-2">✔️ 핀으로 고정하면 브라우저 우상단에 로고가 노출됩니다.</li>
                        <li className="flex items-center gap-2">✔️ 1회 고정만 해두면 앞으로 모든 작업은 원클릭 오토파일럿으로 가동됩니다.</li>
                      </ul>
                    </div>
                  )}
                  {ch2Slide === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Step 04</div>
                      <h5 className="text-xl font-black text-white italic tracking-tight">사이드바 동기화 및 발행 준비 완료</h5>
                      <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                        마자 웹앱 우측에 사이드바가 출현하며 계정이 자동으로 연결(<span className="text-emerald-400 font-bold">Connected</span>)됩니다. 이제 오토파일럿 배차가 정상 작동합니다.
                      </p>
                      <ul className="text-[10px] text-slate-400 font-bold space-y-2 border-t border-white/5 pt-4">
                        <li className="flex items-center gap-2">✔️ Identity가 자동으로 연동되어 별도 토큰 입력 없음</li>
                        <li className="flex items-center gap-2">✔️ Tistory 글쓰기 창에서 실시간 세션 자동 매치</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


      {/* ──────────────────────────────────────────────────────────── */}
      {/* CHAPTER 3: 프로그램 사용법 (program_usage) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === 'program_usage' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
          
          {/* Standalone Usage Guide Link */}
          <a 
            href="/usage-guide" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden mb-8"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-all" />
             <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                      <Monitor size={32} className="text-white" />
                   </div>
                   <div>
                      <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-white/20">
                         Maza Autopilot OS Tutorial
                      </div>
                      <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-1">
                         🚀 초고화질 스크린샷 1초 사용 완벽 가이드
                      </h4>
                      <p className="text-emerald-50 font-medium text-sm">
                         정보성 포스팅부터 경험증명(스냅블로그)까지, 클릭 한 번으로 끝나는 마법같은 수익화 프로세스를 확인하세요. (새 탭에서 열기)
                      </p>
                   </div>
                </div>
                <div className="w-12 h-12 bg-white text-emerald-600 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-2 transition-transform shadow-lg">
                   <ExternalLink size={20} />
                </div>
             </div>
          </a>

          {/* Sub-tabs within Chapter 3 */}
          <div className="flex bg-slate-100 p-2 rounded-[24px] max-w-2xl mx-auto gap-2">
            {[
              { id: 'autotext', label: '✍️ Auto-Text (정보성 집필)' },
              { id: 'snapblog', label: '📸 SnapBlog (경험 증명)' },
              { id: 'authority', label: '📅 Topical Authority (시리즈)' }
            ].map(subTab => (
              <button
                key={subTab.id}
                onClick={() => setUsageTab(subTab.id as any)}
                className={cn(
                  "flex-1 py-4 text-xs font-black uppercase tracking-wider rounded-2xl transition-all text-center",
                  usageTab === subTab.id 
                    ? "bg-white text-indigo-600 shadow-md" 
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {subTab.label}
              </button>
            ))}
          </div>

          {/* Sub-tab 1: Auto-Text */}
          {usageTab === 'autotext' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              {/* Approval Formula */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-800">애드센스 승인 공식 (Winning Blueprint)</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AdSense Approval Formula</p>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl space-y-4 text-slate-700">
                    <p className="text-xs font-bold leading-relaxed italic">
                      "사람에게 실제로 유용하며, 가독성 높은 표와 FAQ를 구비한 충실한 독립 매체"
                    </p>
                    <div className="space-y-2 pt-4 border-t border-slate-200">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>최소 글자수</span>
                        <span className="text-indigo-600">1,500 ~ 2,500자</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>필수 구조</span>
                        <span className="text-indigo-600">H2/H3 태그 2개 이상, 표, FAQ 포함</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>YMYL 안전검사</span>
                        <span className="text-indigo-600">고위험 의학/금융 키워드 필터링</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keyword Vault */}
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Coins size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-800">고수익 키워드 금고 (High-CPC Vault)</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">API-Free High-CPC Shuffling</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: "금융 & 지원금", desc: "소상공인 정책자금, 연말정산" },
                      { title: "보험 & 세금", desc: "실비보험 청구 서류, 4세대 실손" },
                      { title: "IT & 라이선스", desc: "웹호스팅, AI 코딩 툴" },
                      { title: "법률 & 부동산", desc: "양도소득세 비과세, 청약 가점" }
                    ].map((k, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs font-black text-indigo-600 mb-0.5">{k.title}</div>
                        <div className="text-[9px] text-slate-400 font-bold">{k.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 2: SnapBlog */}
          {usageTab === 'snapblog' && (
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                        <Camera size={28} />
                     </div>
                     <div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter">비전 스냅블로그 (Vision snapBlog)</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Experience-First Protocol (E-01)</p>
                     </div>
                  </div>
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">Experience-First</span>
               </div>

               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  구글은 AI가 기계적으로 쏟아내는 가짜 지식보다 **인간이 실제로 체험하고 남긴 독창적인 기록(Experience)**을 훨씬 더 신뢰하며 노출 순위를 대폭 우대합니다.
                  스냅블로그는 모바일 기기로 직접 찍은 일상 사진을 수익형 블로그의 최고급 자산으로 즉각 가공하는 에이전트 시스템입니다.
               </p>

               <div className="grid md:grid-cols-3 gap-6 pt-4">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-3">
                     <strong className="text-xs font-black text-slate-800 block underline decoration-indigo-200">P-01 Exif Metadata Cleaning</strong>
                     <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                        개인정보 누출 방지 및 중복 이미지 필터 우회를 위해 모바일 사진 업로드 즉시 원본 위치, 촬영 시간 등 모든 메타데이터를 백서버에서 깨끗이 세탁(Scrubbing)합니다.
                     </p>
                  </div>
                  <div className="p-6 bg-indigo-50/50 border border-indigo-100/50 rounded-3xl space-y-3">
                     <strong className="text-xs font-black text-indigo-900 block underline decoration-indigo-200">P-02 Device Proof Meta</strong>
                     <p className="text-[10px] text-indigo-800/70 font-bold leading-relaxed">
                        메타데이터 세탁 전, 사진이 촬영된 모바일 기기 정보(Make/Model, 예: iPhone 15 Pro)를 별도로 안전하게 발췌해 AI 서사 생성 시 '인간적이고 기술적인 경험 증명' 장치로 심습니다.
                     </p>
                  </div>
                  <div className="p-6 bg-emerald-50/50 border border-emerald-100/50 rounded-3xl space-y-3">
                     <strong className="text-xs font-black text-emerald-950 block underline decoration-emerald-200">E-03 Visual Seal Stamp</strong>
                     <p className="text-[10px] text-emerald-800/70 font-bold leading-relaxed">
                        발행되는 포스팅 본문 하단에 기기 모델 정보와 고유 세탁 검증 마크가 포함된 '경험 인증 실(Experience Seal)'을 주입하여 검색 로봇에게 완벽한 독창성 점수를 증명합니다.
                     </p>
                  </div>
               </div>
            </div>
          )}

          {/* Sub-tab 3: Topical Authority (Timeline) */}
          {usageTab === 'authority' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="bg-slate-900 p-10 rounded-[48px] text-white space-y-6">
                <h5 className="text-xl font-black italic tracking-tighter">📅 Series Scheduling & Context Anchor (S-01)</h5>
                <p className="text-xs text-slate-400 leading-relaxed font-bold">
                  구글 검색 로봇이 내 사이트에 오래 체류하고 페이지 전체를 인덱싱하게 만들려면, 단발성 글이 아닌 **상호 유기적인 시리즈형 글쓰기(S-01)**가 필수적입니다.
                  마자는 N번째 글을 작성할 때 이전 성공 포스트의 핵심 요약을 자동으로 전달하는 **맥락적 연결(S-02)**과Placeholder URL을 상호 주입하는 **내부 링크 앵커링(S-04)**을 완벽 지원합니다.
                </p>
              </div>

              {/* Roadmap timeline */}
              <div className="relative border-l-2 border-indigo-100 ml-8 pl-8 space-y-8 max-w-4xl mx-auto">
                {[
                  { day: "Day 01 - 03", title: "티스토리 북클럽 스킨 적용 및 구글 Step 0 통로 개설", desc: "마자의 원클릭 DNS 연동을 마치고 필수 스킨 세팅을 마칩니다." },
                  { day: "Day 04 - 10", title: "고수익 키워드 셔플 & 3시간 간격 W-05 예약 배차", desc: "안전하게 3시간 주기로 20개 내외의 정보성 글을 예약 적재합니다." },
                  { day: "Day 11 - 15", title: "경험 사진 스냅블로그(Vision Mode) 3건 결합", desc: "직접 찍은 투박한 모바일 사진을 P-01 세탁하여 포스팅 독창성 가점을 퀀텀 점프 시킵니다." },
                  { day: "Day 16 - 20", title: "애드센스 정식 신청 & 서브도메인 무한 복제 세팅", desc: "도메인 한 개가 승인 완료되는 즉시 추가 심사 없이 트래픽 대박 제국을 넓힙니다." }
                ].map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-[9px] shadow-md border-4 border-white">{idx+1}</div>
                    <div className="space-y-1">
                      <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">{step.day}</div>
                      <h6 className="text-sm font-black text-slate-900">{step.title}</h6>
                      <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


            {/* Visual Tool Walkthrough */}
            <div className="mt-12 bg-white/5 border border-white/10 rounded-[48px] p-10 space-y-8 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 border border-indigo-500/30 mb-3">
                     📸 Visual Tool Guide
                  </div>
                  <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight">
                    마자 프로그램 실무 시각 가이드
                  </h4>
                  <p className="text-slate-400 text-xs font-bold leading-relaxed mt-1">
                    AI Writer 및 Vision Writer(스냅블로그)의 실제 작동 화면과 발행 완료 과정을 매뉴얼로 확인하세요.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => setCh3Slide(prev => prev > 0 ? prev - 1 : 3)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-all active:scale-95"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
                    {ch3Slide + 1} / 4
                  </span>
                  <button 
                    onClick={() => setCh3Slide(prev => prev < 3 ? prev + 1 : 0)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-all active:scale-95"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-center">
                {/* Screenshot Frame */}
                <div className="md:col-span-7 bg-slate-950/60 p-4 rounded-[40px] border border-white/5 shadow-2xl relative group">
                  <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="aspect-[16/10] overflow-hidden rounded-[28px] border border-white/5 relative bg-slate-900 flex items-center justify-center">
                    {ch3Slide === 0 && <img src="/screenshots/new_01.webp" alt="Winning Blueprint 목록" className="w-full h-full object-cover object-top animate-fade-in" />}
                    {ch3Slide === 1 && <img src="/screenshots/new_02.webp" alt="카테고리 믹싱 및 자동배차" className="w-full h-full object-cover object-top animate-fade-in" />}
                    {ch3Slide === 2 && <img src="/screenshots/new_03.webp" alt="스냅블로그 경험증명" className="w-full h-full object-cover object-top animate-fade-in" />}
                    {ch3Slide === 3 && <img src="/screenshots/new_04.webp" alt="E-E-A-T 검증 인장 본문 매핑" className="w-full h-full object-cover object-top animate-fade-in" />}
                  </div>
                </div>

                {/* Explanation text */}
                <div className="md:col-span-5 space-y-6">
                  {ch3Slide === 0 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Step 01</div>
                      <h5 className="text-xl font-black text-white italic tracking-tight">수익률 검증 20+ Winning Blueprint 제공</h5>
                      <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                        Niche Hunter 에이전트 레이어가 탑재되어 있습니다. 구글 애드센스 승인과 고수익을 원스톱으로 달성할 수 있는 검증된 정답지 전략들을 선택하기만 하면 됩니다.
                      </p>
                      <ul className="text-[10px] text-slate-400 font-bold space-y-2 border-t border-white/5 pt-4">
                        <li className="flex items-center gap-2">✔️ 고수익 키워드 금고(Keyword Vault) API-Free 설계</li>
                        <li className="flex items-center gap-2">✔️ 전략 카테고리에 맞는 최적의 주제 선정</li>
                      </ul>
                    </div>
                  )}
                  {ch3Slide === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Step 02</div>
                      <h5 className="text-xl font-black text-white italic tracking-tight">지능형 믹스앤매치 & W-05 안전 배차</h5>
                      <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                        동일 패턴 글이 반복적으로 발행되는 것을 방지하기 위해 믹스앤매치 알고리즘을 사용합니다. 생성 완료 후 3시간 단위 안전 간격을 자동으로 조율하여 스케줄러 대기열에 안전 배차합니다.
                      </p>
                      <ul className="text-[10px] text-slate-400 font-bold space-y-2 border-t border-white/5 pt-4">
                        <li className="flex items-center gap-2">✔️ W-05 Safety Protocol 3시간 간격 강제</li>
                        <li className="flex items-center gap-2">✔️ 순차적 맥락 체이닝(S-02)을 통한 서사 연결</li>
                      </ul>
                    </div>
                  )}
                  {ch3Slide === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Step 03</div>
                      <h5 className="text-xl font-black text-white italic tracking-tight">Vision 스냅블로그 경험증명 (E-01)</h5>
                      <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                        사용자가 직접 찍은 투박한 원본 사진(아이폰/안드로이드)을 업로드하는 화면입니다. 서버사이드에서 EXIF 메타데이터를 즉시 세탁(P-01)하고 WebPNative로 극강의 최적화 압축을 진행합니다.
                      </p>
                      <ul className="text-[10px] text-slate-400 font-bold space-y-2 border-t border-white/5 pt-4">
                        <li className="flex items-center gap-2">✔️ 기기 인증(iPhone 16 등)을 활용한 신뢰도 종결</li>
                        <li className="flex items-center gap-2">✔️ 개인 정보 및 위치 데이터는 완벽히 제거(Scrubbing)</li>
                      </ul>
                    </div>
                  )}
                  {ch3Slide === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Step 04</div>
                      <h5 className="text-xl font-black text-white italic tracking-tight">E-E-A-T 검증 인장 본문 매핑 및 발행</h5>
                      <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                        최종 생성물 하단에 정품 기기 인증서와 촬영 로그를 담은 **시각적 경험증명 인장(E-03)**이 자동으로 매핑됩니다. 구글 알고리즘이 '진짜 사람의 서사'로 간주하여 SEO 지수를 최고치로 산정합니다.
                      </p>
                      <ul className="text-[10px] text-slate-400 font-bold space-y-2 border-t border-white/5 pt-4">
                        <li className="flex items-center gap-2">✔️ 직접 촬영 사진 가점으로 높은 밸리데이션 획득</li>
                        <li className="flex items-center gap-2">✔️ AI 탐지 원천 우회하는 감정적 스토리텔링 본문 완성</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


      {/* ──────────────────────────────────────────────────────────── */}
      {/* CHAPTER 4: GA4 애널리틱스 연동 (analytics_sync) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === 'analytics_sync' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-5xl mx-auto">
          {/* Mission Step 0: Andrew Setup Walkthrough */}
          <div className="p-12 bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200 rounded-[64px] shadow-2xl relative overflow-hidden">
             <div className="absolute -right-12 -top-12 opacity-5 italic font-black text-9xl pointer-events-none uppercase text-amber-600">Step 0</div>
             <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-8">
                   <div className="inline-flex items-center gap-2 px-5 py-2 bg-amber-600 text-white rounded-full text-[11px] font-black tracking-[0.2em] uppercase shadow-lg">
                      <Eye size={16} fill="currentColor" /> First Mission: Activate Google Eyes
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 leading-[0.9]">
                         챌린지 에러를 방지하는<br />
                         <span className="text-amber-600">최초 1회 '통로 개설' 미션</span>
                      </h2>
                      <p className="text-slate-600 text-sm font-bold leading-relaxed">
                         구글 애드센스 챌린지 페이지에서 데이터 에러가 뜨나요? <br />
                         <span className="text-slate-900">딱 한 번만 아무 이름이나 적어서 통로를 열어주세요.</span> <br />
                         구글 시스템에 당신의 존재를 알리는 가장 중요한 첫걸음입니다.
                      </p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-white/60 rounded-3xl border border-amber-200/50 space-y-2">
                         <div className="text-xs font-black text-amber-600 uppercase tracking-widest">Tip 01</div>
                         <p className="text-xs font-bold text-slate-800">계정 이름에 'andrew'처럼 아무 이름이나 적으셔도 무방합니다. (1회 한정)</p>
                      </div>
                      <div className="p-5 bg-white/60 rounded-3xl border border-amber-200/50 space-y-2">
                         <div className="text-xs font-black text-amber-600 uppercase tracking-widest">Tip 02</div>
                         <p className="text-xs font-bold text-slate-800">이 과정을 마치면 챌린지 대시보드가 즉시 활성화됩니다.</p>
                      </div>
                   </div>
                   <div className="pt-4 flex items-center gap-6">
                      <a 
                        href="https://tagmanager.google.com/#/admin/accounts/create" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-amber-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3"
                      >
                         Launch Google Setup <ArrowRight size={14} />
                      </a>
                      <a 
                        href="https://mazastudio.kr/challenge"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-amber-700 uppercase tracking-widest border-b-2 border-amber-200 hover:border-amber-600 transition-all"
                      >
                         이미 완료했다면 챌린지로 이동
                      </a>
                   </div>
                </div>
                                 <div className="w-full lg:w-[420px] shrink-0 space-y-4">
                    <div className="relative group">
                       <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full" />
                       <div className="relative bg-slate-900 p-5 rounded-[40px] border-4 border-amber-200 shadow-2xl overflow-hidden text-white space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="text-[9px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded uppercase">
                               GTM Setup Manual
                             </span>
                             <div className="flex items-center gap-1.5">
                               <button 
                                 onClick={() => setCh4Slide(prev => prev > 0 ? prev - 1 : 4)}
                                 className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-all"
                               >
                                 <ArrowLeft size={12} />
                               </button>
                               <span className="text-[10px] font-black text-amber-400">
                                 {ch4Slide + 1} / 5
                               </span>
                               <button 
                                 onClick={() => setCh4Slide(prev => prev < 4 ? prev + 1 : 0)}
                                 className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-all"
                               >
                                 <ArrowRight size={12} />
                               </button>
                             </div>
                          </div>

                          {/* Image View */}
                          <div className="aspect-[4/3] bg-slate-950 rounded-[24px] overflow-hidden border border-white/5 relative flex items-center justify-center">
                             {ch4Slide === 0 && <img src="/screenshots/step_01_challenge.webp" alt="GTM 챌린지 시작" className="w-full h-full object-cover object-top animate-fade-in" />}
                             {ch4Slide === 1 && <img src="/screenshots/step_01_dashboard.webp" alt="태그관리자 관리창" className="w-full h-full object-cover object-top animate-fade-in" />}
                             {ch4Slide === 2 && <img src="/screenshots/step_02_extract.webp" alt="계정명 andrew 입력" className="w-full h-full object-cover object-top animate-fade-in" />}
                             {ch4Slide === 3 && <img src="/screenshots/step_07_ok.webp" alt="GA4 READY 활성화" className="w-full h-full object-cover object-top animate-fade-in" />}
                             {ch4Slide === 4 && <img src="/screenshots/step_08_close.webp" alt="연동창 닫기 완료" className="w-full h-full object-cover object-top animate-fade-in" />}
                          </div>

                          {/* Mini Instruction */}
                          <div className="space-y-1.5 p-1 border-t border-white/5 pt-3">
                             {ch4Slide === 0 && (
                               <div className="animate-in fade-in duration-300">
                                 <strong className="text-xs font-black text-amber-300 block">Step 1. 구글 연동 채널 확인</strong>
                                 <p className="text-[10px] text-slate-400 leading-relaxed font-bold">마자스튜디오 대시보드에서 챌린지 및 GA4 통로 개설을 선언하고 구글 로그인 팝업을 띄우는 상태입니다.</p>
                               </div>
                             )}
                             {ch4Slide === 1 && (
                               <div className="animate-in fade-in duration-300">
                                 <strong className="text-xs font-black text-amber-300 block">Step 2. 태그관리자 관리창 진입</strong>
                                 <p className="text-[10px] text-slate-400 leading-relaxed font-bold">새 탭에 활성화된 구글 태그관리자 화면에서 [계정 만들기] 버튼을 클릭해 신규 연동 통로를 준비합니다.</p>
                               </div>
                             )}
                             {ch4Slide === 2 && (
                               <div className="animate-in fade-in duration-300">
                                 <strong className="text-xs font-black text-amber-300 block">Step 3. 계정명에 'andrew' 입력 ⭐️</strong>
                                 <p className="text-[10px] text-slate-400 leading-relaxed font-bold">가장 중요한 핵심! 계정 이름에 아무 텍스트나 입력하셔도 되지만, **'andrew'**를 입력해 안전하게 구글 GA4 채널을 뚫어줍니다.</p>
                               </div>
                             )}
                             {ch4Slide === 3 && (
                               <div className="animate-in fade-in duration-300">
                                 <strong className="text-xs font-black text-amber-300 block">Step 4. 구글 GA4 API READY 확인</strong>
                                 <p className="text-[10px] text-slate-400 leading-relaxed font-bold">계정 개설 성공 후, 마자 대시보드로 돌아와 [동기화]를 누르면 즉시 초록색 **READY**로 승격되며 연동이 완료됩니다.</p>
                               </div>
                             )}
                             {ch4Slide === 4 && (
                               <div className="animate-in fade-in duration-300">
                                 <strong className="text-xs font-black text-amber-300 block">Step 5. 팝업 닫기 및 동기화 무결성 완료</strong>
                                 <p className="text-[10px] text-slate-400 leading-relaxed font-bold">남아있는 Google Setup 임시 연동창을 가볍게 닫아주시면 최종 오토파일럿 대시보드 분석이 완성됩니다.</p>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
             </div>
          </div>

          {/* Identity Decoupling Principle */}
          <div className="bg-slate-900 text-white p-10 rounded-[48px] space-y-6">
            <h3 className="text-2xl font-black italic tracking-tighter">🔒 Identity & Infrastructure Decoupling (가입 계정 독립화)</h3>
            <p className="text-xs text-slate-400 font-bold leading-relaxed">
               수익형 블로그 제국을 건설할 때 가장 중요한 보안 수칙은 **"가입 계정과 실제 수익 창출 인프라 계정을 철저히 분리"**하는 것입니다. 
               카카오, 네이버 등으로 Maza 가입을 마친 유저들도, 실제 구글 애드센스 및 Search Console, GA4 연동 단계에서는 플랫폼 가입 메일과 무관한 **'수익 전용 구글 계정'**을 연결할 수 있습니다. 
               이는 갑작스러운 계정 규제 시 가입 정보를 분리 보호할 수 있는 최고의 아키텍처입니다.
            </p>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* CHAPTER 5: AdSense 챌린지 & Autopilot (adsense_challenge) */}
      {activeTab === 'adsense_challenge' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-sky-900 to-indigo-950 rounded-[64px] border border-sky-500/10 shadow-2xl p-12 text-white overflow-hidden relative">
            <div className="absolute -right-24 -top-24 h-72 w-72 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-sky-200 border border-white/10">
                  <Trophy size={16} className="text-sky-200" /> AdSense 챌린지 워크플로우
                </div>
                <h2 className="text-4xl font-black tracking-tighter leading-tight">
                  플랫폼부터 승인까지<br />
                  <span className="text-sky-300">실전 챌린지 순서로 설계</span>
                </h2>
                <p className="text-slate-300 text-sm font-bold leading-relaxed">
                  마자 스튜디오의 AdSense 챌린지는 단순 자동화가 아니라, 플랫폼별 초기 설정과 구글 인프라, 필수 페이지, 발행, 승인 확인까지 이어지는 전용 프로세스입니다.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  <div className="bg-white/10 border border-white/10 rounded-3xl p-5">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-200 mb-2">STEP 1</div>
                    <p className="text-[11px] text-slate-200 font-bold leading-relaxed">플랫폼 설정을 완료하고 티스토리/워드프레스/블로거별 연결 정보를 등록합니다.</p>
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-3xl p-5">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-200 mb-2">STEP 2</div>
                    <p className="text-[11px] text-slate-200 font-bold leading-relaxed">AdSense, GA4, Search Console을 한 번에 묶는 구글 인프라 연동을 실행합니다.</p>
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-3xl p-5">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-200 mb-2">STEP 3</div>
                    <p className="text-[11px] text-slate-200 font-bold leading-relaxed">개인정보처리방침·이용약관·광고정책 페이지를 연결해 승인 요건을 맞춥니다.</p>
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-3xl p-5">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-200 mb-2">STEP 4</div>
                    <p className="text-[11px] text-slate-200 font-bold leading-relaxed">콘텐츠 작성과 발행을 준비하고, 자동/수동 발행 체크리스트를 통과합니다.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                <img src="/screenshots/step_01_challenge.webp" alt="AdSense 챌린지 시작" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100">
              실전 사용법
            </div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900">AdSense 챌린지 사용 방법</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              익스텐션 설치와 티스토리 세팅을 마친 뒤, 마자 스튜디오 챌린지에서 AdSense 승인까지 이어지는 실제 흐름입니다.
              아래 단계를 따라가면 준비, 연결, 발행, 승인 신청을 한 번에 정리할 수 있습니다.
            </p>
            <ol className="space-y-3 text-[12px] text-slate-600 font-medium leading-relaxed list-decimal list-inside pl-5">
              <li><strong>챌린지 페이지 열기</strong> - 마자스튜디오 대시보드 또는 <span className="font-bold text-slate-900">/challenge</span>로 이동하여 AdSense 챌린지를 시작합니다.</li>
              <li><strong>플랫폼과 블로그 정보 등록</strong> - 티스토리, 워드프레스, 블로그스팟 중 운영 중인 플랫폼을 선택하고 블로그 도메인, 사이트명, 관리자 이메일을 정확히 입력합니다.</li>
              <li><strong>구글 인프라 연결</strong> - AdSense 계정, GA4 측정 ID, Search Console 사이트 등록을 차례대로 수행합니다. Search Console 인증은 사이트 소유권 확인 후 바로 진행하세요.</li>
              <li><strong>필수 페이지 연결</strong> - 개인정보처리방침, 이용약관, 광고 정책 페이지를 생성하고 챌린지 설정에 연결합니다. Tistory 설정에서 RSS와 sitemap.xml 공개도 반드시 확인하세요.</li>
              <li><strong>콘텐츠 발행 준비</strong> - 챌린지에서 제시하는 니치 포스트 5개와 경험 포스트 5개를 작성하고, 발행 전 자동 검수 항목을 모두 통과합니다.</li>
              <li><strong>검색엔진 색인 요청</strong> - Sitemap/RSS를 Search Console에 제출하고 즉시 색인 요청을 보냅니다. 이 단계는 발행 후 트래픽과 승인 신뢰도를 높입니다.</li>
              <li><strong>AdSense 승인 신청</strong> - 챌린지에서 제공하는 메타 태그를 확인하고, AdSense 신청 단계로 이동하여 사이트 신청을 완료합니다.</li>
            </ol>
            <div className="bg-slate-950 text-slate-100 p-4 rounded-3xl border border-slate-800">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-2">체크포인트</p>
              <ul className="space-y-2 text-[12px] leading-relaxed">
                <li>✔︎ 익스텐션이 켜져 있고, `Maza Bridge`가 active 상태인지 확인합니다.</li>
                <li>✔︎ 티스토리 블로그는 RSS가 공개되고, robots.txt가 검색 로봇을 차단하지 않아야 합니다.</li>
                <li>✔︎ 구글 인프라 연동 전에는 반드시 사이트 연결 정보가 챌린지에 저장되어야 합니다.</li>
                <li>✔︎ 승인 신청 전에는 필수 페이지 4종과 색인 요청이 모두 완료되어야 합니다.</li>
              </ul>
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100">
                챌린지 5단계 요약
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">AdSense 챌린지 순서</h3>
              <ol className="space-y-3 text-[11px] text-slate-600 font-medium leading-relaxed list-decimal list-inside pl-3">
                <li><strong>플랫폼 설정</strong> - 플랫폼별 초기 연결 정보를 등록하고 기본 메타를 확인합니다.</li>
                <li><strong>구글 인프라 연결</strong> - AdSense, GA4, Search Console을 통합해 수익 채널을 구성합니다.</li>
                <li><strong>필수 페이지 연결</strong> - 개인정보처리방침, 이용약관, 광고정책, 쿠키 정책을 연결합니다.</li>
                <li><strong>글 작성 및 발행</strong> - 콘텐츠 품질을 점검하고, 발행 전 자동 검수를 진행합니다.</li>
                <li><strong>연결 확인 & 승인 신청</strong> - 링크 상태와 색인, 트래픽을 확인한 뒤 승인 신청합니다.</li>
              </ol>
            </div>
            <div className="bg-slate-950 text-white p-8 rounded-[40px] border border-slate-800 shadow-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                챌린지 안전 장치
              </div>
              <h3 className="text-2xl font-black tracking-tight">승인 리스크 최소화</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                마자 챌린지는 실전 발행과 승인을 모두 고려합니다. 플랫폼별 연결, 필수 페이지, 발행 타이밍을 하나의 흐름으로 묶어 AdSense 승인 실패 가능성을 낮춥니다.
              </p>
              <div className="grid gap-3">
                <div className="rounded-3xl bg-emerald-950/70 border border-emerald-500/20 p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 font-black">인프라 검사</p>
                  <p className="text-sm font-bold text-white">구글 연동 상태와 태그 설치 여부를 한 번에 점검</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 border border-slate-700 p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black">정책 점검</p>
                  <p className="text-sm font-bold text-white">수익화 필수 페이지 연결 및 광고 가이드 준수를 확인</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 border border-slate-700 p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black">승인 준비</p>
                  <p className="text-sm font-bold text-white">발행 전 최종 승인 체크리스트로 실수를 방지</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-2xl font-black tracking-tight text-slate-900">실전 챌린지 이미지 매뉴얼</h4>
              <p className="text-sm text-slate-500 font-medium">아래 이미지로 챌린지 실행 흐름을 빠르게 이해하세요.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[32px] overflow-hidden border border-slate-200 shadow-lg">
                <img src="/screenshots/step_01_dashboard.webp" alt="챌린지 대시보드" className="w-full h-48 object-cover" />
                <div className="p-4 bg-white">
                  <div className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">대시보드</div>
                  <p className="text-sm font-bold text-slate-900">플랫폼 연결과 챌린지 상태를 한눈에 확인.</p>
                </div>
              </div>
              <div className="rounded-[32px] overflow-hidden border border-slate-200 shadow-lg">
                <img src="/screenshots/step_02_extract.webp" alt="챌린지 설정 입력" className="w-full h-48 object-cover" />
                <div className="p-4 bg-white">
                  <div className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">연동</div>
                  <p className="text-sm font-bold text-slate-900">구글 인프라와 챌린지 세부 설정을 확인합니다.</p>
                </div>
              </div>
              <div className="rounded-[32px] overflow-hidden border border-slate-200 shadow-lg">
                <img src="/screenshots/step_07_ok.webp" alt="GA4 연동 완료" className="w-full h-48 object-cover" />
                <div className="p-4 bg-white">
                  <div className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">승인 준비</div>
                  <p className="text-sm font-bold text-slate-900">최종 연결 확인 후 승인 신청을 준비합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* CHAPTER 5: 제로 IT 혁신 & ROI (zero_it_value) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === 'zero_it_value' && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
          {/* Legacy Pain vs Maza One-Click visual contrast layout */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
               AdSense Setup Revolution
            </div>
            <h3 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-tight">
               수백 가지 수동 세팅의 고통 <br />
               <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8 text-5xl">터치 한 번으로 원스톱 해결</span>
            </h3>
            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">ZERO IT, ZERO WORK, ZERO JUMP MANIFESTO</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
             {/* Left side: Legacy pain */}
             <div className="bg-slate-950 text-white rounded-[48px] p-8 space-y-6 border border-white/5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-400 rounded-full text-[9px] font-black uppercase border border-rose-500/20">
                     The Painful Legacy Way
                  </div>
                  <h4 className="text-2xl font-black text-rose-400 tracking-tighter italic">복잡하고 머리아픈 수동 노가다</h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                     구글 애널리틱스(GA4) 웹 스트림 생성 후 비동기 추적 스크립트 발급 &rarr; 티스토리 스킨 편집창 HTML 소스코드를 헤집으며 헤드 태그 아래에 삽입 &rarr; 서치콘솔 소유권 메타 태그 인증 &rarr; 사이트맵 및 RSS 수동 URL 수집 요청 &rarr; 블로그 세팅 에러 발생 시 밤샘 대치...
                  </p>
                </div>
                
                {/* Beautiful generated image from public directory */}
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative aspect-square">
                   <img 
                      src="/images/traditional_messy_desktop.webp" 
                      alt="Traditional Messy Desktop Setup Pain" 
                      className="object-cover w-full h-full"
                   />
                   <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 p-3 rounded-xl backdrop-blur-sm border border-white/10 text-center">
                      <p className="text-[10px] font-black text-rose-400 tracking-wide">Stressed Traditional Blogger (HTML/DNS Hell)</p>
                   </div>
                </div>
             </div>

             {/* Right side: Maza Autopilot */}
             <div className="bg-white text-slate-900 rounded-[48px] p-8 space-y-6 border border-slate-100 shadow-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase border border-emerald-100">
                     The Smart Maza Way
                  </div>
                  <h4 className="text-2xl font-black text-indigo-600 tracking-tighter italic">마자 터치식 원클릭 오토파일럿</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                     도메인 구입 후 연결 터치 시 가비아/호스팅케이알 DNS 레코드 자동 주입 및 매칭 &rarr; 구글 로그인 원탭으로 GA4 추적코드 및 서치콘솔 소유권 자동 획득 및 서버 주입 &rarr; 가입 직후 모바일 또는 태블릿 기기에 걸터앉아 미소 지으며 자율 주행 시작!
                  </p>
                </div>

                {/* Beautiful generated image from public directory */}
                <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-2xl relative aspect-square">
                   <img 
                      src="/images/maza_smart_mobile.webp" 
                      alt="Maza Smart Mobile Setup Ease" 
                      className="object-cover w-full h-full"
                   />
                   <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-3 rounded-xl backdrop-blur-sm border border-slate-100 text-center">
                      <p className="text-[10px] font-black text-emerald-600 tracking-wide">Relaxed Maza User (One-Click Mobile Autopilot)</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Efficiency Bar Chart */}
          <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-xl max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h4 className="text-2xl font-black italic tracking-tighter">시간 소요 및 생산성 극대화 비교 (ROI)</h4>
              <p className="text-[10px] text-slate-400 font-bold">마자 오토파일럿 활용 시 시간 절감 수치 데이터 시뮬레이션</p>
            </div>
            
            <div className="space-y-6">
              {EFFICIENCY_METRICS.map((metric, i) => {
                const Icon = metric.icon;
                const percentSaved = Math.round(((metric.manual - metric.maza) / metric.manual) * 100);
                return (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-lg", metric.bg, metric.color)}>
                          <Icon size={14} />
                        </div>
                        <span className="font-black text-slate-800">{metric.category}</span>
                      </div>
                      <span className="font-black text-indigo-600">시간 {percentSaved}% 세이브 ({metric.manual}시간 &rarr; {metric.maza}시간)</span>
                    </div>
                    <div className="h-6 w-full bg-slate-50 rounded-full overflow-hidden flex border border-slate-100">
                      <div 
                        className="bg-rose-500 h-full flex items-center px-4 justify-end text-[9px] font-black text-white italic" 
                        style={{ width: `${(metric.manual / 48) * 100}%` }}
                      >
                         수동: {metric.manual}{metric.unit}
                      </div>
                      <div 
                        className="bg-indigo-600 h-full flex items-center px-4 text-[9px] font-black text-white italic transition-all"
                        style={{ width: `${Math.max(4, (metric.maza / 48) * 100)}%` }}
                      >
                         마자: {metric.maza}{metric.unit}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* CHAPTER 6: 실무 FAQ 마스터 (faq_page) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeTab === 'faq_page' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
          {/* FAQ Hero */}
          <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
             <div className="absolute top-0 right-0 p-12 opacity-5 italic font-black text-8xl pointer-events-none uppercase">FAQ</div>
             <div className="relative z-10 space-y-6 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/20">
                   Maza Studio Support & Knowledge Base
                </div>
                <h3 className="text-5xl font-black italic tracking-tighter leading-tight">
                   실무 FAQ 마스터,<br />
                   <span className="text-indigo-400">진짜 수익자들의 대화.</span>
                </h3>
                <p className="text-slate-400 font-medium text-base leading-relaxed">
                   수익형 블로그 운영의 실제 현장에서 발생하는 핵심 궁금증을 명쾌하게 해결해 드립니다. 카테고리 필터와 검색을 활용하세요.
                </p>
             </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl">
             <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                   type="text"
                   placeholder="질문이나 키워드를 검색해 보세요..."
                   value={faqSearch}
                   onChange={(e) => setFaqSearch(e.target.value)}
                   className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
                />
                {faqSearch && (
                   <button 
                      onClick={() => setFaqSearch('')} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                   >
                      <X size={16} />
                   </button>
                )}
             </div>

             <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {[
                  { id: 'all', label: '전체', icon: LayoutGrid },
                  { id: 'infra', label: '인프라 & 계정', icon: Server },
                  { id: 'approval', label: '애드센스 & 승인', icon: Trophy },
                  { id: 'autopilot', label: '자동화 & 수익성', icon: Zap }
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isActive = faqCategory === cat.id;
                  return (
                     <button
                        key={cat.id}
                        onClick={() => {
                          setFaqCategory(cat.id);
                          setExpandedFaq(null);
                        }}
                        className={cn(
                          "px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all border",
                          isActive 
                            ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                            : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                        )}
                     >
                        <Icon size={12} />
                        {cat.label}
                     </button>
                  );
                })}
             </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
             {(() => {
                const items = [
                  {
                    id: 1,
                    category: 'infra',
                    q: "다계정 운영 시 제 계정이 정지당하지 않을까요?",
                    a: "가장 흔한 오해 중 하나입니다. 마자 스튜디오는 1인 1구글 계정 원칙을 철저히 준수합니다. 마자의 Identity Hub 기술은 하나의 마자 계정에 사용자가 소유한 여러 개의 독립된 수익 창출용 구글 부계정(AdSense, GA4, Search Console 등)을 안전하게 연결하여 관리하도록 지원합니다. 이는 구글의 시스템을 우회하는 것이 아니라 정당한 다중 소유자 권한 위임을 활용하는 것이므로 완벽하게 안전하며 정책 위반 가능성이 전혀 없습니다.",
                    tip: "구글 애드센스 계정은 1인당 1개만 허용되므로, 여러 개의 블로그를 운영할 때는 하나의 메인 애드센스 계정에 서브 도메인을 추가하는 것이 안전합니다.",
                    tag: "계정 안전"
                  },
                  {
                    id: 2,
                    category: 'infra',
                    q: "티스토리 API Key 없이 어떻게 자동으로 글이 발행되나요?",
                    a: "티스토리는 2024년부터 외부 API 발급을 차단/폐지했습니다. 따라서 마자 스튜디오는 전통적인 API 키 연동 방식 대신 Maza Bridge Chrome Extension을 통한 브라우저 세션 기반 주입 방식을 채택했습니다. 서버는 백그라운드 대기열(ms_scheduled_posts)에 글을 적재하고, 익스텐션이 이를 감지하여 사용자 브라우저에서 티스토리 에디터에 안전하게 본문을 자동 주입합니다. 이는 티스토리의 정상적인 브라우저 세션을 그대로 사용하므로 차단 위험 없이 가장 안정적으로 작동합니다.",
                    tip: "자동 주입 중에는 해당 브라우저 탭을 끄지 않는 것이 좋습니다. 배차 간격(3시간)에 맞춰 익스텐션이 조용히 탭을 열고 주입을 마무리합니다.",
                    tag: "익스텐션"
                  },
                  {
                    id: 3,
                    category: 'approval',
                    q: "서브도메인은 왜 수익화의 치트키라고 불리나요?",
                    a: "서브도메인을 활용하면 승인 대기 시간 45일을 완전히 생략할 수 있기 때문입니다. 루트 도메인(예: yoursite.com) 하나가 구글 애드센스 승인을 통과하면, 그 하위의 서브도메인(예: tech.yoursite.com, health.yoursite.com)들은 추가적인 구글 심사 없이 즉시 광고를 게재할 수 있습니다. 마자 스튜디오의 멀티 사이트 아키텍처를 결합하면 하나의 루트 도메인으로 수십 개의 테마 블로그를 무제한으로 복제하여 광고 수익을 퀀텀 점프시킬 수 있습니다.",
                    tip: "메인 도메인은 가장 통과하기 쉬운 IT/SaaS나 일반 정보성 주제로 빠르게 승인받은 후, 서브도메인을 금융/보험 등 고수익 카테고리로 확장하는 것이 최고의 전략입니다.",
                    tag: "수익성 극대화"
                  },
                  {
                    id: 4,
                    category: 'approval',
                    q: "구글 봇이 제 블로그를 스팸이나 자동화 글쟁이로 보지 않을까요?",
                    a: "마자 스튜디오는 단순 도배성 글이 아닌, 주제 권위(Topical Authority)를 세우는 시리즈형 집필 엔진과 Experience-First Protocol(E-01)을 사용합니다. 사용자의 실제 모바일 사진에서 메타데이터를 세탁(P-01)하여 WebP로 변환 후 본문에 배치하고, AI Vision 에이전트가 이를 장소, 감정, 서사와 결합해 1인칭 글로 작성합니다. 또한 각 사이트별로 자동으로 생성되는 전문 법적 문서(개인정보처리방침 등)와 마자만의 LEGAL 리포트(Trust Shield)가 정당한 독립 매체임을 입증하므로 구글 스팸 필터를 압도적으로 우회합니다.",
                    tip: "포스팅 시 스냅블로그 기능을 통해 본인이 촬영한 투박한 사진이라도 1~2장 첨부하면, 구글 E-E-A-T 검증에서 가점을 받아 노출 확률이 급증합니다.",
                    tag: "구글 SEO"
                  },
                  {
                    id: 5,
                    category: 'autopilot',
                    q: "W-05 Safety Protocol(3시간 간격)을 꼭 지켜야 하나요?",
                    a: "네, 반드시 지켜야 하는 계정 보호 규약입니다. 검색 엔진과 블로그 플랫폼(티스토리, 워드프레스 등)은 비정상적으로 짧은 시간에 대량의 글이 발행되면 스팸 어뷰징 계정으로 감지해 영구 정지 처리를 내립니다. 마자 스튜디오는 인간의 탐욕이나 실수로 인한 리스크를 원천 차단하기 위해 동일 블로그에 대한 자동 발행은 최소 3시간(10,800초)의 간격을 시스템적으로 강제합니다. 만약 쿨타임 중에 발행 요청이 오면 에러를 내는 대신 다음 발행 가능 시간으로 배차 일정을 자동 이월합니다.",
                    tip: "느리게 꾸준히 발행되는 블로그가 검색 엔진의 높은 지수(C-Rank)를 얻어 장기적으로 수십 배의 트래픽과 수익을 가져옵니다.",
                    tag: "W-05 안전"
                  },
                  {
                    id: 6,
                    category: 'autopilot',
                    q: "수익 극대화를 위해 내부 링크 앵커링(S-04)이 중요한 이유는 무엇인가요?",
                    a: "검색 엔진의 크롤러 봇이 내 사이트에 한 번 들어왔을 때, 모든 페이지를 구석구석 돌아다니며 색인(Index)을 생성하도록 돕기 때문입니다. 마자의 Series Scheduling & Context Anchor Protocol(S-01)은 시리즈 내의 포스트들이 서로를 가리키는 앵커 텍스트와 링크를 자동으로 상호 주입합니다. 또한 사용자 경험 측면에서도 독자가 한 글을 읽고 자연스럽게 '시리즈 다음 글'로 넘어가게 만들어 페이지뷰(PV)와 체류 시간을 3배 이상 증가시킵니다.",
                    tip: "이러한 상호 연결 구조는 구글 알고리즘에서 특정 테마에 대한 '주제 전문성(Topic Authority)' 점수를 크게 높여 개별 키워드 상위 노출에 결정적 기여를 합니다.",
                    tag: "시리즈 전략"
                  }
                ];

                const filtered = items.filter(item => {
                  const matchSearch = item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase()) || item.tag.toLowerCase().includes(faqSearch.toLowerCase());
                  const matchCategory = faqCategory === 'all' || item.category === faqCategory;
                  return matchSearch && matchCategory;
                });

                if (filtered.length === 0) {
                  return (
                     <div className="text-center py-16 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-3">
                        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                           <HelpCircle size={24} />
                        </div>
                        <div className="text-sm font-black text-slate-800">검색 결과가 없습니다.</div>
                        <p className="text-[11px] text-slate-400 font-medium">다른 키워드나 필터로 다시 검색해 보세요.</p>
                     </div>
                  );
                }

                return filtered.map((item) => {
                  const isExpanded = expandedFaq === item.id;
                  return (
                     <div 
                        key={item.id} 
                        className={cn(
                          "bg-white rounded-[32px] border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md",
                          isExpanded ? "border-indigo-600 ring-2 ring-indigo-50/50" : "border-slate-100"
                        )}
                     >
                        <button
                           onClick={() => setExpandedFaq(isExpanded ? null : item.id)}
                           className="w-full px-8 py-6 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-all"
                        >
                           <div className="flex items-center gap-4">
                              <span className={cn(
                                "px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-full shrink-0",
                                item.category === 'infra' && "bg-indigo-50 text-indigo-600",
                                item.category === 'approval' && "bg-emerald-50 text-emerald-600",
                                item.category === 'autopilot' && "bg-amber-50 text-amber-600"
                              )}>
                                 {item.tag}
                              </span>
                              <h4 className="text-[13px] font-black text-slate-800 tracking-tight leading-snug">
                                 {item.q}
                              </h4>
                           </div>
                           <div className={cn(
                             "w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 transition-transform duration-300",
                             isExpanded && "bg-indigo-50 text-indigo-600 rotate-180"
                           )}>
                              <ArrowDown size={14} />
                           </div>
                        </button>

                        <AnimatePresence initial={false}>
                           {isExpanded && (
                              <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                 <div className="px-8 pb-8 pt-2 space-y-6 border-t border-slate-50 animate-in fade-in duration-300">
                                    <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                                       {item.a}
                                    </p>
                                    
                                    {item.tip && (
                                       <div className="p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl flex gap-3 items-start">
                                          <Sparkles size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                          <div className="space-y-1">
                                             <div className="text-[10px] font-black text-indigo-900 uppercase tracking-wider">Expert Pro-Tip</div>
                                             <p className="text-[10px] text-indigo-800/80 font-bold leading-relaxed">{item.tip}</p>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  );
                });
             })()}
          </div>


          {/* Chapter 6: Troubleshooting visual manual */}
          <div className="bg-slate-900 border border-slate-800 rounded-[48px] p-10 space-y-8 relative overflow-hidden shadow-2xl mt-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 border border-indigo-500/30 mb-3">
                   🔍 Visual Troubleshooting
                </div>
                <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight">
                  익스텐션 실무 트러블슈팅 가이드
                </h4>
                <p className="text-slate-400 text-xs font-bold leading-relaxed mt-1">
                  사이드바 작동 이상 또는 배차 색인 지연 발생 시, 화면 상태를 비교하여 즉시 원인을 해결하세요.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => setCh6Slide(prev => prev > 0 ? prev - 1 : 2)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-all active:scale-95"
                >
                  <ArrowLeft size={16} />
                </button>
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
                  {ch6Slide + 1} / 3
                </span>
                <button 
                  onClick={() => setCh6Slide(prev => prev < 2 ? prev + 1 : 0)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-all active:scale-95"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-8 items-center">
              {/* Screenshot Frame */}
              <div className="md:col-span-7 bg-slate-950 p-4 rounded-[40px] border border-white/5 shadow-2xl relative group">
                <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="aspect-[16/10] overflow-hidden rounded-[28px] border border-white/5 relative bg-slate-900 flex items-center justify-center">
                  {ch6Slide === 0 && <img src="/screenshots/step_09.webp" alt="Force Polling 버튼 작동 예시" className="w-full h-full object-cover object-top animate-fade-in" />}
                  {ch6Slide === 1 && <img src="/screenshots/step_10.webp" alt="티스토리 에디터 자동 감지 상태" className="w-full h-full object-cover object-top animate-fade-in" />}
                  {ch6Slide === 2 && <img src="/screenshots/step_10.webp" alt="발행완료 대기열 100% 완료 상태" className="w-full h-full object-cover object-top animate-fade-in" />}
                </div>
              </div>

              {/* Explanation text */}
              <div className="md:col-span-5 space-y-6">
                {ch6Slide === 0 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Trouble 01</div>
                    <h5 className="text-xl font-black text-white italic tracking-tight">Q. 사이드바 동작 대기 또는 먹통일 때</h5>
                    <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                      익스텐션 사이드바 하단의 **[Force Polling (강제 스캔)]** 버튼을 눌러보세요. 백그라운드 워커에 슬립이 걸렸을 때 즉시 세션을 흔들어 깨웁니다.
                    </p>
                    <ul className="text-[10px] text-slate-400 font-bold space-y-2 border-t border-white/5 pt-4">
                      <li className="flex items-center gap-2">✔️ 즉각적인 타겟 도메인 세션 매칭 시도</li>
                      <li className="flex items-center gap-2">✔️ 무한 로딩 상태를 1초 만에 초기화 탈출</li>
                    </ul>
                  </div>
                )}
                {ch6Slide === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Trouble 02</div>
                    <h5 className="text-xl font-black text-white italic tracking-tight">Q. 티스토리 글쓰기 창 매치 판별</h5>
                    <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                      티스토리 에디터 창에 정상 진입하면 익스텐션 상태가 초록색 **[Matched]**로 변환됩니다. 만약 회색 대기 상태라면 에디터 iframe이 로딩 중이거나 탭 활성화가 안 된 경우입니다.
                    </p>
                    <ul className="text-[10px] text-slate-400 font-bold space-y-2 border-t border-white/5 pt-4">
                      <li className="flex items-center gap-2">✔️ 브라우저 탭을 새로고침하고 1~2초 대기</li>
                      <li className="flex items-center gap-2">✔️ 자동 인젝션 로직이 감지되는 즉시 주입 가동</li>
                    </ul>
                  </div>
                )}
                {ch6Slide === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Trouble 03</div>
                    <h5 className="text-xl font-black text-white italic tracking-tight">Q. 발행 완료 대기열 100% 완료 상태</h5>
                    <p className="text-slate-300 text-xs leading-relaxed font-semibold">
                      모든 스케줄링 예약 글이 정상적으로 발행 완료되어 **Completed** 100%를 달성한 상태의 사이드바입니다. 추가 배차 대기 중인 글이 없다면 쿨타임(W-05) 상태로 대기합니다.
                    </p>
                    <ul className="text-[10px] text-slate-400 font-bold space-y-2 border-t border-white/5 pt-4">
                      <li className="flex items-center gap-2">✔️ 대기열 적재 현황과 쿨타임 실시간 대시보드 출력</li>
                      <li className="flex items-center gap-2">✔️ 구글 색인(인덱스) 요청 대기열로 자동 연동</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Interactive CTA */}
          <div className="bg-slate-900 rounded-[56px] p-12 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
             <div className="relative z-10 space-y-6">
                <h4 className="text-2xl font-black italic text-white uppercase tracking-tighter">아직 해결되지 않은 궁금증이 있으신가요?</h4>
                <p className="text-indigo-200 text-sm font-medium max-w-2xl mx-auto">
                   마자 스튜디오 텔레그램 공식 채널 또는 1:1 VIP 전용 핫라인을 통해 최고의 수익 블로그 구루들에게 직접 질문하실 수 있습니다.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                   <button 
                      onClick={() => {
                        window.open('https://t.me/mazastudio', '_blank');
                        toast.success('공식 텔레그램으로 연결합니다!');
                      }}
                      className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl"
                   >
                      공식 텔레그램 채널 입장
                   </button>
                   <button 
                      onClick={() => {
                        toast.info('VIP 1:1 서포트 데스크는 마자 파이프라인 결제 완료 시 즉시 오픈됩니다.');
                      }}
                      className="px-8 py-4 bg-slate-800 border border-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all"
                   >
                      VIP 1:1 문의 데스크
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
