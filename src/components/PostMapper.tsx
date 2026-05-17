import { useState, useEffect, useCallback } from "react";
import { 
  Plus, Globe, 
  Settings, CheckCircle2, Layout,
  Trash2, Database, Zap,
  ListOrdered, Calendar, TextQuote, Save,
  Sparkles, RotateCcw, Copy, ExternalLink
} from "lucide-react";
import { smartCopy } from "../lib/renderer";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { fetchApi } from "../lib/api";
import { supabase } from "../lib/supabase";

interface MappingTemplate {
  id: string;
  sourceCategory: string;
  targetSite: string;
  targetCategory: string;
  platform: 'Tistory' | 'WordPress' | 'Blogspot';
  status: 'Active' | 'Paused';
  scheduleMode: 'Instant' | 'Safe' | 'Daily' | 'Series' | 'Paused';
  keywords?: string[]; 
  posts?: any[];
}

interface SeriesData {
  id: string;
  title: string;
  status: string;
  keywords?: string[];
  category?: string;
}

export default function PostMapper() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<MappingTemplate[]>([]);
  const [showSeriesInput, setShowSeriesInput] = useState<string | null>(null);
  const [bulkKeywords, setBulkKeywords] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [sites, setSites] = useState<any[]>([]);

  // 1. 호이스팅을 활용한 함수 선언 (ReferenceError 절대 방지)
  async function fetchRecommendations() {
    if (!selectedSiteId || !user) return;
    setIsLoadingRecommendations(true);
    try {
      const res = await fetchApi("/api/generate/recommend-titles", {
        method: "POST",
        body: JSON.stringify({ site_id: selectedSiteId, user_id: user.id })
      });
      const result = await res.json();
      if (result.success) {
        setRecommendations(result.data.recommendations || []);
      }
    } catch (e) {
      console.error("Failed to fetch recommendations", e);
    } finally {
      setIsLoadingRecommendations(false);
    }
  }

  async function loadSeries() {
    if (!user) return;
    try {
      let realDomain = 'tistory.com';
      let realCategory = '일반';
      
      try {
        const siteRes = await fetchApi(`/api/sites`);
        const siteData = await siteRes.json();
        if (siteData.sites && siteData.sites.length > 0) {
          setSites(siteData.sites);
          if (!selectedSiteId) {
            setSelectedSiteId(siteData.sites[0].id);
            realDomain = siteData.sites[0].domain;
            realCategory = siteData.sites[0].category || siteData.sites[0].niche || '일반';
          } else {
            const currentSite = siteData.sites.find((s: any) => s.id === selectedSiteId);
            if (currentSite) {
              realDomain = currentSite.domain;
              realCategory = currentSite.category || currentSite.niche || '일반';
            }
          }
        }
      } catch (err) {
        console.warn("Failed to load sites:", err);
      }

      const res = await fetchApi(`/api/series?user_id=${user.id}`);
      const result = await res.json();
      if (result.success) {
        setTemplates(result.data.map((s: SeriesData) => ({
          id: s.id,
          sourceCategory: s.title,
          targetSite: realDomain,
          targetCategory: s.category || realCategory,
          platform: 'Tistory',
          status: s.status === 'active' ? 'Active' : 'Paused',
          scheduleMode: s.status === 'paused' ? 'Paused' : (s.keywords && s.keywords.length > 0 ? 'Series' : 'Safe'),
          keywords: s.keywords,
          posts: (s as any).ms_posts || []
        })));
      }
    } catch (e) {
      console.error("Failed to load series:", e);
    }
  }

  // 2. 효과(Effect) 정의
  useEffect(() => {
    if (user) {
      loadSeries();
    }
  }, [user, selectedSiteId]); // site 변경 시에도 다시 로드

  useEffect(() => {
    if (selectedSiteId) {
      fetchRecommendations();
    }
  }, [selectedSiteId]);

  // 3. 인터랙션 함수들
  async function addTemplate() {
    if (!user) return;
    try {
      const res = await fetchApi("/api/series", {
        method: "POST",
        body: JSON.stringify({
          user_id: user.id,
          title: '새 시리즈/주제',
          keywords: []
        })
      });
      const result = await res.json();
      if (result.success) {
        loadSeries();
        toast.success("새로운 배차 템플릿이 생성되었습니다.");
      }
    } catch (e) {
      toast.error("템플릿 생성 실패");
    }
  }

  async function removeTemplate(id: string) {
    try {
      const res = await fetchApi(`/api/series/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTemplates(templates.filter(t => t.id !== id));
        toast.info("템플릿이 삭제되었습니다.");
      }
    } catch (e) {
      toast.error("삭제 실패");
    }
  }

  async function toggleSchedule(id: string) {
    const template = templates.find(t => t.id === id);
    if (!template) return;

    const modes: MappingTemplate['scheduleMode'][] = ['Instant', 'Safe', 'Daily', 'Series', 'Paused'];
    const nextMode = modes[(modes.indexOf(template.scheduleMode) + 1) % modes.length];
    
    try {
      await fetchApi(`/api/series/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: nextMode === 'Paused' ? 'paused' : 'active'
        })
      });
      setTemplates(templates.map(t => t.id === id ? { ...t, scheduleMode: nextMode } : t));
      toast.info(`발행 모드가 ${nextMode}로 변경되었습니다.`);
    } catch (e) {
      toast.error("상태 변경 실패");
    }
  }

  async function handleManualPublish(template: MappingTemplate) {
    if (!template.posts || template.posts.length === 0) {
      toast.warning("발행 가능한 포스팅이 아직 생성되지 않았습니다.");
      return;
    }

    // 가장 최근에 생성된(또는 대기 중인) 포스트 선택
    const post = template.posts.find(p => p.status === 'generated' || p.status === 'ready') || template.posts[0];
    
    try {
      // 1. 상세 내용 페치 (html_content 필요)
      const { data, error } = await supabase
        .from('ms_posts')
        .select('*')
        .eq('id', post.id)
        .single();
      
      if (error || !data) throw new Error("포스트 내용을 불러올 수 없습니다.");

      // 2. 서식 복사
      const result = await smartCopy([{ type: 'text', content: data.html_content }], data.title);
      if (result.success) {
        toast.success("포스트 내용이 클립보드에 복사되었습니다!");
      }

      // 3. 블로그 링크 오픈
      const domain = template.targetSite || 'tistory.com';
      const blogUrl = `https://${domain.replace(/\/$/, '')}/manage/post`;
      window.open(blogUrl, '_blank');
      
      toast.info(`${domain} 관리자 페이지로 이동합니다.`);
    } catch (err: any) {
      toast.error(`수동 발행 준비 실패: ${err.message}`);
    }
  }

  async function saveSeries(id: string) {
    const kws = bulkKeywords.split(/[,|\n]/).map(k => k.trim()).filter(k => k);
    if (kws.length === 0) {
      toast.error("키워드를 입력해주세요.");
      return;
    }

    try {
      const res = await fetchApi(`/api/series/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ keywords: kws })
      });
      if (res.ok) {
        setTemplates(templates.map(t => t.id === id ? { ...t, keywords: kws, scheduleMode: 'Series' } : t));
        setBulkKeywords("");
        setShowSeriesInput(null);
        toast.success(`${kws.length}개의 키워드가 시리즈 예약 리스트에 등록되었습니다.`);
      }
    } catch (e) {
      toast.error("저장 실패");
    }
  }

  return (
    <div className="bg-white p-12 rounded-[56px] shadow-2xl border border-slate-100 space-y-12 animate-in fade-in duration-700">
       {/* HEADER */}
       <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-indigo-600">
                <ListOrdered size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">시리즈 자동 발행 엔진</span>
             </div>
             <h3 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">POST <span className="text-indigo-600">MAPPER</span></h3>
             <p className="text-slate-400 font-medium text-sm">키워드만 나열하세요. 마자가 날짜별로 쪼개서 시리즈 발행을 예약합니다.</p>
          </div>
          
          <button 
            onClick={addTemplate}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
          >
             <Plus size={18} /> 새 시리즈 배차 추가
          </button>
       </div>

       {/* AUTOMATION FLOW VIEW */}
       <div className="space-y-6">
          <div className="grid grid-cols-12 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
             <div className="col-span-4">발행 키워드 묶음 (시리즈)</div>
             <div className="col-span-3 text-center">자동화 제어</div>
             <div className="col-span-3">발행될 블로그</div>
             <div className="col-span-2 text-right">관리</div>
          </div>

          <div className="space-y-4">
             {templates.map((t) => (
               <div key={t.id} className="group p-1 bg-slate-50/50 border border-slate-100 rounded-[40px] hover:bg-white hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all">
                  <div className="grid grid-cols-12 items-center p-7">
                    {/* SOURCE / SERIES INFO */}
                    <div className="col-span-4 flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-white shadow-inner flex items-center justify-center text-indigo-600 font-black">
                          {t.scheduleMode === 'Series' ? <ListOrdered size={20} /> : <Database size={20} />}
                       </div>
                       <div className="space-y-1 min-w-0">
                          <div className="text-xs font-black text-slate-800 uppercase truncate">{t.sourceCategory}</div>
                          {t.keywords ? (
                            <div className="flex gap-1 items-center">
                               <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[8px] font-black">{t.keywords.length}개의 포스팅</span>
                               <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">시리즈 예약됨</span>
                            </div>
                          ) : (
                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">자동 배차 대기 중</div>
                          )}
                       </div>
                    </div>

                    {/* AUTOMATION CONTROL */}
                    <div className="col-span-3 flex flex-col items-center gap-2">
                       <button 
                         onClick={() => toggleSchedule(t.id)}
                         className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all flex items-center gap-2 shadow-sm ${
                           t.scheduleMode === 'Safe' ? 'bg-amber-500 text-white' : 
                           t.scheduleMode === 'Instant' ? 'bg-indigo-600 text-white' : 
                           t.scheduleMode === 'Series' ? 'bg-indigo-900 text-white' :
                           t.scheduleMode === 'Paused' ? 'bg-slate-400 text-white' :
                           'bg-emerald-500 text-white'
                         }`}
                       >
                          <Settings size={12} className={t.scheduleMode !== 'Series' ? "animate-spin-slow" : ""} />
                          {t.scheduleMode === 'Instant' ? '즉시 발행' : 
                           t.scheduleMode === 'Safe' ? '안전 발행' : 
                           t.scheduleMode === 'Series' ? '시리즈 발행' : 
                           t.scheduleMode === 'Paused' ? '일시 정지' : t.scheduleMode}
                       </button>
                       <div className="flex items-center gap-1">
                          <Calendar size={10} className="text-slate-300" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {t.scheduleMode === 'Series' ? '순차적 날짜 예약' : '자동 스케줄링'}
                          </span>
                       </div>
                    </div>

                    {/* TARGET */}
                    <div className="col-span-3 flex items-center gap-6">
                       <div className="space-y-1 text-right flex-1">
                          <div className="text-xs font-black text-slate-800">{t.targetSite}</div>
                          <div className="flex items-center justify-end gap-2">
                             <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[8px] font-black uppercase tracking-widest">{t.platform}</span>
                             <span className="text-[10px] font-bold text-slate-400 italic">#{t.targetCategory}</span>
                          </div>
                       </div>
                       <div className="w-12 h-12 rounded-2xl bg-white shadow-inner flex items-center justify-center text-slate-400">
                          <Globe size={20} />
                       </div>
                    </div>

                     {/* ACTIONS */}
                     <div className="col-span-2 flex justify-end gap-2">
                        <button 
                           onClick={async () => {
                              if (!t.keywords || t.keywords.length === 0) {
                                 toast.warning("먼저 시리즈 리스트를 저장해주세요.");
                                 return;
                              }
                              try {
                                 const res = await fetchApi(`/api/series/${t.id}/schedule`, { method: 'POST' });
                                 const result = await res.json();
                                 if (result.success) {
                                    toast.success("포스팅 발행 프로세스가 즉시 시작되었습니다!");
                                 } else {
                                    toast.error(result.error || result.message || "발행 대기 중입니다 (W-05 쿨타임 확인 필요)");
                                 }
                              } catch (err: any) {
                                 toast.error(`발행 요청 실패: ${err.message}`);
                              }
                           }}
                           disabled={!t.keywords || t.keywords.length === 0}
                           className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${
                              (!t.keywords || t.keywords.length === 0) 
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                              : 'bg-slate-900 text-white hover:bg-indigo-600'
                           }`}
                        >
                           <Zap size={12} className={(!t.keywords || t.keywords.length === 0) ? "text-slate-400" : "text-yellow-400"} /> 즉시 시작
                        </button>
                        <button 
                           onClick={() => handleManualPublish(t)}
                           className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
                           title="서식 복사 & 블로그 이동"
                        >
                           <Copy size={16} />
                        </button>
                        <button 
                          onClick={() => setShowSeriesInput(showSeriesInput === t.id ? null : t.id)}
                          className={`p-3 border rounded-xl transition-all shadow-sm ${showSeriesInput === t.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-600'}`}
                        >
                           <TextQuote size={16} />
                        </button>
                        <button 
                          onClick={() => removeTemplate(t.id)}
                          className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-600 transition-all shadow-sm"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>

                  {/* SERIES KEYWORD INPUT AREA */}
                  <AnimatePresence>
                    {showSeriesInput === t.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8 space-y-4"
                      >
                         <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 space-y-4">
                            <div className="flex justify-between items-center">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">벌크 키워드 입력 (엔터 또는 콤마로 구분)</label>
                               <span className="text-[9px] font-bold text-indigo-600">시리즈 모드 활성화됨</span>
                            </div>
                            <textarea 
                              value={bulkKeywords}
                              onChange={(e) => setBulkKeywords(e.target.value)}
                              placeholder="정부지원자금 노하우&#10;정부지원금 대상 확인&#10;정부지원금 신청방법"
                              className="w-full h-32 bg-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                            />
                            <div className="flex justify-between items-center">
                               <p className="text-[10px] text-slate-400 italic">입력된 키워드 순서대로 발행일이 자동 예약됩니다.</p>
                               <button 
                                 onClick={() => saveSeries(t.id)}
                                 className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                               >
                                  <Save size={14} /> 시리즈 리스트 저장
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* SERIES QUEUE PREVIEW */}
                  {t.keywords && t.keywords.length > 0 && !showSeriesInput && (
                    <div className="px-8 pb-8 overflow-x-auto">
                       <div className="flex gap-2 pb-2">
                          {t.keywords.map((kw, i) => (
                            <div key={i} className="flex-shrink-0 px-4 py-2 bg-white border border-slate-100 rounded-xl flex items-center gap-3 shadow-sm group/item">
                               <span className="text-[10px] font-black text-indigo-600">#{i+1}</span>
                               <span className="text-[11px] font-bold text-slate-700">{kw}</span>
                               <div className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{i === 0 ? '오늘' : `${i}일 후`}</div>
                            </div>
                          ))}
                          <div className="flex-shrink-0 px-4 py-2 bg-slate-100/50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                             <Plus size={14} />
                          </div>
                       </div>
                    </div>
                  )}

                  {/* SAFETY TIMER DECORATION */}
                  {(t.scheduleMode === 'Safe' || t.scheduleMode === 'Series') && (
                    <div className="px-8 pb-6 flex items-center justify-between border-t border-slate-50 pt-4">
                       <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                             {[...Array(3)].map((_, i) => (
                               <div key={i} className={`w-1.5 h-1.5 rounded-full ${t.scheduleMode === 'Series' ? 'bg-indigo-600' : 'bg-amber-500'} animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }} />
                             ))}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${t.scheduleMode === 'Series' ? 'text-indigo-600' : 'text-amber-600'}`}>
                            {t.scheduleMode === 'Series' ? `시리즈 모드: 순차적 배차 발행 예약 중 (${t.keywords?.length || 0}개 대기)` : '안전 간격 유지 중 — 3시간마다 하나씩 발행됩니다'}
                          </span>
                       </div>
                       <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">W-05 보안 규약 준수</span>
                    </div>
                  )}
               </div>
             ))}
          </div>
       </div>

       {/* STRATEGY HUB: AI Recommendations */}
       <div className="p-10 bg-indigo-50/30 rounded-[48px] border border-indigo-100 space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                   <Sparkles size={24} />
                </div>
                <div>
                   <h4 className="text-xl font-black text-slate-900 italic tracking-tight uppercase">Strategy Hub <span className="text-indigo-600">Beta</span></h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI가 제안하는 고수익 시리즈 테마</p>
                </div>
             </div>

             <div className="flex items-center gap-3">
                <select 
                   value={selectedSiteId}
                   onChange={(e) => setSelectedSiteId(e.target.value)}
                   className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                >
                   {sites.map(site => (
                     <option key={site.id} value={site.id}>{site.title}</option>
                   ))}
                </select>
                <button 
                   onClick={fetchRecommendations}
                   disabled={isLoadingRecommendations}
                   className="p-2.5 bg-white border border-slate-200 hover:border-indigo-600 rounded-xl transition-all shadow-sm group"
                >
                   <RotateCcw size={16} className={`${isLoadingRecommendations ? 'animate-spin' : 'group-hover:rotate-180'} text-slate-400 transition-transform duration-500`} />
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {isLoadingRecommendations ? (
                Array.from({ length: 3 }).map((_, i) => (
                   <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-slate-100" />
                ))
             ) : (
                recommendations.slice(0, 3).map((rec, i) => (
                   <div 
                     key={i} 
                     className="group bg-white p-6 rounded-[32px] border border-slate-100 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all space-y-4"
                   >
                      <div className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-widest w-fit">Topic Suggestion</div>
                      <h5 className="text-sm font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{rec.title}</h5>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2">{rec.reason}</p>
                      <button 
                         onClick={() => {
                            setBulkKeywords(prev => prev + (prev ? "\n" : "") + rec.title);
                            toast.success(`[${rec.title}] 주제가 예약 대기열에 추가되었습니다.`, {
                               description: "하단에서 '시리즈 리스트 저장'을 눌러 확정하세요."
                            });
                            if (templates.length > 0 && !showSeriesInput) {
                               setShowSeriesInput(templates[0].id);
                            }
                         }}
                         className="w-full py-3 bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                         <Plus size={14} /> 예약 목록에 추가
                      </button>
                   </div>
                ))
             )}
          </div>
       </div>

       {/* SYSTEM STATUS FOOTER */}
       <div className="grid md:grid-cols-3 gap-6 pt-10">
          <div className="p-8 bg-indigo-600 rounded-[40px] text-white space-y-4 shadow-2xl shadow-indigo-100">
             <div className="flex items-center gap-3">
                <ListOrdered size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">시리즈 오케스트레이터</span>
             </div>
             <h4 className="text-2xl font-black italic tracking-tighter uppercase underline decoration-white/30 underline-offset-4">SERIES MODE ON</h4>
             <p className="text-indigo-100 text-[11px] font-medium leading-relaxed">
                키워드 뭉치를 던져주세요. 마자가 카테고리별로 정렬하여 가장 완벽한 타이밍에 하나씩 발행합니다.
             </p>
          </div>
          
          <div className="p-8 bg-white border border-slate-100 rounded-[40px] space-y-4">
             <div className="flex items-center gap-3 text-slate-400">
                <Layout size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">현재 대기열 상태</span>
             </div>
             <div className="text-3xl font-black italic tracking-tighter text-slate-900 italic uppercase">
                {templates.reduce((acc, t) => acc + (t.keywords?.length || 0), 0)} <span className="text-xs text-indigo-600 not-italic font-bold">건 예약됨</span>
             </div>
             <div className="flex gap-2">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase rounded border border-indigo-100">다음 발행: {templates[0]?.keywords?.[0] || '없음'}</span>
             </div>
          </div>

          <div className="p-8 bg-white border border-slate-100 rounded-[40px] space-y-4">
             <div className="flex items-center gap-3 text-slate-400">
                <CheckCircle2 size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">수익 최적화 상태</span>
             </div>
             <div className="text-3xl font-black italic tracking-tighter text-slate-900 italic uppercase">TOPICAL <span className="text-xs text-emerald-500 not-italic font-bold">AUTHORITY</span></div>
             <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-emerald-500" />
             </div>
          </div>
       </div>
    </div>
  );
}
