import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, ArrowRight, Globe, 
  Layers, Lock, Sparkles, Zap,
  Fingerprint, Loader2
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { useAuth } from "../components/AuthProvider";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/knowledge");
    }
  }, [session, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === '1') {
      toast.error('로그인 유효기간이 만료되었습니다. 다시 로그인해 주세요.', { icon: '🔒' });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/knowledge`,
          scopes: 'https://www.googleapis.com/auth/analytics.edit https://www.googleapis.com/auth/analytics.provision https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/siteverification https://www.googleapis.com/auth/blogger',
          queryParams: {
            prompt: 'consent',
            access_type: 'offline'
          }
        }
      });
      if (error) throw error;
    } catch(e: unknown) {
      toast.error(`로그인 실패: ${e.message}`);
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/knowledge`
        }
      });
      if (error) throw error;
    } catch(e: unknown) {
      toast.error(`카카오 로그인 실패: ${e.message}`);
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("회원가입 확인 메일이 발송되었습니다!");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) navigate("/knowledge");
      }
    } catch(e: unknown) {
      if (e.message.includes("User already registered")) {
        toast.error("이미 가입된 이메일입니다. 혹시 구글이나 카카오로 가입하셨나요?");
      } else if (e.message.includes("Invalid login credentials")) {
        toast.error("이메일/비밀번호가 일치하지 않거나, 구글/카카오로 가입된 계정입니다.");
      } else if (e.message.includes("Email not confirmed")) {
        toast.error("이메일 인증이 완료되지 않았습니다. 발송된 메일을 확인해주세요.");
      } else {
        toast.error(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden relative">
          {/* Top Branding Section */}
          <div className="p-10 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 relative group overflow-hidden">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Layers size={28} className="relative z-10" />
              </div>
            </div>
            
            <div className="space-y-1 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600 mx-auto">
                <ShieldCheck size={12} /> 마자 공식 시스템
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 leading-none pt-2 uppercase">
                마자 <span className="text-indigo-600">스튜디오</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">수익 자동화의 시작, 마자 스튜디오</p>
            </div>
          </div>

          {/* Action Section */}
          <div className="px-10 pb-12 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: "#f8fafc", 
                  borderColor: "#6366f1",
                  boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -5px rgba(99, 102, 241, 0.04)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="py-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm group"
              >
                <Globe size={14} className="text-blue-500 group-hover:animate-spin-slow" /> 구글 로그인
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#FDD800" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleKakaoLogin}
                disabled={isLoading}
                className="py-4 bg-[#FEE500] text-black rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <div className="w-3.5 h-3.5 bg-black/80 rounded-sm" /> 카카오 로그인
              </motion.button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-slate-300">또는 이메일 로그인</span></div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">이메일 주소</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="아이디 또는 이메일"
                  className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-xs outline-none shadow-inner"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">비밀번호</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all font-bold text-xs outline-none shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-indigo-700 active:scale-95 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="currentColor" />}
                {isSignUp ? "회원가입 하기" : "로그인 하기"}
              </button>
            </form>

            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              {isSignUp ? "이미 계정이 있으신가요? 로그인" : "아직 회원이 아니신가요? 가입하기"}
            </button>

            <div className="pt-8 border-t border-slate-50 grid grid-cols-3 gap-4">
              {[
                { icon: Zap, label: "수익 자동화" },
                { icon: Globe, label: "쉬운 연동" },
                { icon: Fingerprint, label: "계정 보호" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                    <item.icon size={18} />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Decoration */}
          <div className="h-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600" />
        </div>

        {/* Support & Legal Links */}
        <div className="mt-8 text-center space-y-6">
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => navigate("/")}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              홈으로 돌아가기 <ArrowRight size={12} />
            </button>
            
            <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
               <button onClick={() => navigate("/privacy")} className="hover:text-indigo-600 underline decoration-indigo-600/20 underline-offset-4">개인정보처리방침</button>
               <button onClick={() => navigate("/terms")} className="hover:text-indigo-600">이용약관</button>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-1.5 opacity-20">
             <Sparkles size={12} className="text-amber-500" />
             <span className="text-[10px] font-black tracking-widest uppercase">마자 스튜디오 팀에서 정성껏 만들었습니다.</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
