import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!['admin', 'super_admin', 'staff'].includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
