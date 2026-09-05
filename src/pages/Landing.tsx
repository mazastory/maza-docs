import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Globe2, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-sans overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] mix-blend-screen opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8 border-indigo-500/30">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 orb-ready"></span>
            <span className="text-sm font-semibold tracking-wide text-indigo-200">MAZA STUDIO 2026</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 hero-title leading-tight">
            블로그, 이제 <br/>
            <span className="text-gradient">디지털 부동산</span>으로 매각하세요.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 font-medium mb-12 leading-relaxed">
            애드센스 수익만 기다리다 지치셨나요? <br className="hidden md:block"/>
            마자는 당신의 블로그를 수천 달러에 팔리는 글로벌 자산으로 세탁해 드립니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/whitepaper" className="btn-premium group flex items-center gap-2 w-full sm:w-auto">
              마자 백서 읽어보기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="btn-glass w-full sm:w-auto text-slate-300 hover:text-white border-white/10">
              어떻게 가능한가요?
            </a>
          </div>
        </motion.div>

        {/* Bento Box Features Section */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Bento 1: Auto Healer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 glass-dark p-8 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
              <Zap className="w-24 h-24 text-amber-400" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-3">오토 힐러 (Auto-Healer)</h3>
              <p className="text-slate-400 text-lg mb-6 max-w-md">
                버려진 당신의 티스토리, 워드프레스를 마자에 연결만 하세요. 과거의 똥글(?)을 구글이 사랑하는 프리미엄 자산으로 자동 세탁해 드립니다.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-400"/> 기만성 단어 자동 제거</li>
                <li className="flex items-center gap-2 text-slate-300"><CheckCircle2 className="w-5 h-5 text-emerald-400"/> 누락된 이미지 자동 생성 및 삽입</li>
              </ul>
            </div>
          </motion.div>

          {/* Bento 2: Global Multiple */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-dark p-8 rounded-3xl flex flex-col justify-between"
          >
            <div>
              <Globe2 className="w-10 h-10 text-indigo-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">다국어 팩 자동화</h3>
              <p className="text-slate-400">
                미국 바이어들이 환장하는 '영어 블로그'. 한국어로 세팅해도 완벽한 미국 타겟 영어 디지털 자산이 생산됩니다.
              </p>
            </div>
          </motion.div>

          {/* Bento 3: Flippa Exit */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-dark p-8 rounded-3xl"
          >
            <TrendingUp className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">플리파 엑시트</h3>
            <p className="text-slate-400">월 수익 $0인 스타터 사이트도 $500에 매각. 수익의 30배 Multiple을 현찰로 챙기세요.</p>
          </motion.div>

          {/* Bento 4: QC Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 glass-dark p-8 rounded-3xl bg-gradient-to-br from-slate-950/90 to-indigo-950/90 border-indigo-500/20"
          >
            <ShieldCheck className="w-12 h-12 text-indigo-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
              마자 QC 뱃지
              <span className="text-xs font-bold bg-indigo-600 text-white px-2 py-1 rounded-md">PREMIUM</span>
            </h3>
            <p className="text-slate-400 text-lg">
              중고차엔 헤이딜러, 명품엔 감정서, 블로그엔 <strong>마자 뱃지</strong>.<br/>
              시스템이 50가지 항목을 자동 검수한 '보증된 블로그'만이 바이어의 지갑을 엽니다.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
