import { Sparkles, Cpu, Target, Shield, Globe, Star, ArrowRight } from 'lucide-react';

export default function PageIntro() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Overview
        </span>
        <h1 id="intro" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          마자 스튜디오란?
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">Maza Autopilot OS</strong>는 구글 애드센스 승인과 블로그 수익화를 자동화하는 <br className="hidden md:block" />
          AI 기반 완전 자율주행 콘텐츠 플랫폼입니다.
        </p>
      </div>

      {/* Problem vs Solution */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-7 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <span className="text-2xl">😩</span> The Problem
          </h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            무슨 키워드로 써야 할지 모르고, 구글 SEO를 공부하느라 시간을 다 쓰고,
            결국 10개쯤 쓰다 포기합니다.
          </p>
        </div>
        <div className="p-7 bg-indigo-600 rounded-2xl text-white space-y-3 shadow-xl shadow-indigo-200">
          <h4 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
            <span className="text-2xl">🚀</span> The Solution
          </h4>
          <p className="text-sm font-medium leading-relaxed opacity-90">
            마자가 수익 키워드를 찾아주고, 구글이 좋아하는 E-E-A-T 구조로 글을 쓰며,
            자동으로 발행합니다.
          </p>
        </div>
      </div>

      {/* Core Engine */}
      <h2 id="one-engine" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        원 엔진 (One Engine) 파이프라인
      </h2>
      <p className="text-sm text-slate-600 font-medium mb-6">
        모든 자동화는 아래 3단계 흐름을 따릅니다. 유저는 단 하나의 무대(Autopilot Stage)에서 모든 것을 관제합니다.
      </p>

      <div className="flex flex-col md:flex-row items-center gap-0 mb-12">
        {[
          { icon: Target, label: 'Niche Hunter', desc: '수익 키워드 발굴', color: 'bg-emerald-100 text-emerald-700' },
          { icon: Cpu, label: 'AI Writer', desc: 'E-E-A-T 글 자동 집필', color: 'bg-amber-100 text-amber-700' },
          { icon: Globe, label: 'Post Mapper', desc: 'W-05 안전 배차', color: 'bg-sky-100 text-sky-700' },
        ].map((step, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center text-center p-5 bg-white border border-slate-100 rounded-2xl w-36 shadow-sm">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${step.color}`}>
                <step.icon size={20} />
              </div>
              <div className="text-xs font-black text-slate-800">{step.label}</div>
              <div className="text-[10px] font-medium text-slate-400 mt-1">{step.desc}</div>
            </div>
            {i < 2 && <ArrowRight size={18} className="text-slate-300 mx-2 shrink-0 hidden md:block" />}
          </div>
        ))}
      </div>

      {/* Core Pillars */}
      <h2 id="core-philosophy" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        핵심 설계 철학
      </h2>
      <div className="space-y-3 mb-12">
        {[
          { n: '원 엔진 파이프라인', d: '주제 발굴 → 집필 → 배차를 하나의 유기적 흐름으로 통합' },
          { n: '키워드 금고 우선', d: '외부 API 호출 최소화, 사전 검증된 고수익 키워드 활용' },
          { n: '안전 제일 (W-05)', d: '3시간 발행 간격 강제로 계정 보호 최우선' },
          { n: '주제 권위 (Topical Authority)', d: '시리즈 형태 묶음 발행으로 검색 엔진 신뢰 확보' },
          { n: '제로-점프 관제', d: 'Autopilot Stage 하나에서 모든 자동화 현황 모니터링' },
          { n: '경험 우선 (E-E-A-T)', d: 'AI 이미지보다 유저의 실제 사진으로 독창성 극대화' },
        ].map((p, i) => (
          <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <Star size={14} className="text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-sm font-black text-slate-800">{p.n}</span>
              <span className="text-xs text-slate-500 font-medium"> — {p.d}</span>
            </div>
          </div>
        ))}
      </div>

      {/* W-05 Safety */}
      <h2 id="w05-brief" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        W-05 안전 프로토콜 요약
      </h2>
      <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 mb-8">
        <Shield size={24} className="text-rose-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-rose-700 mb-1">모든 자동 발행은 최소 3시간(10,800초) 간격 강제</p>
          <p className="text-xs text-rose-600 font-medium leading-relaxed">
            단기간 대량 발행은 구글 어뷰징 필터의 지름길입니다. 마자는 이 간격을 절대 우회할 수 없도록 시스템 수준에서 잠금합니다.
          </p>
        </div>
      </div>
    </article>
  );
}
