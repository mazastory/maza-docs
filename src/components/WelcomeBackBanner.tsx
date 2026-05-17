import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Zap, ChevronRight } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";

const MISSION_LABELS: Record<string, { label: string; path: string }> = {
  platform:  { label: "1단계 — 플랫폼 선택",     path: "/challenge" },
  strategy:  { label: "2단계 — 수익화 설계도",    path: "/challenge" },
  setup:     { label: "3단계 — 기초 공사",        path: "/challenge" },
  legal:     { label: "4단계 — 법적 문서 발행",   path: "/challenge" },
  content_1: { label: "5단계 — 콘텐츠 빌드업",   path: "/challenge" },
  seo:       { label: "6단계 — 검색 엔진 등록",   path: "/challenge" },
  adsense:   { label: "7단계 — 애드센스 신청",    path: "/challenge" },
};

export default function WelcomeBackBanner() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [lastMission, setLastMission] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!user) return;
    const key = `maza_welcome_seen_${user.id}`;
    const alreadySeen = localStorage.getItem(key);
    if (alreadySeen) return;

    // Show once and fetch last mission
    fetchLastMission();
    setUserName(user.email?.split('@')[0] || "블로거");
    setTimeout(() => {
      setVisible(true);
      localStorage.setItem(key, "1");
    }, 800);
  }, [user]);

  const fetchLastMission = async () => {
    const { data } = await supabase
      .from("ms_events")
      .select("event_type, metadata")
      .eq("user_id", user?.id)
      .eq("event_type", "challenge_mission_complete")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.metadata?.mission_id) {
      setLastMission(data.metadata.mission_id);
    }
  };

  const dismiss = () => setVisible(false);

  const nextMission = lastMission 
    ? MISSION_LABELS[lastMission] 
    : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[90] flex justify-center px-4 pt-16"
        >
          <div className="welcome-enter w-full max-w-2xl bg-slate-950 border border-white/10 rounded-3xl shadow-2xl p-5 flex items-center gap-5">
            {/* Avatar */}
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic shadow-xl shrink-0">
              {userName[0]?.toUpperCase() || 'M'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Welcome Back</span>
              </div>
              <p className="text-white font-black text-sm truncate">
                안녕하세요, <span className="text-indigo-400">{userName}</span>님! 오늘도 수익화를 향해 달려볼까요?
              </p>
              {nextMission && (
                <p className="text-slate-500 text-[11px] font-medium mt-0.5">
                  마지막 진행: <span className="text-indigo-400 font-bold">{nextMission.label}</span> — 이어서 완료하세요!
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={nextMission?.path || "/challenge"}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-xl whitespace-nowrap"
              >
                <Zap size={14} />
                {nextMission ? "이어서 하기" : "챌린지 시작"}
                <ChevronRight size={14} />
              </a>
              <button
                onClick={dismiss}
                className="p-3 text-slate-600 hover:text-slate-300 transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
