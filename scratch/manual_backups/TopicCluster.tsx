import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  Layers, Plus, BarChart3, ChevronRight, 
  Target, Zap, ArrowLeft, MoreHorizontal,
  Link2, CheckCircle2, Globe, Sparkles, Eye, X,
  Network, Share2, Hexagon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";
import { toast } from "sonner";
import { fetchApi } from "../lib/api";

export default function TopicCluster() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get("site_id");

  const [site, setSite] = useState<any>(null);
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState(false);
  
  // Create Form State
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    if (user && siteId) {
      fetchSite();
      fetchClusters();
    }
  }, [user, siteId]);

  const fetchSite = async () => {
    const { data } = await supabase
      .from('ms_sites')
      .select('*')
      .eq('id', siteId)
      .single();
    if (data) setSite(data);
  };

  const fetchClusters = async () => {
    try {
      setLoading(true);
      const res = await fetchApi(`/api/dashboard/clusters?site_id=${siteId}`) as any;
      if (res?.success) {
        setClusters(res.data);
      }
    } catch (e) {
      toast.error("클러스터 데이터를 가져오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCluster = async () => {
    if (!newName) return toast.error("클러스터 이름을 입력해주세요.");
    try {
      const res = await fetchApi('/api/dashboard/clusters', {
        method: 'POST',
        body: JSON.stringify({
          site_id: siteId,
          name: newName,
          description: newDesc,
          niche: site?.niche
        })
      }) as any;
      if (res?.success) {
        toast.success("새 클러스터가 생성되었습니다.");
        setIsCreateModalOpen(false);
        setNewName("");
        setNewDesc("");
        fetchClusters();
      }
    } catch (e) {
      toast.error("클러스터 생성 실패");
    }
  };

  if (loading && clusters.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Layers className="text-indigo-500 w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-12">
           <button 
             onClick={() => navigate(-1)}
             className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-sm uppercase tracking-widest"
           >
             <ArrowLeft size={16} /> Dashboard
           </button>
           <button 
             onClick={() => setIsCreateModalOpen(true)}
             className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-indigo-100"
           >
             <Plus size={16} /> New Cluster
           </button>
        </div>

        <div className="mb-12">
           <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Network size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Topical Authority Engine</span>
           </div>
           <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900">TOPIC <span className="text-indigo-600">CLUSTERS</span></h1>
           <p className="text-slate-400 font-medium mt-2">Pillar-Cluster 구조를 통해 검색 엔진의 신뢰를 확보하고 주제 권위를 구축합니다.</p>
        </div>

        {/* Topic Authority Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Target size={12} className="text-indigo-600" /> Average Authority
             </div>
             <div className="text-3xl font-black italic text-slate-900">
                {Math.round(clusters.reduce((acc, c) => acc + (c.authority_score || 0), 0) / (clusters.length || 1))}%
             </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Plus size={12} className="text-emerald-600" /> Growth Potential
             </div>
             <div className="text-3xl font-black italic text-slate-900">
                +{100 - Math.round(clusters.reduce((acc, c) => acc + (c.authority_score || 0), 0) / (clusters.length || 1))}%
             </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Globe size={12} className="text-indigo-600" /> Active Clusters
             </div>
             <div className="text-3xl font-black italic text-slate-900">{clusters.length} <span className="text-sm font-bold text-slate-300 not-italic">Nodes</span></div>
          </div>
        </div>

        {/* Cluster List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {clusters.length > 0 ? (
            clusters.map((cluster, idx) => (
              <ClusterCard 
                key={cluster.id} 
                cluster={cluster} 
                index={idx} 
                onShowMap={() => {
                  setActiveClusterId(cluster.id);
                  setMapMode(true);
                }} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[48px] border border-dashed border-slate-200">
                <Layers size={64} className="text-slate-200 mb-6" />
                <h3 className="text-xl font-bold text-slate-400">아직 생성된 클러스터가 없습니다</h3>
                <p className="text-sm text-slate-500 mt-2">새 클러스터를 생성하여 주제 전문성을 강화하세요.</p>
            </div>
          )}
        </div>
      </div>

      {/* Visual Map Modal */}
      <AnimatePresence>
        {mapMode && activeClusterId && (
          <ClusterVisualizer 
            clusterId={activeClusterId} 
            onClose={() => setMapMode(false)} 
          />
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white border border-slate-100 rounded-[32px] p-10 z-[201] shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-indigo-600">
                   <Plus className="w-6 h-6" />
                   <h2 className="text-2xl font-black italic uppercase tracking-tight">New Cluster</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Cluster Name</label>
                    <input 
                      type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                      placeholder="예: 미국 주식 기초 가이드"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description (Optional)</label>
                    <textarea 
                      value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="이 클러스터의 목적을 입력하세요..."
                      className="w-full h-32 px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xs font-black text-slate-500 transition-all"
                  >
                    취소
                  </button>
                  <button 
                    onClick={handleCreateCluster}
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-xs font-black text-white transition-all shadow-lg shadow-indigo-100"
                  >
                    클러스터 생성
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const ClusterCard = ({ cluster, index, onShowMap }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewPost, setPreviewPost] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const score = Math.round((cluster.authority_score || 0) * 100);

  const handlePreview = async (postId: string) => {
    setIsLoadingPreview(true);
    try {
      const { data, error } = await supabase.from('ms_posts').select('title, content, html_content').eq('id', postId).single();
      if (error) throw error;
      if (data) setPreviewPost(data);
    } catch (e) {
      toast.error("미리보기를 불러올 수 없습니다.");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-slate-100 rounded-[40px] overflow-hidden group hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-50/50 transition-all"
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                <Layers className="text-indigo-600 w-6 h-6" />
             </div>
             <div>
                <h3 className="text-lg font-black tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors uppercase italic">{cluster.name}</h3>
                <p className="text-[10px] text-slate-400 font-medium">{cluster.description || "주제 요약 정보가 없습니다."}</p>
             </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onShowMap(); }}
              className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              title="비주얼 맵 보기"
            >
              <Network size={18} />
            </button>
            <button className="p-2 text-slate-300 hover:text-slate-600"><MoreHorizontal size={20}/></button>
          </div>
        </div>

        {/* Authority Meter */}
        <div className="space-y-3 mb-8">
           <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Topical Authority</span>
              <span className={`text-sm font-black italic ${score > 70 ? 'text-emerald-500' : score > 40 ? 'text-indigo-600' : 'text-slate-400'}`}>{score}%</span>
           </div>
           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full ${score > 70 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
              />
           </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
           <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <div className="text-xs font-black text-slate-800">{cluster.ms_posts?.length || 0}</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Posts</div>
           </div>
           <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <div className="text-xs font-black text-emerald-600">{(cluster.ms_posts?.filter((p: any) => p.is_indexed).length || 0)}</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Indexed</div>
           </div>
           <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
              <div className="text-xs font-black text-indigo-600">{(cluster.ms_posts?.reduce((acc: number, p: any) => acc + (p.gsc_ctr || 0), 0) / (cluster.ms_posts?.length || 1)).toFixed(1)}%</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Avg CTR</div>
           </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-slate-600 shadow-sm"
        >
          {isExpanded ? "상세 정보 닫기" : "연관 포스팅 확인"}
          <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-6"
            >
              <div className="space-y-2 pt-4 border-t border-slate-100">
                {cluster.ms_posts?.length > 0 ? (
                  cluster.ms_posts.map((post: any) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group/item">
                       <div className="flex items-center gap-3">
                          <Link2 size={14} className="text-slate-400 group-hover/item:text-indigo-600" />
                          <span className="text-xs font-medium text-slate-600 truncate max-w-[200px]">{post.title}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          {post.is_indexed ? (
                            <div className="px-2 py-0.5 bg-emerald-50 text-white text-[8px] font-black rounded uppercase">Indexed</div>
                          ) : (
                            <div className="px-2 py-0.5 bg-slate-200 text-slate-500 text-[8px] font-black rounded uppercase">Waiting</div>
                          )}
                          <span className="text-[10px] font-mono text-indigo-600">{(post.gsc_ctr || 0).toFixed(1)}%</span>
                          <button 
                             onClick={(e) => { e.stopPropagation(); handlePreview(post.id); }}
                             className="ml-2 p-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                             title="글 미리보기"
                           >
                             <Eye size={14} />
                           </button>
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[10px] text-slate-400 italic">연관된 포스팅이 없습니다.</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Modal */}
        <AnimatePresence>
          {previewPost && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setPreviewPost(null)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[85vh] bg-white border border-slate-100 rounded-[32px] p-8 z-[201] shadow-2xl flex flex-col"
              >
                <div className="flex justify-between items-start mb-6 shrink-0">
                  <h2 className="text-xl font-black text-slate-800 tracking-tight pr-8 leading-tight">{previewPost.title}</h2>
                  <button onClick={() => setPreviewPost(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shrink-0">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-4 prose prose-sm prose-slate max-w-none">
                  {previewPost.html_content ? (
                    <div dangerouslySetInnerHTML={{ __html: previewPost.html_content }} />
                  ) : (
                    <div className="whitespace-pre-wrap">{previewPost.content}</div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/**
 * [Phase 2] Cluster Visualizer
 * Radial Map of Pillar and Clusters
 */
function ClusterVisualizer({ clusterId, onClose }: { clusterId: string, onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [clusterId]);

  const fetchDetail = async () => {
    try {
      const res = await fetchApi(`/api/dashboard/clusters/${clusterId}`) as any;
      if (res?.success) setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return null;

  const pillar = data.ms_posts?.find((p: any) => p.is_pillar) || data.ms_posts?.[0];
  const supporting = data.ms_posts?.filter((p: any) => p.id !== pillar?.id) || [];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[300]" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotateX: 20 }} 
        animate={{ opacity: 1, scale: 1, rotateX: 0 }} 
        exit={{ opacity: 0, scale: 0.9, rotateX: 20 }}
        className="fixed inset-10 bg-white/5 border border-white/10 rounded-[60px] z-[301] overflow-hidden flex flex-col items-center justify-center p-20"
      >
        <button onClick={onClose} className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
          <X size={24} />
        </button>

        <div className="absolute top-10 left-10">
           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Topical Authority Visualization</span>
           <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{data.name} <span className="text-indigo-500">MAP</span></h2>
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
           {/* Center: Pillar */}
           <motion.div 
             initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
             className="relative z-10 w-48 h-48 bg-indigo-600 rounded-[40px] shadow-[0_0_50px_rgba(79,70,229,0.5)] flex flex-col items-center justify-center p-6 text-center border-4 border-white/20"
           >
              <Hexagon className="text-white/50 w-10 h-10 mb-3" />
              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Pillar Content</span>
              <span className="text-xs font-black text-white leading-tight">{pillar?.title || "No Pillar Post"}</span>
           </motion.div>

           {/* Orbiting: Supporting Clusters */}
           {supporting.map((post: any, i: number) => {
             const angle = (i / supporting.length) * (Math.PI * 2);
             const radius = 280;
             const x = Math.cos(angle) * radius;
             const y = Math.sin(angle) * radius;

             return (
               <div key={post.id}>
                 {/* Connection Line */}
                 <motion.div 
                   initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                   style={{ 
                     position: 'absolute', 
                     width: radius, 
                     height: 1, 
                     background: 'linear-gradient(to right, rgba(99, 102, 241, 0.5), transparent)', 
                     transformOrigin: 'left center',
                     left: '50%',
                     top: '50%',
                     rotate: `${(angle * 180) / Math.PI}deg`
                   }}
                 />
                 <motion.div 
                   initial={{ opacity: 0, x: 0, y: 0 }} 
                   animate={{ opacity: 1, x, y }} 
                   transition={{ type: 'spring', delay: 0.3 + i * 0.1 }}
                   className="absolute w-40 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex flex-col items-start gap-2 group hover:bg-white/20 transition-all cursor-pointer"
                 >
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${post.is_indexed ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                       <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">Cluster Node</span>
                    </div>
                    <span className="text-[10px] font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">{post.title}</span>
                 </motion.div>
               </div>
             );
           })}

           {supporting.length === 0 && (
             <div className="text-white/30 text-xs font-black italic uppercase tracking-widest">
                No supporting nodes found yet.
             </div>
           )}
        </div>

        <div className="absolute bottom-10 flex gap-10">
           <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white italic">{Math.round((data.authority_score || 0) * 100)}%</span>
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Authority Score</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white italic">{data.ms_posts?.length || 0}</span>
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Total Posts</span>
           </div>
        </div>
      </motion.div>
    </>
  );
}
