import React, { useState } from 'react';
import { Download, Settings, Rocket, HelpCircle, Puzzle, Globe, CheckCircle2, ArrowRight, ArrowLeft, ExternalLink, Zap, Layout } from 'lucide-react';

export default function ChapterExtension() {
  const [ch2Slide, setCh2Slide] = useState(0);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Extension Hero */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl border border-indigo-500/20">
         <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 border border-indigo-500/30">
                  MAZA BRIDGE ENGINE PRO
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

      <a 
        href="/installation-guide" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
      >
         <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                  <Puzzle size={32} className="text-white" />
               </div>
               <div>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-1">
                     🖥️ 초고화질 스크린샷 1초 설치 완벽 가이드
                  </h4>
                  <p className="text-indigo-100 font-medium text-sm">
                     어려운 텍스트 설명 대신, 실제 화면을 보며 클릭 3번만에 설치를 끝내세요.
                  </p>
               </div>
            </div>
            <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-2 transition-transform shadow-lg">
               <ExternalLink size={20} />
            </div>
         </div>
      </a>
      
      <div className="grid md:grid-cols-2 gap-8 mt-12">
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
          </div>
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-800">IDENTITY: 계정 연동 확인</div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">웹앱에서 로그인한 계정 정보가 사이드바 상단에 Connected 상태로 표시되어야 합니다.</p>
            </div>
          </div>
        </div>

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
          </div>
          <div className="space-y-4">
            <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-3 shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-black text-indigo-400">명령 기반 강제 타겟팅</div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">익스텐션이 해당 도메인의 탭을 직접 찾거나 생성하여 콘텐츠를 주입합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
