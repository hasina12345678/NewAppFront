import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const isAdminLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
  
  if (!isAdminLoggedIn) { return <Navigate to="/admin" replace />; }
  
  return children;
}

export default AdminRoute;