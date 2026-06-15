import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { 
  LogOut, ChevronDown, User
} from "lucide-react";
import { CORE_PILLARS } from "../constants/navigation";
export default function Layout() {
  const { user, signOut, isPro } = useAuth();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (path: string) => {
    const current = location.pathname + location.search;
    if (path === "/" && location.pathname !== "/") return false;
    return current === path || (!path.includes("?") && current.startsWith(path));
  };

  // Docs site: only show document-related pillars
  const mainPillarPaths = [
    '/knowledge?category=adsense_challenge',
    '/knowledge?category=extension',
    '/knowledge?category=tistory',
    '/knowledge?category=wordpress',
    '/knowledge?category=blogspot',
    '/knowledge?category=subdomain',
    '/knowledge?category=maza_bridge',
    '/guide',
    '/faq'
  ];

  const mainPillars = mainPillarPaths
    .map(path => CORE_PILLARS.find(p => p.path === path))
    .filter(Boolean) as any[];
    
  const otherPillars = CORE_PILLARS.filter(p => 
    !mainPillarPaths.includes(p.path)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" style={{ zoom: 0.85 }}>
      {/* Permanent Premium Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200/50 px-8 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <a href="https://mazastudio.kr" className="flex items-center gap-2 shrink-0 group">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md group-hover:shadow-indigo-200 group-hover:scale-110 transition-all duration-300">
                <img src="/logo.png" alt="MAZA" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter italic">Maza<span className="text-indigo-600">Studio</span></span>
            </a>

            {user && (
              <nav className="hidden lg:flex items-center gap-1 min-w-0">
                {mainPillars.map(pillar => (
                  <NavLink key={pillar.path} to={pillar.path} icon={<pillar.icon size={18}/>} label={pillar.label} active={isActive(pillar.path)} />
                ))}
                
                {/* Secondary Links Dropdown */}
                {otherPillars.length > 0 && (
                  <div className="relative">
                    <button 
                      onClick={() => setMoreOpen(!moreOpen)}
                      className={`px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-black transition-all ${
                        moreOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span>더보기</span>
                      <ChevronDown size={14} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {moreOpen && (
                      <>
                        <div className="fixed inset-0 z-50" onClick={() => setMoreOpen(false)} />
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                          {otherPillars.map(pillar => (
                            <Link 
                              key={pillar.path} 
                              to={pillar.path}
                              onClick={() => setMoreOpen(false)}
                              className={`flex items-center gap-3 px-4 py-3 text-xs font-black transition-colors ${
                                isActive(pillar.path) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive(pillar.path) ? 'bg-indigo-100' : 'bg-slate-50'}`}>
                                <pillar.icon size={16} />
                              </div>
                              <span>{pillar.label}</span>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block" />
                

                <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-slate-100 transition-colors relative group/account">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm overflow-hidden">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-slate-900 uppercase leading-none">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <span className={`text-[9px] font-black tracking-widest leading-none mt-1 ${isPro ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {isPro ? 'PRO MEMBER' : 'FREE ACCOUNT'}
                    </span>
                  </div>

                  {/* Account Dropdown */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover/account:opacity-100 group-hover/account:visible transition-all z-[70] py-2">
                    <a href="https://mazastudio.kr/mypage" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                      <User size={14} />
                      <span>마이 페이지</span>
                    </a>
                    <div className="h-[1px] bg-slate-50 my-1" />
                    <button 
                      onClick={() => signOut()} 
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      <span>로그아웃</span>
                    </button>
                  </div>
                </div>

                <div className="h-8 w-[1px] bg-slate-100 mx-1" />
                <button 
                  onClick={() => signOut()} 
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all sm:hidden"
                  title="로그아웃"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                시작하기
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-100 py-6 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-base font-black italic uppercase tracking-tighter">Maza<span className="text-indigo-600">Studio</span></span>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-none mt-1">
                구글 애드센스 승인 및 AI 콘텐츠 자동화 플랫폼
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Link to="/privacy" className="text-slate-900 hover:text-indigo-600 transition-colors underline decoration-indigo-600/20 underline-offset-4">개인정보처리방침</Link>
              <Link to="/terms" className="hover:text-indigo-600 transition-colors">이용약관</Link>
              <Link to="/installation-guide" className="hover:text-indigo-600 transition-colors">블로그 세팅 가이드</Link>
              <a href="https://mazastudio.kr" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">메인 앱 →</a>
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-slate-50" />

          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
             <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span>캔두코리아</span>
                <span className="text-slate-200">|</span>
                <span>대표: 조윤서</span>
                <span className="text-slate-200">|</span>
                <span>사업자번호: 885-32-01361</span>
             </div>
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
               © 2026 MAZA STUDIO. ALL RIGHTS RESERVED.
             </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

function NavLink({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) {
  const isExternal = to.startsWith('http');
  const className = `px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-black transition-all ${
    active 
    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105' 
    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
  }`;

  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={className}>
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  );
}
