import { useState, useEffect } from "react";
import { 
  Search, BarChart3, Globe, CheckCircle2, 
  ArrowRight, X, Sparkles, ShieldCheck,
  Link2, Loader2, ChevronRight, Clock, Zap, Map
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

interface GoogleOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

// Step 0: Time comparison items
const TIME_ITEMS = [
  { label: "서치콘솔 소유권 확인 & 등록", manual: "4.5시간", maza: "자동", icon: Search, color: "#EA4335" },
  { label: "GA4 속성 생성 및 설치", manual: "2시간", maza: "자동", icon: BarChart3, color: "#34A853" },
  { label: "사이트맵 제출 & 색인 요청", manual: "1.5시간", maza: "자동", icon: Map, color: "#4285F4" },
];

export default function GoogleOnboardingModal({ isOpen, onClose, onComplete }: GoogleOnboardingModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    if (user && isOpen) {
      setVisibleItems(0);
    }
  }, [user, isOpen]);

  // Animate items one by one
  useEffect(() => {
    if (isOpen) {
      let count = 0;
      const timer = setInterval(() => {
        count++;
        setVisibleItems(count);
        if (count >= TIME_ITEMS.length) clearInterval(timer);
      }, 600);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleStart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      onComplete({ modal_seen: true });
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
        style={{ minHeight: 480 }}
      >
        {/* Close Button with Don't Show Again */}
        <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-3 h-3 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              onChange={(e) => {
                if (e.target.checked) {
                  localStorage.setItem('maza_hide_google_tour', 'true');
                } else {
                  localStorage.removeItem('maza_hide_google_tour');
                }
              }}
            />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">다시 보지 않기</span>
          </label>
          <button 
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-all"
            title="닫기"
          >
            <X size={16} />
          </button>
        </div>

        {/* Left Side: Branding & Progress */}
        <div className="w-full md:w-[240px] bg-slate-950 p-8 flex flex-col border-b md:border-b-0 md:border-r border-white/5">
          {/* Google dots */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Google Brand Kit</span>
          </div>

          <div className="space-y-4 flex-1">
            <h2 className="text-xl font-black italic tracking-tighter leading-tight text-white">
              구글 수익화<br />
              <span className="text-[#4285F4]">인프라 동기화</span>
            </h2>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
              수익화의 첫 걸음은 구글 시스템에 내 사이트를 각인시키는 것입니다.
            </p>
          </div>

          <div className="mt-8 space-y-3 opacity-60">
            <div className="flex items-center gap-3">
               <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black transition-all duration-300 bg-amber-500 text-white">✓</div>
               <span className="text-[10px] font-bold text-white">마자 오토파일럿 투어</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black transition-all duration-300 bg-white/5 text-slate-600">2</div>
               <span className="text-[10px] font-bold text-slate-600">본격적인 챌린지 시작</span>
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-8 md:p-10 bg-white flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div 
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex flex-col h-full justify-between"
              >
                <div>
                  <div className="space-y-1 mb-6">
                    <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">설정 시작 전 확인하세요</div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">
                      이 모든 설정 없이 수동으로 하면?<br />
                      <span className="text-slate-400 font-medium text-lg">최소 48시간이 소요됩니다</span>
                    </h3>
                  </div>

                  {/* Time comparison items */}
                  <div className="space-y-3">
                    {TIME_ITEMS.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: idx < visibleItems ? 1 : 0, x: idx < visibleItems ? 0 : 20 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.color + '15' }}>
                            <item.icon size={16} style={{ color: item.color }} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-black text-rose-500 line-through">{item.manual}</span>
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                            {item.maza} ✓
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Total savings */}
                  {visibleItems >= TIME_ITEMS.length && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 bg-indigo-600 rounded-2xl flex items-center justify-between mt-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <Zap size={20} className="text-white" />
                        </div>
                        <div>
                          <div className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">총 절약 시간</div>
                          <div className="text-white font-black text-lg">8시간 → 단 30초</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">이틀치 작업</div>
                        <div className="text-white font-black text-sm">48H SAVED</div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {visibleItems >= TIME_ITEMS.length && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 1 }}
                    className="pt-6"
                  >
                     <button
                        onClick={handleStart}
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-base hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                     >
                        {loading ? <Loader2 className="animate-spin" /> : "수익화 챌린지 1단계 진입하기 →"}
                     </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
