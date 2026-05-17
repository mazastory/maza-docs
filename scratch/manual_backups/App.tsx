import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import AuthGuard from "./components/AuthGuard";
import AdminRoute from "./components/AdminRoute";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy loading
const Landing = lazy(() => import("./pages/Landing"));
const KnowledgeHub = lazy(() => import("./pages/KnowledgeHub"));
const Setup = lazy(() => import("./pages/Setup"));
const Challenge = lazy(() => import("./pages/Challenge"));
const MySite = lazy(() => import("./pages/MySite"));
const Admin = lazy(() => import("./pages/Admin"));
const Consulting = lazy(() => import("./pages/Consulting"));
const Orchestrator = lazy(() => import("./pages/Orchestrator"));
const MyPage = lazy(() => import("./pages/MyPage"));
const Login = lazy(() => import("./pages/Login"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const FAQ = lazy(() => import("./pages/FAQ"));
const AutopilotDashboard = lazy(() => import("./pages/AutopilotDashboard"));
const NicheHunterPage = lazy(() => import("./pages/NicheHunter"));
const InstallationGuide = lazy(() => import("./pages/InstallationGuide"));
const Guide = lazy(() => import("./pages/Guide"));

// Atomic Components for standalone testing
import StrategyDesigner from "./components/StrategyDesigner";
import LegalGenerator from "./components/LegalGenerator";
import SEOAssetTool from "./components/SEOAssetTool";
import NicheHunter from "./components/NicheHunter";
import AIWriter from "./components/AIWriter";

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
  </div>
);

// Animated wrapper that re-triggers page-enter on route change
const AnimatedOutlet = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
};

const IndexRoute = () => {
  const { loading } = useAuth();
  if (loading) return <PageLoader />;
  return <Landing />;
};

import AutopilotStage from "./components/AutopilotStage";

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Toaster position="bottom-right" richColors expand closeButton duration={5000} />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<AnimatedOutlet><IndexRoute /></AnimatedOutlet>} />
                <Route path="login" element={<AnimatedOutlet><Login /></AnimatedOutlet>} />
                <Route path="privacy" element={<AnimatedOutlet><PrivacyPolicy /></AnimatedOutlet>} />
                <Route path="terms" element={<AnimatedOutlet><TermsOfService /></AnimatedOutlet>} />
                <Route path="faq" element={<AnimatedOutlet><FAQ /></AnimatedOutlet>} />
                
                {/* Protected Routes */}
                <Route element={<AuthGuard />}>
                  <Route path="knowledge" element={<KnowledgeHub />} />
                  <Route path="setup" element={<Setup />} />
                  <Route path="challenge" element={<Challenge />} />
                  <Route path="mysite" element={<MySite />} />
                  <Route path="mypage" element={<MyPage />} />
                  <Route path="consulting" element={<Consulting />} />
                  <Route path="autopilot" element={<AutopilotDashboard />} />
                  <Route path="niche-hunter" element={<NicheHunterPage />} />
                  <Route path="installation-guide" element={<InstallationGuide />} />
                  <Route path="guide" element={<Guide />} />
                  
                  {/* Admin Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="admin" element={<Admin />} />
                    <Route path="orchestrator" element={<Orchestrator />} />
                    
                    {/* Standalone Tool Testing Nodes */}
                    <Route path="orchestrator/test/strategy" element={<div className="p-12"><StrategyDesigner /></div>} />
                    <Route path="orchestrator/test/legal" element={<div className="p-12"><LegalGenerator /></div>} />
                    <Route path="orchestrator/test/seo" element={<div className="p-12"><SEOAssetTool /></div>} />
                    <Route path="orchestrator/test/setup" element={<div className="p-12"><Setup isIntegrated={true} /></div>} />
                    <Route path="orchestrator/test/niche" element={<div className="p-12"><NicheHunter /></div>} />
                    <Route path="orchestrator/test/writer" element={<div className="p-12"><AIWriter /></div>} />
                  </Route>
                </Route>
              </Route>
              
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
}
