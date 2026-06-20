import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import AuthGuard from "./components/AuthGuard";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy loading — Docs pages only
const Landing = lazy(() => import("./pages/Landing"));
const InstallationGuide = lazy(() => import("./pages/InstallationGuide"));
const Guide = lazy(() => import("./pages/Guide"));
const UsageGuide = lazy(() => import("./pages/UsageGuide"));
const Login = lazy(() => import("./pages/Login"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Docs = lazy(() => import("./pages/Docs"));

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

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Toaster position="bottom-right" richColors expand closeButton duration={5000} />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route index element={<AnimatedOutlet><IndexRoute /></AnimatedOutlet>} />
                <Route path="login" element={<AnimatedOutlet><Login /></AnimatedOutlet>} />
                <Route path="privacy" element={<AnimatedOutlet><PrivacyPolicy /></AnimatedOutlet>} />
                <Route path="terms" element={<AnimatedOutlet><TermsOfService /></AnimatedOutlet>} />
                <Route path="faq" element={<AnimatedOutlet><FAQ /></AnimatedOutlet>} />

                {/* Protected Doc Routes */}
                <Route element={<AuthGuard />}>
                  <Route path="knowledge" element={<InstallationGuide initialCategory="tistory" />} />
                  <Route path="installation-guide" element={<InstallationGuide />} />
                  <Route path="installation" element={<InstallationGuide />} />
                  <Route path="guide" element={<Guide />} />
                  <Route path="usage-guide" element={<UsageGuide />} />
                </Route>
              </Route>

              {/* ─── New Docs Hub (no AuthGuard needed for public pages) ─── */}
              <Route path="/docs" element={<Navigate to="/docs/getting-started/intro" replace />} />
              <Route path="/docs/:sectionId" element={<Navigate to="/docs/getting-started/intro" replace />} />
              <Route path="/docs/:sectionId/:pageId" element={<AnimatedOutlet><Docs /></AnimatedOutlet>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
}
