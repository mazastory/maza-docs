import React, { useState } from 'react';
import { 
  BookOpen, Zap, Shield, Target, Globe, 
  ChevronRight, Play, CheckCircle2, AlertTriangle,
  Layers, MousePointer2, Smartphone, Cpu, Sparkles,
  BarChart3, Code2, Database, Search, ArrowRight,
  Monitor, Info, Lock, Terminal, Radio, Clock,
  LogIn, UserCheck, FileText, Send, Share2, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const CHAPTERS = [
  { id: 'intro', title: 'Philosophy', subtitle: 'The Autopilot OS Origin', icon: Sparkles, color: 'indigo' },
  { id: 'onboarding', title: 'Onboarding', subtitle: 'Start Your Engine', icon: LogIn, color: 'blue' },
  { id: 'hunter', title: 'Niche Hunter', subtitle: 'Market Intelligence', icon: Target, color: 'emerald' },
  { id: 'writer', title: 'AI Writer', subtitle: 'E-E-A-T Engine', icon: Cpu, color: 'amber' },
  { id: 'tistory', title: 'Tistory Link', subtitle: 'Bridge Protocol', icon: Globe, color: 'orange' },
  { id: 'flowchart', title: 'Challenge Flow', subtitle: 'Victory Roadmap', icon: Award, color: 'sky' },
  { id: 'safety', title: 'Safety & Risk', subtitle: 'W-05 Compliance', icon: Shield, color: 'rose' }
];

export default function Guide() {
  const [activeChapter, setActiveChapter] = useState('intro');

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 font-sans pb-24">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Floating Navigation */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-10">
              <div className="space-y-4">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white transition-colors group mb-8"
                >
                  <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                  <span>BACK TO DASHBOARD</span>
                </button>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                  <Radio size={12} className="animate-pulse" /> Global Documentation v9.0
                </div>
                <h1 className="text-5xl font-black italic tracking-tighter text-white leading-[0.8] uppercase">
                  Maza<br />Mastery
                </h1>
                <p className="text-sm font-bold text-slate-500 italic uppercase tracking-widest border-l-2 border-indigo-500/50 pl-4">
                  Everything you need<br />to conquer AdSense.
                </p>
              </div>

              <nav className="space-y-1.5">
                {CHAPTERS.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => setActiveChapter(chapter.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-500 group relative overflow-hidden",
                      activeChapter === chapter.id 
                        ? "bg-white/10 border border-white/10 shadow-2xl scale-105" 
                        : "hover:bg-white/5 border border-transparent opacity-50 hover:opacity-100"
                    )}
                  >
                    {activeChapter === chapter.id && (
                      <motion.div 
                        layoutId="active-bg"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent pointer-events-none" 
                      />
                    )}
                    <div className={cn(
                      "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 shadow-lg",
                      activeChapter === chapter.id 
                        ? "bg-white text-slate-950 rotate-0" 
                        : "bg-slate-900 text-slate-500 group-hover:rotate-12 group-hover:scale-110"
                    )}>
                      <chapter.icon size={22} />
                    </div>
                    <div className="text-left z-10">
                      <div className={cn(
                        "text-[10px] font-black uppercase tracking-widest mb-0.5 transition-colors",
                        activeChapter === chapter.id ? `text-${chapter.color}-400` : "text-slate-600"
                      )}>
                        {chapter.id === 'intro' ? 'Overview' : `Module ${chapter.id.toUpperCase()}`}
                      </div>
                      <div className={cn(
                        "text-sm font-black tracking-tight transition-colors",
                        activeChapter === chapter.id ? "text-white" : "text-slate-400"
                      )}>
                        {chapter.title}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-24"
              >
                {/* 0. INTRO: Philosophy */}
                {activeChapter === 'intro' && (
                  <section className="space-y-16">
                    <div className="space-y-8">
                      <h2 className="text-7xl lg:text-9xl font-black italic tracking-tighter text-white leading-[0.8]">
                        WHY<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 uppercase">Autopilot?</span>
                      </h2>
                      <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-3xl">
                        글을 쓰는 행위는 즐거울 수 있지만, '수익화'를 위한 반복적인 집필은 고통입니다. <br />
                        마자는 그 고통을 제거하고, **검증된 데이터와 AI의 결합**으로 당신의 블로그를 24시간 수익 공장으로 바꿉니다.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="p-10 bg-slate-900/40 rounded-[48px] border border-white/5 space-y-4">
                          <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">The Problem</h4>
                          <p className="text-sm text-slate-500 font-bold leading-relaxed">
                             무슨 키워드로 써야 할지 모르고, 구글 SEO를 공부하느라 시간을 다 쓰고, 결국 10개쯤 쓰다 포기합니다.
                          </p>
                       </div>
                       <div className="p-10 bg-indigo-600 rounded-[48px] text-white space-y-4 shadow-2xl shadow-indigo-500/20">
                          <h4 className="text-2xl font-black italic uppercase tracking-tighter">The Solution</h4>
                          <p className="text-sm font-bold leading-relaxed">
                             마자가 수익 키워드를 찾아주고, 구글이 좋아하는 E-E-A-T 구조로 글을 쓰며, 자동으로 티스토리에 주입합니다.
                          </p>
                       </div>
                    </div>
                  </section>
                )}

                {/* 1. ONBOARDING: Login & Setup */}
                {activeChapter === 'onboarding' && (
                  <section className="space-y-16">
                    <div className="space-y-6">
                      <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none uppercase">Step 01.<br /><span className="text-blue-500 italic">로그인 및 온보딩.</span></h2>
                    </div>

                    <div className="grid gap-12">
                       <div className="bg-slate-900/40 p-12 rounded-[56px] border border-white/5 space-y-10">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center">
                                <LogIn size={32} />
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-white italic uppercase">구글 계정 로그인</h4>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Single Sign-On Experience</p>
                             </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <h5 className="text-sm font-black text-slate-200 uppercase tracking-tight flex items-center gap-2">
                                   <UserCheck size={16} className="text-blue-400" /> 가입 계정 (로그인용)
                                </h5>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                   마자스튜디오 대시보드에 접근하기 위한 계정입니다. 평소 사용하시는 구글 계정으로 간편하게 시작하세요.
                                </p>
                             </div>
                             <div className="space-y-4">
                                <h5 className="text-sm font-black text-slate-200 uppercase tracking-tight flex items-center gap-2">
                                   <Lock size={16} className="text-amber-400" /> 인프라 계정 (수익 전용)
                                </h5>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                   실제 블로그와 연결될 계정입니다. 보안과 리스크 분산을 위해 로그인 계정과는 다른 **'수익 전용 부계정'** 사용을 추천합니다.
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </section>
                )}

                {/* 2. HUNTER: Niche Hunter Deep-dive */}
                {activeChapter === 'hunter' && (
                  <section className="space-y-16">
                    <div className="space-y-6">
                      <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none uppercase">Step 02.<br /><span className="text-emerald-500 italic">니치 헌터 전략.</span></h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="bg-slate-900/40 p-10 rounded-[48px] border border-white/5 space-y-6">
                          <h4 className="text-xl font-black text-white italic uppercase tracking-widest">Winning Blueprints</h4>
                          <p className="text-sm text-slate-500 font-bold leading-relaxed">
                             우리는 아무 글이나 쓰지 않습니다. 이미 수익성이 검증된 20개 이상의 '정답지' 중 하나를 선택합니다.
                          </p>
                          <div className="space-y-3 pt-4">
                             {['정부 지원금 큐레이션 (고효율)', '금융 정보 마스터 (고단가)', '테크 & 가전 리뷰 (전문성)'].map(item => (
                               <div key={item} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl text-[11px] font-black text-slate-300 uppercase tracking-tight">
                                  <Target size={14} className="text-emerald-500" /> {item}
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="bg-emerald-500 p-10 rounded-[48px] text-slate-950 space-y-6 shadow-3xl shadow-emerald-500/20">
                          <h4 className="text-xl font-black italic uppercase tracking-widest">How to Use</h4>
                          <div className="space-y-4">
                             <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                                <p className="text-xs font-bold leading-tight">마이 페이지에서 자신의 블로그 도메인을 등록합니다.</p>
                             </div>
                             <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                                <p className="text-xs font-bold leading-tight">니치 헌터에서 자신의 사이트 성격에 맞는 블루프린트를 선택합니다.</p>
                             </div>
                             <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                                <p className="text-xs font-bold leading-tight">'글쓰기 가동'을 눌러 오토파일럿을 활성화합니다.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </section>
                )}

                {/* 3. WRITER: AI Writer Engine */}
                {activeChapter === 'writer' && (
                  <section className="space-y-16">
                    <div className="space-y-6">
                      <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none uppercase">Step 03.<br /><span className="text-amber-500 italic">AI 라이터 엔진.</span></h2>
                    </div>

                    <div className="p-12 bg-slate-900/40 rounded-[56px] border border-white/5 space-y-12">
                       <h4 className="text-2xl font-black text-white italic text-center uppercase tracking-widest">The E-E-A-T 5-Step Logic</h4>
                       <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                          {[
                            { n: 'Analyze', d: '키워드 의도 분석', i: Search },
                            { n: 'Structure', d: '논리적 목차 구성', i: Layers },
                            { n: 'Generate', d: '본문 2,500자 생성', i: Terminal },
                            { n: 'Visualize', d: '경험 증명 이미지', i: Sparkles },
                            { n: 'Optimize', d: 'SEO 태그 주입', i: Code2 }
                          ].map((step, i) => (
                            <div key={step.n} className="space-y-4 text-center">
                               <div className="w-14 h-14 bg-slate-800 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                                  <step.i size={24} />
                               </div>
                               <div>
                                  <div className="text-xs font-black text-white uppercase italic tracking-tighter">{step.n}</div>
                                  <div className="text-[10px] text-slate-500 font-bold mt-1 leading-tight">{step.d}</div>
                               </div>
                            </div>
                          ))}
                       </div>
                       
                       <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-[40px] flex items-center gap-6">
                          <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center shrink-0">
                             <FileText size={24} />
                          </div>
                          <p className="text-sm text-slate-300 font-bold leading-relaxed">
                             단순 AI 글이 아닙니다. 구글의 최신 검색 알고리즘이 요구하는 **경험(Experience), 전문성(Expertise), 권위성(Authoritativeness), 신뢰성(Trustworthiness)**을 본문에 녹여냅니다.
                          </p>
                       </div>
                    </div>
                  </section>
                )}

                {/* 4. TISTORY: Bridge Protocol */}
                {activeChapter === 'tistory' && (
                  <section className="space-y-16">
                    <div className="space-y-6">
                      <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none uppercase">Step 04.<br /><span className="text-orange-500 italic">티스토리 연동.</span></h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="bg-slate-900/40 p-10 rounded-[48px] border border-white/5 space-y-6">
                          <h4 className="text-xl font-black text-white italic uppercase tracking-widest">Extension Injection</h4>
                          <p className="text-sm text-slate-500 font-bold leading-relaxed">
                             티스토리 API 발급 중단 문제를 해결하기 위해, 마자는 **익스텐션(Extension)**을 통한 '화면 주입' 방식을 사용합니다.
                          </p>
                          <div className="space-y-4 pt-4">
                             <div className="flex items-center gap-3">
                                <Monitor size={18} className="text-orange-400" />
                                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">익스텐션 설치 여부 확인</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <Send size={18} className="text-orange-400" />
                                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">발행 버튼 클릭 → 주입 시작</span>
                             </div>
                          </div>
                       </div>
                       <div className="bg-orange-600 p-10 rounded-[48px] text-white space-y-6 shadow-3xl shadow-orange-500/20 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-20">
                             <Share2 size={100} />
                          </div>
                          <h4 className="text-xl font-black italic uppercase tracking-widest">Crucial Tip</h4>
                          <p className="text-sm font-bold leading-relaxed">
                             익스텐션이 설치된 브라우저 탭에서 티스토리에 로그인이 되어 있어야 합니다. 로그인이 되어 있지 않으면 주입이 실패합니다.
                          </p>
                       </div>
                    </div>
                  </section>
                )}

                {/* 5. FLOWCHART: Challenge Roadmap */}
                {activeChapter === 'flowchart' && (
                  <section className="space-y-20">
                    <div className="space-y-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 rounded-full border border-sky-500/20 text-xs font-black text-sky-400 uppercase tracking-widest">
                        <Award size={14} /> The Road to Victory
                      </div>
                      <h2 className="text-7xl font-black italic tracking-tighter text-white leading-none uppercase">애드센스 챌린지<br /><span className="text-sky-400 italic">성공 순서도.</span></h2>
                    </div>

                    {/* Interactive Flowchart */}
                    <div className="relative">
                       {/* Vertical Line */}
                       <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-500 via-indigo-600 to-emerald-500 -translate-x-1/2 opacity-20" />

                       <div className="space-y-20 relative z-10">
                          {/* Phase 1 */}
                          <div className="flex flex-col md:flex-row items-center gap-8">
                             <div className="flex-1 text-right hidden md:block">
                                <h5 className="text-2xl font-black text-white italic uppercase">Phase 01. 기초 공사</h5>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed mt-2">도메인 연결 및 인프라 구축</p>
                             </div>
                             <div className="w-16 h-16 bg-sky-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xl shadow-2xl shadow-sky-500/50 shrink-0">1</div>
                             <div className="flex-1 bg-slate-900/60 p-8 rounded-[40px] border border-white/10 space-y-4">
                                <ul className="space-y-2">
                                   <li className="flex items-center gap-2 text-[10px] font-black text-sky-400 tracking-widest"><CheckCircle2 size={12}/> 티스토리 블로그 개설 및 스킨(북클럽) 설정</li>
                                   <li className="flex items-center gap-2 text-[10px] font-black text-sky-400 tracking-widest"><CheckCircle2 size={12}/> 마자 익스텐션 설치 및 마자스튜디오 로그인</li>
                                   <li className="flex items-center gap-2 text-[10px] font-black text-sky-400 tracking-widest"><CheckCircle2 size={12}/> RSS '전체 공개' + '50개' 설정 완료</li>
                                </ul>
                             </div>
                          </div>

                          {/* Phase 2 */}
                          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                             <div className="flex-1 text-left hidden md:block">
                                <h5 className="text-2xl font-black text-white italic uppercase">Phase 02. 권위 형성</h5>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed mt-2">필러 포스트(Pillar Post) 생성</p>
                             </div>
                             <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-2xl shadow-indigo-600/50 shrink-0">2</div>
                             <div className="flex-1 bg-slate-900/60 p-8 rounded-[40px] border border-white/10 space-y-4">
                                <ul className="space-y-2">
                                   <li className="flex items-center gap-2 text-[10px] font-black text-indigo-400 tracking-widest"><CheckCircle2 size={12}/> 니치 헌터 블루프린트 가동 (3시간 간격)</li>
                                   <li className="flex items-center gap-2 text-[10px] font-black text-indigo-400 tracking-widest"><CheckCircle2 size={12}/> 본문 2,500자 이상의 고퀄리티 글 15개 누적</li>
                                   <li className="flex items-center gap-2 text-[10px] font-black text-indigo-400 tracking-widest"><CheckCircle2 size={12}/> 구글 서치콘솔 등록 및 사이트맵 제출</li>
                                </ul>
                             </div>
                          </div>

                          {/* Phase 3 */}
                          <div className="flex flex-col md:flex-row items-center gap-8">
                             <div className="flex-1 text-right hidden md:block">
                                <h5 className="text-2xl font-black text-white italic uppercase">Phase 03. 승인 요청</h5>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed mt-2">AdSense 검토 대기 및 자율 발행</p>
                             </div>
                             <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xl shadow-2xl shadow-amber-500/50 shrink-0">3</div>
                             <div className="flex-1 bg-slate-900/60 p-8 rounded-[40px] border border-white/10 space-y-4">
                                <ul className="space-y-2">
                                   <li className="flex items-center gap-2 text-[10px] font-black text-amber-500 tracking-widest"><CheckCircle2 size={12}/> 애드센스 홈페이지에서 '검토 요청' 클릭</li>
                                   <li className="flex items-center gap-2 text-[10px] font-black text-amber-500 tracking-widest"><CheckCircle2 size={12}/> 검토 기간(약 14일) 동안 오토파일럿 중단 없이 가동</li>
                                   <li className="flex items-center gap-2 text-[10px] font-black text-amber-500 tracking-widest"><CheckCircle2 size={12}/> 1일 1포스팅 원칙 고수 (안전 발행 루프)</li>
                                </ul>
                             </div>
                          </div>

                          {/* Victory */}
                          <div className="flex flex-col items-center gap-6">
                             <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-emerald-600 text-slate-950 rounded-[40px] flex items-center justify-center font-black text-3xl shadow-3xl shadow-emerald-500/40 rotate-12 group hover:rotate-0 transition-transform duration-500">
                                <Award size={48} />
                             </div>
                             <div className="text-center space-y-2">
                                <h5 className="text-4xl font-black text-white italic uppercase tracking-tighter">Victory & Scaling</h5>
                                <p className="text-sm text-emerald-400 font-black uppercase tracking-[0.3em]">수익화의 시작, 퀀텀 점프</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </section>
                )}

                {/* 6. SAFETY: Safety Protocol */}
                {activeChapter === 'safety' && (
                  <section className="space-y-16">
                    <div className="space-y-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 rounded-full border border-rose-500/20 text-xs font-black text-rose-400 uppercase tracking-widest">
                        <Shield size={14} /> Account Protection
                      </div>
                      <h2 className="text-7xl font-black italic tracking-tighter text-white leading-none uppercase">리스크<br /><span className="text-rose-500 italic">제로 가이드.</span></h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="p-10 bg-slate-900/40 rounded-[48px] border border-white/5 space-y-6">
                          <h4 className="text-xl font-black text-white italic uppercase">The W-05 Protocol</h4>
                          <p className="text-sm text-slate-500 font-bold leading-relaxed">
                             단기간의 대량 발행은 '계정 폐쇄'의 지름길입니다. <br />
                             마자는 **3시간 간격**을 무조건 강제하며, 이를 통해 구글이 우리 사이트를 '정상적인 고퀄리티 정보 사이트'로 인식하게 만듭니다.
                          </p>
                       </div>
                       <div className="p-10 bg-rose-600 rounded-[48px] text-white space-y-6 shadow-2xl shadow-rose-500/20">
                          <h4 className="text-xl font-black italic uppercase">Never Do This</h4>
                          <ul className="space-y-3">
                             <li className="flex items-start gap-2 text-xs font-bold leading-tight">
                                <div className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center shrink-0">!</div>
                                하루에 5개 이상의 글을 수동으로 몰아 쓰기
                             </li>
                             <li className="flex items-start gap-2 text-xs font-bold leading-tight">
                                <div className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center shrink-0">!</div>
                                검증되지 않은 외부 이미지를 불분명하게 삽입
                             </li>
                             <li className="flex items-start gap-2 text-xs font-bold leading-tight">
                                <div className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center shrink-0">!</div>
                                마자의 안전 주기를 임의로 우회 시도
                             </li>
                          </ul>
                       </div>
                    </div>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Floating Call to Action */}
      <motion.div 
        initial={{ y: 100 }} 
        animate={{ y: 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-6"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-2 rounded-[32px] shadow-3xl flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-950 shrink-0 shadow-lg">
              <Zap size={24} fill="currentColor" />
           </div>
           <div className="flex-1">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Maza Autopilot</p>
              <p className="text-sm font-black text-white italic tracking-tight">이제 실전으로 이동할 준비가 되셨나요?</p>
           </div>
           <button 
             onClick={() => window.location.href = '/autopilot'}
             className="px-6 py-3 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
           >
              Launch
           </button>
        </div>
      </motion.div>
    </div>
  );
}
