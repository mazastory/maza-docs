import React from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChapterFAQ() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 flex flex-col items-center justify-center min-h-[40vh]">
      <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mb-6">
        <HelpCircle size={48} />
      </div>
      
      <div className="text-center space-y-4 max-w-2xl">
        <h3 className="text-4xl font-black italic tracking-tighter text-slate-900">
          실무 현장의 모든 질문,<br />
          <span className="text-indigo-600">FAQ 페이지에서 검색하세요.</span>
        </h3>
        <p className="text-slate-500 font-medium">
          다계정 운영, 애드센스 승인 전략, 익스텐션 트러블슈팅 등 
          실무에서 발생하는 핵심 궁금증을 카테고리별로 모아두었습니다.
        </p>
      </div>

      <button
        onClick={() => navigate('/faq')}
        className="px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest hover:scale-105 hover:bg-indigo-600 transition-all shadow-xl flex items-center gap-4 mt-8"
      >
        FAQ 전체 목록 보기 <ArrowRight size={18} />
      </button>
    </div>
  );
}
