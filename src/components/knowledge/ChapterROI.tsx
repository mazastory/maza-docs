import React from 'react';
import { ShieldCheck, PenTool, Target } from 'lucide-react';
import { cn } from '../../lib/utils';

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

export default function ChapterROI() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
           AdSense Setup Revolution
        </div>
        <h3 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-tight">
           수백 가지 수동 세팅의 고통 <br />
           <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8 text-5xl">터치 한 번으로 원스톱 해결</span>
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
         <div className="bg-slate-950 text-white rounded-[48px] p-8 space-y-6 border border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-400 rounded-full text-[9px] font-black uppercase border border-rose-500/20">
                 The Painful Legacy Way
              </div>
              <h4 className="text-2xl font-black text-rose-400 tracking-tighter italic">복잡하고 머리아픈 수동 노가다</h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                 구글 애널리틱스(GA4) 추적 스크립트 발급 &rarr; 티스토리 스킨 편집창 삽입 &rarr; 서치콘솔 소유권 인증 &rarr; 사이트맵 수동 수집 요청...
              </p>
            </div>
         </div>

         <div className="bg-white text-slate-900 rounded-[48px] p-8 space-y-6 border border-slate-100 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase border border-emerald-100">
                 The Smart Maza Way
              </div>
              <h4 className="text-2xl font-black text-indigo-600 tracking-tighter italic">마자 터치식 원클릭 오토파일럿</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                 도메인 구입 후 자동 연결 &rarr; 구글 로그인 원탭으로 GA4 및 서치콘솔 자동 획득 &rarr; 즉시 스케줄링 자율 주행 시작!
              </p>
            </div>
         </div>
      </div>

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
  );
}
