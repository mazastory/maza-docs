import React, { useState } from 'react';
import { Edit3, Settings, ArrowRight } from 'lucide-react';

export default function ChapterSetup() {
  const [blogUrl, setBlogUrl] = useState(localStorage.getItem('m_blog_url') || '');
  const [isUrlEdit, setIsUrlEdit] = useState(false);

  const handleSaveUrl = () => {
    localStorage.setItem('m_blog_url', blogUrl);
    setIsUrlEdit(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-slate-900 p-10 rounded-[64px] shadow-3xl relative overflow-hidden border border-white/5">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/20">
                🌍 GLOBAL INFRA ORBIT
              </div>
              <h4 className="text-white text-3xl font-black italic tracking-tighter">어떤 플랫폼이든 고민하지 마세요. <br /><span className="text-indigo-400">마자가 길을 열어둡니다.</span></h4>
              <p className="text-slate-400 text-xs font-bold">운영 중인 블로그 URL 주소를 입력하면 마자가 알아서 최적의 설정 페이지들을 1초 만에 연동해 드립니다.</p>
            </div>
            <div className="w-full md:w-auto shrink-0">
              {isUrlEdit ? (
                <div className="flex gap-2 bg-white/5 p-2 rounded-[24px] border border-white/10">
                  <input 
                    type="text" 
                    value={blogUrl} 
                    onChange={(e) => setBlogUrl(e.target.value)}
                    placeholder="any-blog.blogspot.com"
                    className="bg-transparent px-6 py-3 text-sm font-bold w-full md:w-64 outline-none text-white"
                  />
                  <button onClick={handleSaveUrl} className="bg-indigo-600 text-white px-8 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Connect</button>
                </div>
              ) : (
                <div className="flex items-center gap-6 bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-xl">
                  <div>
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Connected URL</div>
                    <p className="text-xl font-black italic text-white tracking-tighter">{blogUrl || "Link your platform"}</p>
                  </div>
                  <button onClick={() => setIsUrlEdit(true)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors">
                    <Edit3 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <a 
              href="/installation-guide" 
              className="block w-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-all" />
              <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                    <Settings size={32} className="text-white" />
                  </div>
                  <div>
                    <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-white/20">
                      Official Settings Guide
                    </div>
                    <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-1">
                      ⚙️ 플랫폼별 상세 세팅 가이드 보기
                    </h4>
                    <p className="text-indigo-100 font-medium text-sm">
                      티스토리, 워드프레스, 블로그스팟 등 각 플랫폼별 정확한 세팅 방법은 설치 가이드에서 확인하세요.
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center shrink-0 group-hover:translate-x-2 transition-transform shadow-lg">
                  <ArrowRight size={20} />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
