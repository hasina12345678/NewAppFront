import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { getCart } from './services/serv_panier';
import { isCustomerLoggedIn } from './services/serv_auth';

import Layout from './components/layouts/Layout';
import Login from './pages/Login';
import AdminRoute from './components/admin/AdminRoute';

import AdminHome from './pages/admin/Home';
import AdminImport from './pages/admin/Import';
import AdminImages from './pages/admin/Images';
import AdminCommandes from './pages/admin/Commandes';


import ClientHome from './pages/client/Home';
import ClientCommandes from './pages/client/Commandes';
import Wishlist from './pages/client/Wishlist';

import ProductDetail from './pages/client/ProductDetail';

function App() {
  const [panierCount, setPanierCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadCart = async () => {
    if (!isCustomerLoggedIn()) { setPanierCount(0); return; }
    try {
      const data = await getCart();
      const items = data.data?.items || [];
      const count = items.length ;
      // const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setPanierCount(count);
    } catch (error) {
      setPanierCount(0);
    }
  };

  useEffect(() => {
    loadCart();
  }, [refreshKey]);

  const refreshCart = () => { setRefreshKey(prev => prev + 1); };

  return (
    <Router>
      <Layout panierCount={panierCount} refreshCart={refreshCart}>
        <Routes>
          <Route path="/" element={<Navigate to="/client/home" replace />} />

          <Route path="/admin" element={<Login />} />
          <Route path="/admin/home" element={ <AdminRoute> <AdminHome /> </AdminRoute>} />
          <Route path="/admin/import" element={ <AdminRoute> <AdminImport /> </AdminRoute>} />
          <Route path="/admin/images" element={ <AdminRoute> <AdminImages /> </AdminRoute>} />
          <Route path="/admin/commandes" element={ <AdminRoute> <AdminCommandes /> </AdminRoute>} />

          <Route path="/client/home" element={<ClientHome refreshCart={refreshCart} />} />
          <Route path="/client/commandes" element={<ClientCommandes />} />
          <Route path="/client/wishlist" element={<Wishlist refreshCart={refreshCart} />} />

          <Route path="/client/produit/:id" element={<ProductDetail refreshCart={refreshCart} />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;