import React, { useState } from 'react';
import { Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChapterAnalytics() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-5xl mx-auto">
      <div className="p-12 bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200 rounded-[64px] shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
               <div className="inline-flex items-center gap-2 px-5 py-2 bg-amber-600 text-white rounded-full text-[11px] font-black tracking-[0.2em] uppercase shadow-lg">
                  <Eye size={16} fill="currentColor" /> First Mission: Activate Google Eyes
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 leading-[0.9]">
                     챌린지 에러를 방지하는<br />
                     <span className="text-amber-600">최초 1회 '통로 개설' 미션</span>
                  </h2>
                  <p className="text-slate-600 text-sm font-bold leading-relaxed">
                     구글 애드센스 챌린지 페이지에서 데이터 에러가 뜨나요? <br />
                     <span className="text-slate-900">딱 한 번만 아무 이름이나 적어서 통로를 열어주세요.</span>
                  </p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white/60 rounded-3xl border border-amber-200/50 space-y-2">
                     <div className="text-xs font-black text-amber-600 uppercase tracking-widest">Tip 01</div>
                     <p className="text-xs font-bold text-slate-800">계정 이름에 'andrew'처럼 아무 이름이나 적으셔도 무방합니다.</p>
                  </div>
               </div>
               <div className="pt-4 flex items-center gap-6">
                  <a 
                    href="https://tagmanager.google.com/#/admin/accounts/create" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-amber-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3"
                  >
                     Launch Google Setup <ArrowRight size={14} />
                  </a>
                  <button 
                    onClick={() => navigate('/challenge')}
                    className="text-[10px] font-black text-amber-700 uppercase tracking-widest border-b-2 border-amber-200 hover:border-amber-600 transition-all"
                  >
                     이미 완료했다면 챌린지로 이동
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-slate-900 text-white p-10 rounded-[48px] space-y-6">
        <h3 className="text-2xl font-black italic tracking-tighter">🔒 Identity & Infrastructure Decoupling (가입 계정 독립화)</h3>
        <p className="text-xs text-slate-400 font-bold leading-relaxed">
           수익형 블로그 제국을 건설할 때 가장 중요한 보안 수칙은 **"가입 계정과 실제 수익 창출 인프라 계정을 철저히 분리"**하는 것입니다. 
           이는 갑작스러운 계정 규제 시 가입 정보를 분리 보호할 수 있는 최고의 아키텍처입니다.
        </p>
      </div>
    </div>
  );
}
