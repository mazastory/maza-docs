import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Zap, ArrowRight, Globe, Cpu, 
  CalendarClock, MousePointer2, 
  Activity, ShieldCheck, Target,
  Monitor, Layout, DollarSign, Layers,
  TrendingUp, Infinity, BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function Landing() {
  const navigate = useNavigate();
  const [blogUrl, setBlogUrl] = useState("");
  const [isUrlEntered, setIsUrlEntered] = useState(false);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    // 수익 카운터 애니메이션 시뮬레이션
    const interval = setInterval(() => {
      setRevenue(prev => (prev < 12540 ? prev + 127 : prev));
    }, 50);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-[#050608] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* ── PREMIMUM AMBIENT LIGHTING ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-indigo-600/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      {/* ── STICKY NAV ── */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black italic text-xl shadow-lg shadow-indigo-500/20">M</div>
             <span className="font-black italic tracking-tighter text-2xl uppercase">Maza<span className="text-indigo-500">Studio</span></span>
          </div>
          <button onClick={() => navigate("/docs")} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Docs</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 relative z-10 pt-40 pb-40 space-y-60">
        
        {/* PHASE 1: THE HERO - VISUAL IMPACT */}
        <section className="text-center space-y-16 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-indigo-400 font-black text-[10px] tracking-[0.5em] uppercase"
          >
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
             Future of Autonomous Blogging
          </motion.div>

          <div className="space-y-8">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="text-8xl md:text-[13rem] font-black tracking-tighter italic uppercase leading-[0.75] text-white select-none"
            >
              STOP <br /><span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-indigo-700">STRUGGLING.</span>
            </motion.h1>
            
            <div className="relative inline-block">
               <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="text-2xl md:text-4xl font-black text-slate-500 tracking-tight uppercase italic"
               >
                 기약 없는 글쓰기? <span className="text-white underline decoration-indigo-500 decoration-8 underline-offset-8">이제 마자가 끝냅니다.</span>
               </motion.p>
            </div>
          </div>

          <div className="flex justify-center gap-8 pt-10">
             <button onClick={() => navigate("/docs")} className="px-20 py-10 bg-indigo-600 rounded-full font-black uppercase tracking-[0.3em] text-sm shadow-3xl shadow-indigo-600/40 hover:bg-indigo-500 transition-all group flex items-center gap-4">
               Get Started <ArrowRight className="group-hover:translate-x-2 transition-transform" />
             </button>
          </div>

          {/* DYNAMIC BACKGROUND ELEMENTS */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-20 blur-3xl pointer-events-none">
             <div className="w-[600px] h-[600px] bg-indigo-500 rounded-full" />
          </div>
        </section>

        {/* PHASE 2: VISUAL MANIFESTO - 글자 대신 카드 위주의 강력한 대비 */}
        <section className="grid md:grid-cols-3 gap-10">
           {[
             { title: "ZERO-IT", desc: "IT 몰라도 돼", icon: Cpu, color: "from-blue-500 to-indigo-600" },
             { title: "ZERO-WORK", desc: "기약 없는 글쓰기 해방", icon: CalendarClock, color: "from-emerald-500 to-teal-600" },
             { title: "ZERO-JUMP", desc: "압도적 수익 안착", icon: MousePointer2, color: "from-rose-500 to-purple-600" }
           ].map((item, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -20 }}
               className="p-16 bg-white/2 border border-white/5 rounded-[80px] space-y-10 relative overflow-hidden group hover:bg-white/5 transition-all"
             >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity", item.color)} />
                <div className={cn("w-24 h-24 rounded-[40px] flex items-center justify-center bg-gradient-to-br text-white shadow-2xl", item.color)}>
                   <item.icon size={40} />
                </div>
                <div className="space-y-4">
                   <h3 className="text-5xl font-black italic tracking-tighter uppercase">{item.title}</h3>
                   <p className="text-2xl font-bold text-slate-400 leading-tight">{item.desc}</p>
                </div>
                <div className="pt-10 flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                   <Activity size={14} /> Ready for Deployment
                </div>
             </motion.div>
           ))}
        </section>

        {/* PHASE 3: THE REVENUE MONSTER - 유저의 심장을 뛰게 하는 숫자 */}
        <section className="bg-slate-900 rounded-[100px] p-24 text-center space-y-12 border border-white/5 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
           <div className="space-y-4 relative z-10">
              <h2 className="text-2xl font-black italic text-indigo-400 uppercase tracking-widest">Estimated Daily Revenue</h2>
              <div className="text-8xl md:text-[12rem] font-black italic tracking-tighter leading-none tabular-nums text-white">
                ${revenue.toLocaleString()}
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-[0.5em]">당신이 잠든 사이에도 올라가는 숫자</p>
           </div>
           <div className="flex justify-center pt-10">
              <div className="px-10 py-5 bg-white/5 rounded-full border border-white/10 flex items-center gap-6">
                 <div className="flex items-center gap-2 text-emerald-400 font-black italic uppercase text-xs">
                    <TrendingUp size={16} /> +450% Growth
                 </div>
                 <div className="w-px h-4 bg-white/10" />
                 <div className="flex items-center gap-2 text-indigo-400 font-black italic uppercase text-xs">
                    <Zap size={16} /> Autopilot Active
                 </div>
              </div>
           </div>
        </section>

        {/* PHASE 4: THE INTERACTIVE ORBIT - 직접 만져보는 인프라 */}
        <section className="space-y-20">
           <div className="text-center space-y-4">
              <h2 className="text-6xl font-black italic tracking-tighter uppercase">One-Tap <span className="text-indigo-500">Google Sync</span></h2>
              <p className="text-xs text-slate-500 font-black uppercase tracking-[0.5em]">모두가 포기하는 그 지점을 넘겨드립니다</p>
           </div>

           <div className="p-2 bg-gradient-to-b from-white/10 to-transparent rounded-[100px]">
              <div className="bg-[#08090b] rounded-[98px] p-20 md:p-32 space-y-20 relative overflow-hidden">
                 <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-indigo-600/5 blur-[120px]" />
                 
                 <div className="flex flex-col md:flex-row items-center gap-20">
                    <div className="flex-1 space-y-8">
                       <h4 className="text-6xl font-black italic tracking-tighter leading-none">주소 하나면 <br /><span className="text-indigo-500">충분합니다.</span></h4>
                       <div className="space-y-4">
                          <input 
                            type="text" 
                            value={blogUrl} 
                            onChange={(e) => {
                              setBlogUrl(e.target.value);
                              setIsUrlEntered(e.target.value.length > 5);
                            }}
                            placeholder="your-blog.com"
                            className="w-full bg-white/5 border border-white/10 px-10 py-8 rounded-[40px] text-3xl font-black italic outline-none focus:border-indigo-500 transition-all text-white placeholder:text-slate-800"
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { icon: Target, label: "Console" },
                         { icon: BarChart3, label: "GA4" },
                         { icon: DollarSign, label: "AdSense" },
                         { icon: ShieldCheck, label: "Verify" }
                       ].map((box, i) => (
                         <div key={i} className="w-32 h-32 bg-white/2 border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all">
                            <box.icon className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-white transition-colors">{box.label}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <AnimatePresence>
                   {isUrlEntered && (
                     <motion.div 
                       initial={{ opacity: 0, y: 30 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10"
                     >
                       {[
                         "기초 세팅", "스킨 튜닝", "모바일 해제", "수익 도구", 
                         "카테고리", "사이드바", "댓글 관리", "방문 통계"
                       ].map((label, i) => (
                         <div key={i} className="p-10 bg-white/2 border border-white/5 rounded-[48px] text-center space-y-4 hover:bg-white/5 transition-all group">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                               <Layout size={20} />
                            </div>
                            <div className="text-xs font-black uppercase tracking-tighter text-slate-400 group-hover:text-white">{label}</div>
                         </div>
                       ))}
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
           </div>
        </section>

        {/* PHASE 5: THE EMPIRE - 압도적인 결과 */}
        <section className="grid md:grid-cols-2 gap-10">
           <div className="p-20 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[100px] space-y-10 relative overflow-hidden group shadow-3xl shadow-indigo-600/20">
              <CalendarClock size={400} className="absolute -right-20 -bottom-20 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
              <div className="w-24 h-24 bg-white/10 rounded-[40px] flex items-center justify-center backdrop-blur-xl">
                 <Infinity size={48} />
              </div>
              <h3 className="text-7xl font-black italic tracking-tighter leading-none">자동 예약 <br />업로드.</h3>
              <p className="text-indigo-100 text-xl font-medium leading-relaxed max-w-sm">당신이 잠든 사이에도 마자는 골든 타임에 맞춰 자율 발행합니다.</p>
           </div>
           
           <div className="p-20 bg-slate-900 rounded-[100px] space-y-10 border border-white/5 relative overflow-hidden group shadow-3xl">
              <Globe size={400} className="absolute -right-20 -bottom-20 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
              <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center backdrop-blur-xl border border-white/10">
                 <Layers size={48} className="text-emerald-400" />
              </div>
              <h3 className="text-7xl font-black italic tracking-tighter leading-none text-white">무한 서브 <br />도메인.</h3>
              <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-sm">단 20분 만에 당신의 제국을 확장하는 압도적 속도.</p>
           </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center space-y-20 py-40">
           <div className="space-y-10 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[160px] pointer-events-none" />
              <h2 className="text-8xl md:text-[14rem] font-black italic tracking-tighter leading-none text-white uppercase relative z-10">
                 BUILD THE <br /><span className="text-indigo-500">FUTURE.</span>
              </h2>
              <p className="text-2xl text-slate-400 font-bold uppercase tracking-[0.3em] italic relative z-10">당신만의 수익 제국을 건설하세요.</p>
           </div>
           <button onClick={() => navigate("/docs")} className="px-32 py-12 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-full font-black text-3xl uppercase tracking-[0.4em] transition-all shadow-3xl active:scale-95 relative z-10">
              Get Started ✨🚀
           </button>
        </section>

      </div>
    </div>
  );
}
