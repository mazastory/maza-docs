import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function AdminRoute() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
