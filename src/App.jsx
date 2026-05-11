import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/layouts/Layout';

import Login from './pages/Login';
import Register from './pages/Register';

import AdminHome from './pages/admin/Home';
import ClientHome from './pages/client/Home';

import ClientCommandes from './pages/client/Commandes';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) return <div>Chargement...</div>;
    if (!isAuthenticated()) return <Navigate to="/login" replace />;
    
    return children;
};

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/home" element={ <ProtectedRoute> <AdminHome /> </ProtectedRoute> } />
        <Route path="/client/home" element={ <ProtectedRoute> <ClientHome /> </ProtectedRoute> } />
        <Route path="/client/commandes" element={ <ClientCommandes />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;