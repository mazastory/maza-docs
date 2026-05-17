import { useState, useEffect } from "react";
import { 
  Plus, Trash2, ChevronDown, LayoutGrid, 
  Settings, Target, ShieldCheck, PenTool, Search, 
  CheckCircle2, Info, MousePointer2, Zap, Star,
  Menu, GripVertical
} from "lucide-react";
import { toast } from "sonner";
import { ATOMIC_TOOLS } from "../constants/navigation";

// Import atomic components
import NicheHunter from "../components/NicheHunter";
import AIWriter from "../components/AIWriter";
import SeoScorePanel from "../components/SeoScorePanel";
import EEATRefiner from "../components/EEATRefiner";
import VisionEngine from "../components/VisionEngine";
import AutopilotDashboard from "./AutopilotDashboard";
import KnowledgeHub from "./KnowledgeHub";

const TOOL_LABELS: Record<string, { name: string, desc: string }> = {
  niche: { name: "니치 헌터 (주제 발굴)", desc: "승인 정답지 및 고수익 주제 라이브러리" },
  writer: { name: "AI 글쓰기 (텍스트)", desc: "지능형 자동 텍스트 집필 및 본문 생성" },
  validator: { name: "SEO 정밀 진단기", desc: "SEO 점수 실시간 진단 및 최적화 가이드" },
  vision: { name: "스냅블로그 (사진블로그)", desc: "실제 경험 사진 분석 및 스토리텔링 집필" },
  refiner: { name: "EEAT 최적화 엔진", desc: "글 품질 개선 및 휴머나이징(EEAT) 강화" },
  autopilot: { name: "오토파일럿 관제", desc: "전체 사이트 자동 발행 상태 및 스케줄링 통합 제어" },
  knowledge: { name: "수익화 지식 허브", desc: "다계정, 서브도메인, 구글 정책 등 수익화 필독 FAQ" }
};

export default function CustomLab() {
  const [activeWorkflow, setActiveWorkflow] = useState<string[]>([]);
  const [selectedToolId, setSelectedToolId] = useState<string>("niche");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  // validator 도구에 사용할 마지막 생성 포스트 샘플
  const [validatorPost, setValidatorPost] = useState<{ title: string; blocks: any[]; html?: string; wordCount?: number } | null>(null);
  const [validatorKeyword, setValidatorKeyword] = useState<string>("");

  useEffect(() => {
    // URL 쿼리 파라미터로 초기 탭 선택 지원 (?tool=writer 등)
    const params = new URLSearchParams(window.location.search);
    const toolParam = params.get('tool');
    if (toolParam && ATOMIC_TOOLS.some(t => t.id === toolParam)) {
      setSelectedToolId(toolParam);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('maza_custom_workflow');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out invalid tools
          const validWorkflow = parsed.filter(id => ATOMIC_TOOLS.some(t => t.id === id));
          setActiveWorkflow(validWorkflow);
          if (validWorkflow.length > 0 && !new URLSearchParams(window.location.search).get('tool')) {
            setSelectedToolId(validWorkflow[0]);
          }
        }
      }
    } catch (e) {
      console.error("[CustomLab] Workflow load failed:", e);
      localStorage.removeItem('maza_custom_workflow');
    }
  }, []);

  // Ensure selectedToolId is always valid
  useEffect(() => {
    if (selectedToolId && !ATOMIC_TOOLS.some(t => t.id === selectedToolId)) {
      setSelectedToolId("niche");
    }
  }, [selectedToolId]);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setSelectedToolId('writer');
    toast.success(`[${topic}] 주제가 집필 엔진으로 전송되었습니다.`);
  };

  const toggleWorkflow = (toolId: string) => {
    let newWorkflow;
    if (activeWorkflow.includes(toolId)) {
      newWorkflow = activeWorkflow.filter(id => id !== toolId);
      toast.info("워크플로우에서 해제되었습니다.");
    } else {
      newWorkflow = [...activeWorkflow, toolId];
      toast.success("워크플로우에 추가되었습니다.");
    }
    setActiveWorkflow(newWorkflow);
    localStorage.setItem('maza_custom_workflow', JSON.stringify(newWorkflow));
  };

  const moveTool = (idx: number, direction: 'up' | 'down') => {
    const newWorkflow = [...activeWorkflow];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newWorkflow.length) return;
    [newWorkflow[idx], newWorkflow[targetIdx]] = [newWorkflow[targetIdx], newWorkflow[idx]];
    setActiveWorkflow(newWorkflow);
    localStorage.setItem('maza_custom_workflow', JSON.stringify(newWorkflow));
  };

  return (
    <div className="flex h-[calc(100vh-60px)] bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar: Control Panel (320px) */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-8 border-b border-slate-100">
           <div className="flex items-center gap-2 mb-3">
              <div className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black uppercase rounded tracking-widest">설계자</div>
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">워크플로우 제어</div>
           </div>
           <h1 className="text-xl font-black text-slate-800 italic tracking-tighter uppercase">마이 <span className="text-indigo-600">커스텀</span></h1>
        </div>

        <div className="flex-1 overflow-y-auto">
           {/* MY WORKFLOW (ACTIVE) */}
           <div className="p-4 space-y-1">
              <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">현재 사용 중인 도구</div>
              {activeWorkflow.map((toolId, idx) => {
                const tool = ATOMIC_TOOLS.find(t => t.id === toolId);
                if (!tool) return null;
                const label = TOOL_LABELS[toolId] || { name: tool.name, desc: tool.desc };
                return (
                  <div key={`${toolId}-${idx}`} className={`group rounded-2xl transition-all border-2 flex items-center pr-2 ${selectedToolId === toolId ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' : 'bg-white border-slate-50 hover:border-slate-100'}`}>
                    {/* LEFT: Gold Star Pin */}
                    <button onClick={() => toggleWorkflow(toolId)} className="p-4 text-amber-400 flex-shrink-0">
                       <Star size={18} fill="currentColor" />
                    </button>
                    
                    <button onClick={() => setSelectedToolId(toolId)} className="flex-1 py-4 flex flex-col text-left min-w-0">
                       <div className={`text-[11px] font-black uppercase tracking-tight truncate ${selectedToolId === toolId ? 'text-white' : 'text-slate-800'}`}>{label.name}</div>
                       <div className={`text-[9px] font-bold truncate ${selectedToolId === toolId ? 'text-indigo-200' : 'text-slate-400'}`}>STEP {String(idx+1).padStart(2,'0')}</div>
                    </button>

                    {/* RIGHT: Grip Handle Controls */}
                    <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => moveTool(idx, 'up')} className={`p-1 rounded ${selectedToolId === toolId ? 'hover:bg-white/10' : 'hover:bg-slate-100 text-slate-300'}`}><ChevronDown size={12} className="rotate-180" /></button>
                       <div className={`p-1 ${selectedToolId === toolId ? 'text-white/30' : 'text-slate-200'}`}><Menu size={12} /></div>
                       <button onClick={() => moveTool(idx, 'down')} className={`p-1 rounded ${selectedToolId === toolId ? 'hover:bg-white/10' : 'hover:bg-slate-100 text-slate-300'}`}><ChevronDown size={12} /></button>
                    </div>
                  </div>
                );
              })}
           </div>

           {/* LIBRARY (INACTIVE) */}
           <div className="p-4 pt-0 space-y-1 border-t border-slate-100 mt-2">
              <div className="px-4 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">도구 보관함</div>
              {ATOMIC_TOOLS.filter(t => !activeWorkflow.includes(t.id)).map((tool) => {
                const label = TOOL_LABELS[tool.id] || { name: tool.name, desc: tool.desc };
                return (
                  <div key={tool.id} className={`group rounded-2xl transition-all border-2 flex items-center ${selectedToolId === tool.id ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50/50 border-transparent hover:bg-slate-50'}`}>
                    <button onClick={() => toggleWorkflow(tool.id)} className="p-4 text-slate-200 hover:text-amber-400 transition-colors">
                       <Star size={18} />
                    </button>
                    <button onClick={() => setSelectedToolId(tool.id)} className="flex-1 py-4 text-left min-w-0">
                       <div className="text-[11px] font-black text-slate-400 uppercase tracking-tight truncate">{label.name}</div>
                    </button>
                  </div>
                );
              })}
           </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
           <p className="text-[10px] text-slate-400 font-bold leading-relaxed italic">≡ 핸들 근처의 화살표로 순서를 조절하세요.</p>
        </div>
      </div>

      {/* Main Stage: Execution */}
      <div className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
         <div className="max-w-5xl mx-auto">
            {selectedToolId ? (
              <div className="animate-fade-in space-y-10">
                 <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                    <div className="space-y-1">
                       <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">
                         {TOOL_LABELS[selectedToolId]?.name || ATOMIC_TOOLS.find(t => t.id === selectedToolId)?.name}
                       </h2>
                       <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{TOOL_LABELS[selectedToolId]?.desc}</p>
                    </div>
                    {activeWorkflow.includes(selectedToolId) && (
                       <div className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-100">
                          <Star size={14} fill="currentColor" /> 워크플로우에 포함됨
                       </div>
                    )}
                 </div>
                 
                 <div className="min-h-[600px]">
                    {selectedToolId === 'niche' && <NicheHunter onSelect={handleTopicSelect} />}
                    {selectedToolId === 'writer' && <AIWriter initialTopic={selectedTopic} />}
                    {selectedToolId === 'vision' && <VisionEngine initialTopic={selectedTopic} />}
                    {selectedToolId === 'refiner' && <EEATRefiner />}
                    {selectedToolId === 'autopilot' && <AutopilotDashboard isIntegrated={true} />}
                    {selectedToolId === 'knowledge' && <KnowledgeHub />}
                    
                    {selectedToolId === 'validator' && (
                       <div className="space-y-6">
                         <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                           <p className="text-xs font-bold text-slate-500 mb-4">SEO 점수를 확인할 키워드를 입력하세요:</p>
                           <div className="flex gap-3">
                             <input
                               type="text"
                               placeholder="예: 아이폰 16 리뷰"
                               value={validatorKeyword}
                               onChange={e => setValidatorKeyword(e.target.value)}
                               className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                             />
                             <button
                               onClick={() => {
                                 const saved = localStorage.getItem('maza_last_post');
                                 if (saved) {
                                   try { setValidatorPost(JSON.parse(saved)); } catch {}
                                 } else {
                                   toast.info('AI Writer로 먼저 글을 생성하리시면 자동으로 불러옵니다.');
                                 }
                               }}
                               className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all"
                             >
                               분석 시작
                             </button>
                           </div>
                         </div>
                         {validatorPost ? (
                           <SeoScorePanel post={validatorPost} keyword={validatorKeyword} />
                         ) : (
                           <div className="bg-white p-16 rounded-[48px] shadow-xl border border-slate-100 text-center space-y-4">
                             <div className="w-16 h-16 bg-indigo-50 text-indigo-300 rounded-[24px] flex items-center justify-center mx-auto">
                               <CheckCircle2 size={32} />
                             </div>
                             <p className="text-sm font-bold text-slate-400">AI Writer로 작성된 글이 있으면 자동으로 불러와 SEO 점수를 실시간으로 진단합니다.</p>
                           </div>
                         )}
                       </div>
                    )}
                   </div>
                </div>
            ) : (
               <div className="py-40 flex flex-col items-center justify-center space-y-6 text-slate-300">
                  <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                    <MousePointer2 size={40} className="animate-bounce" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-black italic tracking-tighter uppercase text-slate-400">도구 선택 대기 중</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1">사이드바에서 도구를 선택하여 설계를 시작하세요.</p>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
