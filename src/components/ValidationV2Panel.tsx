/**
 * 🛡️ Validation Engine v2 Panel
 * AdSense Approval Probability & Advanced Quality Analysis
 */

import { ShieldCheck, BrainCircuit, Fingerprint, Search, Layers, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";

interface ValidationV2PanelProps {
  result: {
    overallScore: number;
    semanticDuplication: { score: number; similarity: number; isDuplicate: boolean; detail: string };
    aiFootprint: { score: number; risk: 'low' | 'medium' | 'high'; patterns: string[]; detail: string };
    searchIntent: { score: number; intent: string; isMatched: boolean; detail: string };
    topicDepth: { score: number; authorityScore: number; coverage: string[]; suggestions: string[] };
  };
}

export default function ValidationV2Panel({ result }: ValidationV2PanelProps) {
  if (!result) return null;

  const { overallScore, semanticDuplication, aiFootprint, searchIntent, topicDepth } = result;

  const getRiskColor = (risk: string) => {
    if (risk === 'low') return 'text-emerald-500 bg-emerald-50';
    if (risk === 'medium') return 'text-amber-500 bg-amber-50';
    return 'text-red-500 bg-red-50';
  };

  return (
    <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-8 border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="text-xl font-black italic tracking-tight">AdSense Probability</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">승인 가능성 엔진 v2.0 분석</p>
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black italic text-indigo-400">{overallScore}<span className="text-sm not-italic text-slate-500 ml-1">/100</span></div>
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Quality Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Semantic Duplication */}
        <div className="bg-slate-800/50 rounded-3xl p-5 border border-slate-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
              <BrainCircuit size={16} />
              <span className="text-[11px] font-black uppercase tracking-wider">의미적 중복 검사</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${semanticDuplication.isDuplicate ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {semanticDuplication.isDuplicate ? '중복 위험' : '독창성 확보'}
            </span>
          </div>
          <p className="text-[12px] text-slate-300 font-medium leading-relaxed">
            {semanticDuplication.detail}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${Math.round(semanticDuplication.similarity * 100)}%` }} />
            </div>
            <span className="text-[10px] font-bold text-slate-500">{Math.round(semanticDuplication.similarity * 100)}%</span>
          </div>
        </div>

        {/* AI Footprint */}
        <div className="bg-slate-800/50 rounded-3xl p-5 border border-slate-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
              <Fingerprint size={16} />
              <span className="text-[11px] font-black uppercase tracking-wider">AI 흔적 탐지</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRiskColor(aiFootprint.risk)}`}>
              {aiFootprint.risk.toUpperCase()} RISK
            </span>
          </div>
          <p className="text-[12px] text-slate-300 font-medium leading-relaxed">
            {aiFootprint.detail}
          </p>
          <div className="flex flex-wrap gap-1">
            {aiFootprint.patterns.map((p, i) => (
              <span key={i} className="text-[8px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-md">{p}</span>
            ))}
          </div>
        </div>

        {/* Search Intent */}
        <div className="bg-slate-800/50 rounded-3xl p-5 border border-slate-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
              <Search size={16} />
              <span className="text-[11px] font-black uppercase tracking-wider">검색 의도 분석</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{searchIntent.intent}</span>
          </div>
          <p className="text-[12px] text-slate-300 font-medium leading-relaxed">
            {searchIntent.detail}
          </p>
          <div className="flex items-center gap-1 text-[10px] font-bold">
            {searchIntent.isMatched ? (
              <><CheckCircle2 size={12} className="text-emerald-500" /> <span className="text-emerald-500">Intent Matched</span></>
            ) : (
              <><AlertTriangle size={12} className="text-amber-500" /> <span className="text-amber-500">Intent Mismatch</span></>
            )}
          </div>
        </div>

        {/* Topic Depth */}
        <div className="bg-slate-800/50 rounded-3xl p-5 border border-slate-700/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
              <Layers size={16} />
              <span className="text-[11px] font-black uppercase tracking-wider">주제 권위 (Authority)</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">{topicDepth.authorityScore}% Depth</span>
          </div>
          <div className="space-y-1">
            {topicDepth.suggestions.slice(0, 2).map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                <span className="text-[10px] text-slate-400 leading-tight">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <Info size={20} />
        </div>
        <p className="text-[11px] font-medium text-slate-400 leading-normal">
          <strong className="text-indigo-300">Pro Tip:</strong> 2026년 구글은 AI가 쓴 정보 나열보다 유저의 실제 사진과 경험담(Experiential Intent)이 포함된 글에 압도적인 가중치를 부여합니다.
        </p>
      </div>
    </div>
  );
}
