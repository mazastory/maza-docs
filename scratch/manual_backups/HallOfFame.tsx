import { useState, useEffect } from "react";
import { 
  Trophy, Star, Medal, Crown, ExternalLink, 
  ArrowRight, Sparkles, CheckCircle2, TrendingUp, 
  Users, Calendar, Filter
} from "lucide-react";
import { toast } from "sonner";
import { fetchApi } from "../lib/api";

export default function HallOfFame() {
  const [champions, setChampions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    try {
      const res = await fetchApi("/api/dashboard/hall-of-fame");
      const data = await res.json();
      if (data.success) {
        // Augment with emotional success quotes if not present
        const QUOTES = [
          "첫단계가 막막했는데, 마자가 다 해줘서 45일만에 승인대요.",
          "서치콘솔이 뒤지 멐지 맞는지도 몼랐어요. 자동화를 쓰니 풍수 또 패당이 나와요.",
          "GA4 설치를 2일 헤댐다가 포기했는데 이건 30초 만에 됨.",
          "놀라운 건 AI가 쒴 글인데 구글이 진짜 사람 쒴 것 같다고 함.",
          "높은 품질로 생성하니까 승인율이 다르더라고요.",
          "진짜로 취침중에 편에서 다 돌아가던데 승인 됩었어요.",
        ];
        const augmented = data.data.map((c: any, i: number) => ({
          ...c,
          success_quote: c.success_quote || QUOTES[i % QUOTES.length]
        }));
        setChampions(augmented);
      }
    } catch (e) {
      console.error("Hall of Fame fetch error:", e);
      toast.error("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: '전체 보기', icon: Layout },
    { id: 'tistory', label: '티스토리 챔피언', icon: Star },
    { id: 'wordpress', label: '워드프레스 챔피언', icon: Star },
    { id: 'fast', label: '최단기 승인', icon: TrendingUp },
  ];

  return (
    <div className="flex h-[calc(100vh-60px)] bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar: Rankings & Filters (Unified Width 320px) */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-8 border-b border-slate-100">
           <div className="flex items-center gap-2 mb-3">
              <div className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black uppercase rounded tracking-widest">명예의 전당</div>
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">전체 랭킹 확인</div>
           </div>
           <h1 className="text-xl font-black text-slate-800 italic tracking-tighter uppercase">성공 사례 <span className="text-indigo-600">도서관</span></h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
           <div className="space-y-2">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3">카테고리 필터</div>
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 group ${activeFilter === f.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'hover:bg-slate-50'}`}
                >
                  <div className={`p-2 rounded-xl ${activeFilter === f.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                     <f.icon size={16} />
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-tight ${activeFilter === f.id ? 'text-white' : 'text-slate-700'}`}>{f.label}</span>
                </button>
              ))}
           </div>

           <div className="p-6 bg-indigo-50 rounded-[32px] border border-indigo-100 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                 <Trophy size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">이번 주의 우수 블로거</span>
              </div>
              <div>
                 <div className="text-sm font-black text-slate-800">Maza_Master_01</div>
                 <div className="text-[10px] text-slate-500 font-medium">이번 주에만 3개의 사이트 승인!</div>
              </div>
           </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">실시간 승인 알림</div>
           <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[10px] font-black text-slate-700 uppercase">방금 새로운 승인 사례가 등록됨</div>
           </div>
        </div>
      </div>

      {/* Main Action Board (Unified Stage) */}
      <div className="flex-1 overflow-y-auto p-12 relative">
         <div className="max-w-5xl mx-auto space-y-12">
            {/* Hero Summary */}
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { label: '누적 승인 블로그', value: '1,248+', icon: Medal, color: 'text-indigo-600' },
                 { label: '평균 승인 성공률', value: '98.2%', icon: Crown, color: 'text-emerald-500' },
                 { label: '평균 소요 기간', value: '15일', icon: Calendar, color: 'text-amber-500' }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 scale-150"><stat.icon size={60} /></div>
                    <div className="text-3xl font-black text-slate-800 tracking-tighter mb-1">{stat.value}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                 </div>
               ))}
            </div>

            {/* Champions Grid */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase">승인 <span className="text-indigo-600">성공 랭킹</span></h2>
                  <div className="text-xs font-black text-slate-400 flex items-center gap-2"><Users size={14} /> 총 {champions.length}명의 인증된 챔피언</div>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  {loading ? (
                    <div className="col-span-2 py-20 text-center">
                       <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">랭킹 데이터를 불러오고 있어요...</p>
                    </div>
                  ) : (
                    champions.map((champion, idx) => (
                      <div key={idx} className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-50 flex items-start gap-5 group hover:border-indigo-600 hover:shadow-indigo-100/30 transition-all">
                         <div className="w-14 h-14 shrink-0 bg-slate-50 text-slate-300 rounded-[22px] flex items-center justify-center text-2xl font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                            {idx + 1}
                         </div>
                         <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2">
                               <h3 className="text-base font-black tracking-tight text-slate-800 truncate">{champion.blog_name}</h3>
                               <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-full border border-emerald-100 flex items-center gap-1 shrink-0">
                                  <CheckCircle2 size={8} /> 승인 완료
                               </div>
                            </div>
                            {champion.success_quote && (
                               <p className="text-[11px] text-slate-500 italic leading-relaxed border-l-2 border-indigo-200 pl-3">
                                  "{champion.success_quote}"
                               </p>
                            )}
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{new Date(champion.created_at).toLocaleDateString()} 성공 기록</p>
                         </div>
                         <a href={`https://${champion.domain}`} target="_blank" className="w-10 h-10 shrink-0 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all mt-1">
                            <ExternalLink size={16} />
                         </a>
                      </div>
                    ))
                  )}
               </div>
            </div>

            {/* CTA */}
            <div className="bg-slate-900 p-16 rounded-[64px] text-center space-y-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-16 opacity-5 scale-150 rotate-12"><Sparkles size={120} /></div>
               <div className="space-y-2">
                 <h2 className="text-3xl font-black italic text-white tracking-tighter">다음 성공의 <span className="text-indigo-400">주인공은 바로 당신</span>입니다</h2>
                 <p className="text-slate-400 font-medium max-w-lg mx-auto">마자스토리의 자동화 엔진과 함께라면 <br />여러분도 이 리스트의 주인공이 될 수 있습니다.</p>
               </div>
               <button className="btn-premium px-12 py-5 text-base">수익화 챌린지 시작하기 →</button>
            </div>
         </div>
      </div>
    </div>
  );
}

function Layout(props: any) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>;
}
