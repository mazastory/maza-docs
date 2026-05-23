import React, { useState } from 'react';
import { CheckCircle2, Coins, Camera, ArrowRight, ArrowLeft } from 'lucide-react';
import { TabGroup } from '../DocsUI';

export default function ChapterUsage() {
  const [usageTab, setUsageTab] = useState<'autotext' | 'snapblog' | 'authority'>('autotext');
  const [ch3Slide, setCh3Slide] = useState(0);

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      <div className="flex justify-center pb-8">
        <TabGroup 
          tabs={[
            { id: 'autotext', label: 'AI 자동 포스팅' },
            { id: 'snapblog', label: '비전 스냅블로그' },
            { id: 'authority', label: '시리즈 & 최적화' }
          ]} 
          active={usageTab} 
          onChange={(id) => setUsageTab(id as 'autotext' | 'snapblog' | 'authority')} 
        />
      </div>

      {usageTab === 'autotext' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-800">애드센스 승인 공식 (Winning Blueprint)</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AdSense Approval Formula</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl space-y-4 text-slate-700">
              <p className="text-xs font-bold leading-relaxed italic">
                "사람에게 실제로 유용하며, 가독성 높은 표와 FAQ를 구비한 충실한 독립 매체"
              </p>
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>최소 글자수</span>
                  <span className="text-indigo-600">1,500 ~ 2,500자</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span>필수 구조</span>
                  <span className="text-indigo-600">H2/H3 태그 2개 이상, 표, FAQ 포함</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Coins size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-800">고수익 키워드 금고 (High-CPC Vault)</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">API-Free High-CPC Shuffling</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "금융 & 지원금", desc: "소상공인 정책자금" },
                { title: "보험 & 세금", desc: "실비보험 청구 서류" },
                { title: "IT & 라이선스", desc: "웹호스팅, AI 코딩 툴" },
                { title: "법률 & 부동산", desc: "양도소득세 비과세" }
              ].map((k, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs font-black text-indigo-600 mb-0.5">{k.title}</div>
                  <div className="text-[9px] text-slate-400 font-bold">{k.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {usageTab === 'snapblog' && (
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                 <Camera size={28} />
              </div>
              <div>
                 <h4 className="text-2xl font-black text-slate-900 tracking-tighter">비전 스냅블로그 (Vision snapBlog)</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Experience-First Protocol (E-01)</p>
              </div>
           </div>
           <p className="text-sm text-slate-600 leading-relaxed font-medium">
              구글은 AI가 기계적으로 쏟아내는 가짜 지식보다 **인간이 실제로 체험하고 남긴 독창적인 기록(Experience)**을 훨씬 더 신뢰하며 노출 순위를 대폭 우대합니다.
              스냅블로그는 모바일 기기로 직접 찍은 일상 사진을 수익형 블로그의 최고급 자산으로 즉각 가공하는 에이전트 시스템입니다.
           </p>
        </div>
      )}

      {usageTab === 'authority' && (
        <div className="bg-slate-900 p-10 rounded-[48px] text-white space-y-6">
          <h5 className="text-xl font-black italic tracking-tighter">📅 Series Scheduling & Context Anchor (S-01)</h5>
          <p className="text-xs text-slate-400 leading-relaxed font-bold">
            구글 검색 로봇이 내 사이트에 오래 체류하고 페이지 전체를 인덱싱하게 만들려면, 단발성 글이 아닌 **상호 유기적인 시리즈형 글쓰기(S-01)**가 필수적입니다.
          </p>
        </div>
      )}
    </div>
  );
}
