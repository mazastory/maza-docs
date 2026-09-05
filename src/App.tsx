import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy loading — Docs pages only
// Lazy loading — Docs pages only
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
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

export default function App() {
  return (
    <ErrorBoundary>
      <Toaster position="bottom-right" richColors expand closeButton duration={5000} />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/docs" replace />} />
            <Route path="/privacy" element={<AnimatedOutlet><PrivacyPolicy /></AnimatedOutlet>} />
            <Route path="/terms" element={<AnimatedOutlet><TermsOfService /></AnimatedOutlet>} />

            {/* ─── New Docs Hub ─── */}
            <Route path="/docs" element={<Navigate to="/docs/getting-started/intro" replace />} />
            <Route path="/docs/:sectionId" element={<Navigate to="/docs/getting-started/intro" replace />} />
            <Route path="/docs/:sectionId/:pageId" element={<AnimatedOutlet><Docs /></AnimatedOutlet>} />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/docs" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
