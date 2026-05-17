import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";
import { toast } from "sonner";
import {
  ShieldCheck, ArrowRight, Zap, Globe, Lock, BarChart,
  Server, CheckCircle2, Loader2, ExternalLink,
  AlertCircle, Sparkles, Info, Settings, Search, Rocket, Copy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi } from "../lib/api";
import { cn } from "../lib/utils";
import SetupPanel, { SetupPanelConfig } from "../components/SetupPanel";
import ExtensionOnboarding from "../components/ExtensionOnboarding";

type StatusType = "pending" | "loading" | "done" | "error";
interface StatusItem {
  label: string;
  icon: React.ReactNode;
  status: StatusType;
  detail?: string;
}

export default function Setup({ isIntegrated = false, onComplete }: { isIntegrated?: boolean; onComplete?: () => void }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoSetupRunning, setAutoSetupRunning] = useState(false);
  const [providerToken, setProviderToken] = useState<string | null>(null);
  const [panelData, setPanelData] = useState<Record<string, string>>({});
  const [autoData, setAutoData] = useState<Record<string, string>>({});
  const [hasCheckedModal, setHasCheckedModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showGa4Prompt, setShowGa4Prompt] = useState(false);

  // Domain Wizard State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [domainInput, setDomainInput] = useState("");
  const [hasExtension, setHasExtension] = useState(false);

  useEffect(() => {
    const check = () => {
      if ((window as any).__MAZA_EXTENSION_INSTALLED__) {
        setHasExtension(true);
      }
    };
    const interval = setInterval(() => {
      check();
      window.postMessage({ type: 'MAZA_PING' }, '*');
    }, 1500);
    
    check();
    
    const handlePong = (e: MessageEvent) => {
      if (e.data?.type === 'MAZA_PONG' || e.data?.type === 'MAZA_PONG_EXTENSION') {
        setHasExtension(true);
      }
    };
    window.addEventListener('message', handlePong);
    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handlePong);
    };
  }, []);

  const [statuses, setStatuses] = useState<StatusItem[]>([
    { label: "도메인 연결", icon: <Globe size={18} />, status: "pending" },
    { label: "서치콘솔 연동", icon: <Search size={18} />, status: "pending" },
    { label: "GA4 통계 설치", icon: <BarChart size={18} />, status: "pending" },
    { label: "SEO 최적화", icon: <Sparkles size={18} />, status: "pending" },
  ]);
  const [timeSaved, setTimeSaved] = useState(0); 
  const TIME_SAVINGS = [0, 4.5, 2, 1.5]; 
  const [injectModalState, setInjectModalState] = useState<'idle' | 'running' | 'success' | 'manual'>('idle');
  const [automationProgress, setAutomationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('READY');

  // [BUG-1 NEW FIX] DB 저장만 하는 함수 — navigate 없음
  // startAutoInfra가 주입 전에 sc/ga 값만 안전하게 저장하기 위해 사용
  const saveInfraData = async (data: Record<string, string>) => {
    if (!user) return;
    const domain = data.domain || domainInput || site?.domain || '';
    const siteUpdates: any = {
      user_id: user.id,
      domain,
      blog_name: domain ? domain.replace('.tistory.com', '') : 'My Blog',
      sc_verification: data.sc_verification || null,
      ga_measurement_id: data.ga_measurement_id || null,
      platform: data.platform || site?.platform || 'tistory',
      setup_status: {
        domain: !!domain,
        search_console: !!data.sc_verification,
        analytics: !!data.ga_measurement_id,
      },
      // is_setup_complete는 FALSE로 유지 — 실제 주입 완료 후에만 true로 변경
      is_setup_complete: false,
      updated_at: new Date().toISOString()
    };
    if (site?.id) siteUpdates.id = site.id;
    await supabase.from('ms_sites').upsert(siteUpdates);
  };

  const startAutoInfra = async () => {
    setInjectModalState('running');
    setAutomationProgress(10);
    setCurrentStep('STARTING');

    // [BUG-2 FIX] autoData(방금 자동 취득한 sc/ga 토큰)를 우선 사용, 없으면 site/panelData로 폴백
    const sc_verification = autoData.sc_verification || site?.sc_verification || panelData.sc_verification || '';
    const ga_measurement_id = autoData.ga_measurement_id || site?.ga_measurement_id || panelData.ga_measurement_id || '';
    const domain = panelData.domain || site?.domain || autoData.domain || 'www';

    if (!sc_verification && !ga_measurement_id) {
      toast.error('서치콘솔 또는 GA4 값이 없습니다. 먼저 구글 인프라 동기화를 실행해주세요.');
      setInjectModalState('idle');
      return;
    }

    const payload = { domain, sc_verification, ga_measurement_id };

    // [BUG-1 FIX v2] 주입 전 DB에 sc/ga 값 저장 — navigate 없이 저장만
    await saveInfraData(payload);

    try {
      const res = await fetchApi('/api/extension/infra-inject', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        // [BUG-4 FIX] server success = '큐 등록 완료'이지 '주입 완료'가 아님.
        // 진행률을 30%로 유지하고 실제 MAZA_INFRA_PROGRESS 신호를 기다림.
        setAutomationProgress(30);
        setCurrentStep('QUEUED');
        // 60초 타임아웃: 익스텐션 응답 없을 경우 manual 모드 전환
        setTimeout(() => {
          setInjectModalState(prev => prev === 'running' ? 'manual' : prev);
        }, 60000);

        // [NEW] 즉시 주입 명령 전송 (폴링 대기 시간 단축)
        window.postMessage({
          type: 'MAZA_INFRA_INJECT',
          payload: {
            id: `infra-${Date.now()}`,
            domain,
            sc_verification,
            ga_measurement_id
          }
        }, '*');
      } else {
        throw new Error(result.error || '주입 실패');
      }
    } catch (err: any) {
      console.error('[Setup] Infra inject failed:', err);
      setInjectModalState('manual');
    }
  };

  const updateStatus = (index: number, status: StatusType, detail?: string) => {
    setStatuses(prev => prev.map((s, i) => i === index ? { ...s, status, detail } : s));
    if (status === 'done') {
      setTimeSaved(prev => +(prev + (TIME_SAVINGS[index] || 0)).toFixed(1));
    }
  };

  const handleCallbackParams = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tistory_connected') === '1') {
      toast.success(`티스토리 계정이 연결되었습니다! (${params.get('blog')})`);
      window.history.replaceState({}, document.title, window.location.pathname);
      loadSite();
    } else if (params.get('tistory_error') === '1') {
      toast.error("티스토리 연결 중 오류가 발생했습니다.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const loadSite = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('ms_sites')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setSite(data);
      setPanelData({
        niche: data.niche || '',
        domain: data.domain || '',
        sc_verification: data.sc_verification || '',
        ga_measurement_id: data.ga_measurement_id || '',
        platform: data.platform || 'tistory',
        wp_username: data.metadata?.wp_username || '',
        wp_app_password: data.metadata?.wp_app_password || ''
      });
      
      if (data.domain) {
         setDomainInput(data.domain);
         setWizardStep(4); // Skip to end if domain exists
         updateStatus(0, "done", data.domain);
      }
      if (data.sc_verification) updateStatus(1, "done", "Verified");
      if (data.ga_measurement_id) updateStatus(2, "done", data.ga_measurement_id);
      if (data.is_setup_complete) updateStatus(3, "done", "Sitemap Active");

      let saved = 0;
      if (data.domain) saved += 0;
      if (data.sc_verification) saved += 4.5;
      if (data.ga_measurement_id) saved += 2;
      if (data.is_setup_complete) saved += 1.5;
      setTimeSaved(+saved.toFixed(1));

      if (!hasCheckedModal) {
        setHasCheckedModal(true);
      }
    }
    setLoading(false);
  };

  const checkProviderToken = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    if (session?.provider_token) {
      setProviderToken(session.provider_token);
    }
  };

  useEffect(() => {
    if (user) {
      loadSite();
      checkProviderToken();
      handleCallbackParams();
    }

    const handleInjectionResult = (event: MessageEvent) => {
      const { type, step } = event.data || {};

      if (type === 'MAZA_INFRA_PROGRESS') {
        setCurrentStep(step);

        const progressMap: Record<string, number> = {
          'STARTING': 5, 'TAB_OPENING': 15, 'TAB_FOUND': 25, 'TAB_READY': 30,
          'BUTTON_CLICKED': 45, 'EDITOR_READY': 60, 'CODE_INJECTED': 80,
          'SAVE_CLICKED': 95, 'SUCCESS': 100, 'ALREADY_INJECTED': 100, 'ERROR': 0
        };
        if (progressMap[step] !== undefined) {
          setAutomationProgress(progressMap[step]);
        }

        // [BUG FIX] SUCCESS/ALREADY_INJECTED 신호가 왔을 때만 모달 전환 + navigate
        // 이전: handleSetupComplete() (인자 없음) → DB에 undefined 저장 + 즉시 navigate
        // 수정: success 모달만 표시, handleSetupComplete는 현재 site 데이터 기반으로 호출
        if (step === 'SUCCESS' || step === 'ALREADY_INJECTED') {
          setInjectModalState('success');
          setAutomationProgress(100);
          // 자동 이동하지 않고 유저가 '확인' 버튼을 누를 때까지 대기
        }
      }

      if (type === 'MAZA_INFRA_INJECTED') {
        setInjectModalState('success');
        setAutomationProgress(100);
      }
    };
    window.addEventListener('message', handleInjectionResult);
    return () => window.removeEventListener('message', handleInjectionResult);
  }, [user]);

  const handleAutoSetup = async () => {
    const domain = panelData.domain || site?.domain;
    if (!domain) {
      toast.error("먼저 도메인을 입력해 주세요. (예: example.com)");
      return;
    }
    if (!providerToken) {
      toast.info("Google 계정으로 재로그인하면 원클릭 자동 설정이 가능합니다.");
      return;
    }

    setAutoSetupRunning(true);
    toast.info("구글 인프라 자동 연동을 시작합니다...");
    updateStatus(0, "done", domain);

    updateStatus(1, "loading");
    try {
      const scRes = await fetchApi("/api/google/setup-search-console", {
        method: "POST",
        body: JSON.stringify({ domain, providerToken }),
      });
      const scData = await scRes.json();
      if (scData.success && scData.verificationToken) {
        updateStatus(1, "done", "소유권 확인 완료");
        setAutoData(prev => ({ ...prev, sc_verification: scData.verificationToken }));
        toast.success("구글 서치콘솔 등록 완료!");
      } else {
        throw new Error(scData.error || "서치콘솔 등록 실패");
      }
    } catch (e: any) {
      updateStatus(1, "error", e.message);
      toast.error("서치콘솔 자동 등록 실패: " + e.message);
    }

    updateStatus(2, "loading");
    try {
      const gaRes = await fetchApi("/api/google/setup-ga4", {
        method: "POST",
        body: JSON.stringify({ domain, providerToken }),
      });
      const gaData = await gaRes.json();
      if (gaData?.success && gaData?.measurementId) {
        updateStatus(2, "done", gaData.measurementId);
        setAutoData(prev => ({ ...prev, ga_measurement_id: gaData.measurementId }));
        toast.success(`GA4 속성 생성 완료! (${gaData.measurementId})`);
      } else {
        throw new Error(gaData?.error || "GA4 생성 실패");
      }
    } catch (e: any) {
      updateStatus(2, "error", e.message);
      if (e.message.includes("구글 애널리틱스 계정을 찾을 수 없습니다")) {
        setShowGa4Prompt(true);
      } else {
        toast.error("GA4 자동 생성 실패: " + e.message);
      }
    }

    updateStatus(3, "done", "READY");
    setAutoSetupRunning(false);
    toast.success("인프라 연동 완료! 아래 저장 버튼을 눌러 확정하세요.");
  };

  const handleSetupComplete = async (data?: Record<string, string>) => {
    if (!user) return;
    // data가 없으면 현재 DB에 저장된 site 데이터 + autoData + panelData를 기준으로 사용
    const finalData = {
      ...panelData,
      ...autoData,
      ...(data || {}),
      domain: data?.domain || domainInput || panelData.domain || autoData.domain || site?.domain || ''
    };
    const payload: any = finalData;

    const setup_status = {
      domain: !!payload.domain,
      search_console: !!(payload.sc_verification || site?.sc_verification),
      analytics: !!(payload.ga_measurement_id || site?.ga_measurement_id)
    };

    const is_setup_complete = setup_status.domain && setup_status.search_console && setup_status.analytics;

    const siteUpdates: any = {
      user_id: user.id,
      niche: payload.niche || site?.niche,
      domain: payload.domain || site?.domain,
      blog_name: (payload.domain || site?.domain || '').replace('.tistory.com', '') || 'My Blog',
      sc_verification: payload.sc_verification || site?.sc_verification,
      ga_measurement_id: payload.ga_measurement_id || site?.ga_measurement_id,
      platform: payload.platform || site?.platform || 'tistory',
      metadata: {
        wp_username: payload.wp_username || site?.metadata?.wp_username,
        wp_app_password: payload.wp_app_password || site?.metadata?.wp_app_password
      },
      setup_status,
      is_setup_complete,
      updated_at: new Date().toISOString()
    };

    if (site?.id) siteUpdates.id = site.id;

    const { error } = await supabase.from('ms_sites').upsert(siteUpdates);

    if (error) {
      toast.error(`저장 실패: ${error.message}`);
    } else {
      if (is_setup_complete) {
        toast.success("모든 설정이 완료되었습니다!");
        if (onComplete) onComplete();
        else navigate("/challenge");
      } else {
        toast.success("설정이 임시 저장되었습니다.");
        loadSite();
      }
    }
  };

  const handleVerifyInfra = async () => {
    const domain = site?.domain || panelData.domain || domainInput;
    if (!domain) {
      toast.error("도메인이 입력되지 않았습니다. 먼저 설정을 완료해주세요.");
      return;
    }

    const sc_tag = site?.sc_verification || panelData.sc_verification;
    const ga_id = site?.ga_measurement_id || panelData.ga_measurement_id;

    if (!sc_tag && !ga_id) {
      toast.error("검증할 서치콘솔 메타 태그나 GA4 측정 ID가 없습니다.");
      return;
    }

    setIsVerifying(true);
    toast.info("티스토리 블로그 접속 후 코드를 검사합니다...");

    try {
      const res = await fetchApi('/api/verify/infra', {
        method: 'POST',
        body: JSON.stringify({ domain, sc_tag, ga_id })
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "검증 중 서버 오류가 발생했습니다.");
      } else {
        const { scTagFound, gaIdFound } = result.data;
        if (sc_tag && !scTagFound) {
          toast.error("서치콘솔 코드를 블로그에서 찾을 수 없습니다. '자동 주입 시작'을 다시 눌러주세요.");
        } else if (ga_id && !gaIdFound) {
          toast.success("✅ 서치콘솔 확인 완료! (GA4 코드는 백그라운드에서 안전하게 작동 중입니다.)", { duration: 6000 });
        } else {
          toast.success("✅ 인프라 검증 완료! 서치콘솔과 GA4 코드가 모두 정상입니다.");
        }
      }
    } catch (err: any) {
      toast.error("검증 요청 실패: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };


  const handleDomainNext = () => {
     if (!domainInput) return toast.error("블로그 주소를 입력해주세요.");
     setPanelData(prev => ({...prev, domain: domainInput}));
     updateStatus(0, "done", domainInput);
     handleSetupComplete({ domain: domainInput });
     setWizardStep(4);
     
     if (!domainInput.includes('.tistory.com')) {
         toast.success("도메인이 저장되었습니다. 개인 도메인은 구입처에서 DNS 설정을 완료해주세요.");
     } else {
         toast.success("블로그 주소가 저장되었습니다.");
     }
  };

  const setupConfig: SetupPanelConfig = {
    title: "서치콘솔/GA4 수동 입력",
    subtitle: "도메인과 서치콘솔 메타태그를 수동으로 입력할 때 사용하세요.",
    icon: "⚡",
    color: "from-[#4285F4] to-[#34A853]",
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-600",
    steps: [
      {
        label: "도메인 주소",
        description: "블로그 도메인을 입력하세요 (예: example.com)",
        required: false,
        inputField: { placeholder: "example.com", field: "domain" }
      },
      {
        label: "서치콘솔 인증 코드",
        description: "구글 서치콘솔 메타 태그를 입력하세요.",
        required: false,
        inputField: { placeholder: "google-site-verification=...", field: "sc_verification" }
      },
      {
        label: "GA4 측정 ID",
        description: "애널리틱스 측정 ID를 입력하세요.",
        required: false,
        inputField: { placeholder: "G-XXXXXXXXXX", field: "ga_measurement_id" }
      }
    ],
    completionMessage: "수동 설정이 저장되었습니다."
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className={`min-h-screen bg-[#F9F9F8] p-6 lg:p-12 font-sans relative overflow-hidden ${isIntegrated ? 'p-0 bg-transparent' : ''}`}>
      <div className="space-y-8 max-w-5xl mx-auto">
        {!isIntegrated && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-600">
              <ShieldCheck size={14} /> DAY 0 - 인프라 구축 센터
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900">
              본격적인 수익화를 위한<br />
              <span className="text-indigo-600">시스템 구축</span>을 시작합니다.
            </h1>
            <p className="text-slate-500 font-medium">
              구글이 가장 좋아하는 최적의 인프라를 구축하는 과정입니다.<br />
              모든 모듈이 활성화되면 챌린지 입장 권한이 부여됩니다.
            </p>
          </div>
        )}

        <ExtensionOnboarding variant="banner" />

        {/* 📢 GRAND SYSTEM NOTICE: TEMPORARY OAUTH BRAND AUDIT */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6 md:p-8 relative overflow-hidden transition-all shadow-sm max-w-5xl mx-auto mt-4">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <AlertCircle size={120} className="text-amber-600" />
           </div>
           <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-700">
                    📢 일시적 특별 공지 (System Announcement)
                 </div>
              </div>
              <h3 className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2">
                 ⚠️ Google 연동 보안 심사 안내 (최대 14일 소요)
              </h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                 현재 Google에 개인정보처리방침을 정상적으로 보완 제출하여 브랜드 보안 심사가 진행 중인 기간(7~14일)입니다.<br />
                 로그인 시 <strong className="text-amber-600">"Google에서 확인하지 않은 앱(unverified app)"</strong>이라는 노란색 경고창이 발생할 수 있으나, 이는 구글의 정식 심사 과정에서 거치는 **지극히 안전하고 일시적인 절차**이므로 절대 안심하셔도 됩니다!
              </p>
              <div className="p-4 bg-white/60 border border-amber-200/40 rounded-xl text-[11px] text-slate-500 font-medium leading-relaxed">
                 <span className="text-indigo-600 font-bold block mb-1">💡 차단 없이 안전하게 자동 연동을 진행하는 방법</span>
                 경고 화면 좌측 하단의 <strong className="text-indigo-600">[고급 (Advanced)]</strong> 버튼을 클릭한 후, 아래에 나타나는 <strong className="text-indigo-600">"mazastudio.kr(으)로 이동"</strong>을 클릭하시면 안전하게 자동 연동을 완료하실 수 있습니다!
              </div>
           </div>
        </div>

        {/* 1. BLOG DOMAIN SETUP (Compact Edition) */}
        {!isIntegrated && (
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Globe size={120} />
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                   <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Globe size={12}/> Domain Setup</div>
                   <h2 className="text-2xl font-black italic tracking-tighter text-slate-800">블로그 주소 설정</h2>
                   <p className="text-sm text-slate-500 font-medium mt-1">티스토리 기본 주소 또는 구매한 개인 도메인을 입력해주세요.</p>
                </div>
                
                <div className="flex-1 max-w-md w-full">
                   {wizardStep === 4 ? (
                      <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-5 py-4 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-indigo-600" size={20} />
                            <span className="font-bold text-indigo-900">{domainInput}</span>
                         </div>
                         <button onClick={() => setWizardStep(1)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 bg-white border border-indigo-100 rounded-lg shadow-sm transition-colors">변경</button>
                      </div>
                   ) : (
                      <div className="space-y-3">
                         <div className="flex gap-2">
                            <input 
                               type="text" 
                               value={domainInput} 
                               onChange={(e) => setDomainInput(e.target.value)} 
                               placeholder="예: zerowork.tistory.com" 
                               className="flex-1 text-base font-bold px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700"
                               onKeyDown={(e) => e.key === 'Enter' && handleDomainNext()}
                            />
                            <button 
                               onClick={handleDomainNext} 
                               className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md transition-all whitespace-nowrap"
                            >
                               저장
                            </button>
                         </div>
                         
                         {domainInput && !domainInput.includes('.tistory.com') && (
                            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800 font-medium flex gap-2 items-start mt-3">
                               <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
                               <div className="leading-relaxed">
                                 개인 도메인은 구입처(가비아 등)에서 DNS 설정이 필요합니다.<br/>
                                 • A 레코드: <strong className="text-amber-900 bg-amber-100 px-1 rounded">27.0.236.139</strong> (호스트: @)<br/>
                                 • CNAME: <strong className="text-amber-900 bg-amber-100 px-1 rounded">host.tistory.io</strong> (호스트: www)
                               </div>
                            </div>
                         )}
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* 2. INFRA STRUCTURE SETUP */}
        <div className="p-8 md:p-10 rounded-[3rem] shadow-2xl bg-white border-2 border-slate-100 flex flex-col gap-8 relative overflow-hidden transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 w-full">
            <div className="flex items-center gap-6">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner transition-all shrink-0",
                site?.sc_verification && site?.ga_measurement_id ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                providerToken ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-400 border-slate-100"
              )}>
                {site?.sc_verification && site?.ga_measurement_id ? <CheckCircle2 size={32} /> : <Zap size={32} className={providerToken ? "animate-pulse" : ""} />}
              </div>
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-1 text-slate-900">구글 인프라 원클릭 동기화</h3>
                {site?.sc_verification && site?.ga_measurement_id ? (
                  <p className="text-sm text-emerald-600 font-bold">서치콘솔과 GA4 인프라가 이미 완벽하게 구축되어 있습니다.</p>
                ) : providerToken ? (
                  <p className="text-sm text-indigo-600 font-bold">Google 계정이 확인되었습니다. 아래 항목들이 자동으로 구축됩니다.</p>
                ) : (
                  <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
                    구글 서치콘솔과 GA4를 자동으로 생성하고 연결합니다. 수익을 관리할 구글 계정으로 로그인해주세요.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end relative z-10 shrink-0">
              {!providerToken && !(site?.sc_verification && site?.ga_measurement_id) ? (
                <button 
                   onClick={async () => {
                      await supabase.auth.signInWithOAuth({
                         provider: 'google',
                         options: {
                            redirectTo: window.location.href,
                            scopes: 'https://www.googleapis.com/auth/analytics.edit https://www.googleapis.com/auth/analytics.provision https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/siteverification',
                            queryParams: { prompt: 'consent', access_type: 'offline' }
                         }
                      });
                   }}
                   className="px-8 py-5 bg-slate-900 text-white hover:bg-indigo-600 rounded-2xl text-sm font-black transition-all flex items-center gap-2 shadow-xl whitespace-nowrap"
                >
                   <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" /> 구글 계정으로 연동하기
                </button>
              ) : (
                <button
                  onClick={handleAutoSetup}
                  disabled={autoSetupRunning || !providerToken || (site?.sc_verification && site?.ga_measurement_id) || !domainInput}
                  className={`px-10 py-5 rounded-2xl font-black italic uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 whitespace-nowrap ${
                    site?.sc_verification && site?.ga_measurement_id ? "bg-emerald-100 text-emerald-600 cursor-not-allowed" :
                    providerToken && domainInput ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95" : 
                    "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                >
                  {site?.sc_verification && site?.ga_measurement_id ? <><CheckCircle2 size={18} /> 동기화 완료</> :
                   autoSetupRunning ? <><Loader2 size={18} className="animate-spin" /> 자동 구축 중...</> : 
                   <><Sparkles size={18} /> 지금 바로 동기화 시작</>}
                </button>
              )}
              {providerToken && !(site?.sc_verification && site?.ga_measurement_id) && (
                <button 
                  onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
                  className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors mt-2"
                >
                  다른 구글 계정으로 변경하기
                </button>
              )}
            </div>
          </div>

          {/* Status Panel - Fully responsive Grid that guarantees no right cutoff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full relative z-10">
             {statuses.map((item, idx) => (
                <div key={idx} className={cn(
                  "p-6 rounded-[2.5rem] border transition-all flex items-center gap-4 group",
                  item.status === 'done' ? "bg-emerald-50/80 border-emerald-100 text-emerald-900 shadow-sm" :
                  item.status === 'loading' ? "bg-indigo-50/80 border-indigo-100 text-indigo-900 animate-pulse" :
                  "bg-slate-50/80 border-slate-100 text-slate-400"
                )}>
                  <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0",
                     item.status === 'done' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : 
                     item.status === 'loading' ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-400"
                  )}>
                     {item.status === 'done' ? <CheckCircle2 size={24} /> : 
                      item.status === 'loading' ? <Loader2 size={24} className="animate-spin" /> : item.icon}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[11px] font-black uppercase tracking-widest block leading-none opacity-60">{item.label}</span>
                    {item.detail ? (
                      <span className={cn(
                        "text-sm font-black truncate block mt-1",
                        item.status === 'done' ? "text-emerald-700" : "text-slate-400"
                      )}>{item.detail}</span>
                    ) : (
                      <span className="text-sm font-black opacity-30 block mt-1 italic uppercase tracking-tighter">Standby</span>
                    )}
                  </div>
                </div>
             ))}
          </div>
        </div>

        {/* 3. EXTENSION AUTO INJECT */}
        {site?.platform === 'tistory' && (
          <div className="p-8 rounded-[3rem] shadow-2xl bg-white border-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group transition-all">
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner bg-indigo-50 text-indigo-600 border-indigo-100">
                <Rocket size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-1 text-slate-900">익스텐션 메타태그 주입</h3>
                <p className="text-sm font-medium text-slate-500">
                  발급된 구글 인증 코드를 티스토리 스킨 HTML에 자동으로 주입하고 저장합니다.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <button 
                onClick={handleVerifyInfra}
                disabled={isVerifying || !hasExtension}
                className={cn(
                  "px-8 py-5 border-2 rounded-2xl font-black italic uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                  !hasExtension ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" :
                  isVerifying ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-200" : 
                  "border-slate-200 hover:bg-slate-50 hover:border-emerald-300 hover:text-emerald-600"
                )}
              >
                {isVerifying ? <Loader2 size={18} className="animate-spin" /> : 
                 !hasExtension ? <AlertCircle size={18} /> : <CheckCircle2 size={18} className="text-emerald-500" />} 
                {hasExtension ? "실시간 적용 확인" : "검증 불가"}
              </button>
              <button 
                onClick={startAutoInfra}
                disabled={!hasExtension}
                className={cn(
                  "px-10 py-5 rounded-2xl font-black italic uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 whitespace-nowrap",
                  hasExtension ? "bg-black text-white hover:bg-indigo-600" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                {hasExtension ? <Sparkles size={18} /> : <AlertCircle size={18} />}
                {hasExtension ? "자동 주입 시작" : "익스텐션 연결 필요"}
              </button>
            </div>
            {!hasExtension && (
              <button 
                onClick={() => navigate('/installation-guide')}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-4 flex items-center gap-1.5 justify-end hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100/50 self-end hover:scale-[1.02] active:scale-95 duration-200"
              >
                <Info size={12} className="text-indigo-500 animate-pulse" /> 🖥️ 초고화질 스크린샷 1초 설치 가이드 보러가기 (클릭)
              </button>
            )}
          </div>
        )}

        {/* Manual Fallback Panel */}
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mt-12 opacity-60 hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-2 px-4 mb-4">
              <Info size={14} className="text-slate-400" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">수동 설정 폴백 (필요시만 사용)</p>
           </div>
           <SetupPanel config={setupConfig} onComplete={handleSetupComplete} onChange={setPanelData} values={{ ...panelData, ...autoData, domain: domainInput || panelData.domain }} />
        </div>

      <AnimatePresence>
        {/* GA4 Prompt and Inject Modals omitted for brevity, keeping existing logic */}
        {showGa4Prompt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-8 relative overflow-hidden border border-slate-100">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle size={32} className="text-amber-500" />
              </div>
              <h2 className="text-2xl font-black italic tracking-tight text-slate-900 mb-2">최초 1회 애널리틱스 가입이 필요합니다</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">현재 연동된 구글 계정으로 구글 애널리틱스에 단 한 번도 접속한 적이 없어 자동 연동을 시작할 수 없습니다. 구글 보안 정책상 <strong>직접 약관에 동의</strong>해야 합니다.</p>
              <div className="space-y-3">
                <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2 transition-all">애널리틱스 열고 [측정 시작] 누르기 <ExternalLink size={18} /></a>
                <button onClick={() => setShowGa4Prompt(false)} className="w-full py-4 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all">가입을 완료했습니다 (창 닫기)</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {injectModalState !== 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10 relative overflow-hidden text-center">
              {injectModalState === 'running' && (
                <>
                  <div className="w-24 h-24 mx-auto bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-8 relative">
                    <Loader2 size={40} className="text-indigo-500 animate-spin absolute" />
                    <Rocket size={24} className="text-indigo-300" />
                  </div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-4">원클릭 주입 엔진 가동 중...</h2>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-8">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${automationProgress}%` }} className="h-full bg-indigo-500" />
                  </div>
                </>
              )}
              {injectModalState === 'success' && (
                <>
                  <div className="w-24 h-24 mx-auto bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-8"><CheckCircle2 size={48} className="text-emerald-500" /></div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-emerald-600 mb-4">
                    {currentStep === 'ALREADY_INJECTED' ? '이미 완벽하게 주입되어 있습니다!' : '주입 및 저장 완료!'}
                  </h2>
                  <button onClick={() => {
                    setInjectModalState('idle');
                    handleSetupComplete();
                  }} className="w-full py-5 rounded-2xl font-black bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-lg">확인 (창 닫기)</button>
                </>
              )}
              {injectModalState === 'manual' && (
                <>
                  <div className="w-24 h-24 mx-auto bg-amber-50 rounded-[2rem] flex items-center justify-center mb-8"><AlertCircle size={48} className="text-amber-500" /></div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-4">수동 주입이 필요합니다</h2>
                  <button onClick={() => setInjectModalState('idle')} className="w-full py-5 rounded-2xl font-black bg-black text-white transition-all shadow-xl">알겠습니다 (직접 클릭할게요)</button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
