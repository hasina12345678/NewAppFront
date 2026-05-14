import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { isCustomerLoggedIn, getCurrentCustomer, logoutClient } from '../../services/serv_auth';
import LoginModal from '../client/LoginModal';
import PanierOverlay from '../client/PanierOverlay';
import './Navbar.css';

function Navbar({ panierCount, refreshCart }) {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPanier, setShowPanier] = useState(false);
  const [customer, setCustomer] = useState(getCurrentCustomer());
  
  const isAdmin = pathname.startsWith('/admin');
  const isLoggedIn = isCustomerLoggedIn();

  const handleLogout = () => {
    if (isAdmin) {
      sessionStorage.removeItem('admin_logged_in');
      navigate('/client/home');
    } else {
      logoutClient();
      setCustomer(null);
      refreshCart();
      navigate('/client/home');
    }
  };

  const handleLoginSuccess = () => {
    setCustomer(getCurrentCustomer());
    refreshCart();
    window.location.reload();
  };

  const userNavItems = [
    { path: '/client/home', label: 'Home' },
    { path: '/client/commandes', label: 'Commandes' },
    { path: '/client/wishlist', label: 'Wishlist' },
  ];

  const adminNavItems = [
    { path: '/admin/home', label: 'Home' },
    { path: '/admin/import', label: 'Import' },
    { path: '/admin/images', label: 'Images' },
    { path: '/admin/commandes', label: 'Commandes' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">New App</div>
        
        <div className="navbar-links">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-user">
          {!isAdmin && (
            <>
              <button onClick={() => setShowPanier(true)} className="cart-btn"> 🛒 ({panierCount}) </button>
              
              {isLoggedIn ? (
                <>
                  <span className="user-name"> {customer?.first_name} {customer?.last_name} </span>
                  <button onClick={handleLogout} className="logout-btn"> Déconnexion </button>
                </>
              ) : (
                <button onClick={() => setShowLoginModal(true)} className="login-btn"> Se connecter </button>
              )}
            </>
          )}
          
          {isAdmin && ( <button onClick={handleLogout} className="logout-btn"> Déconnexion </button> )}
        </div>
      </nav>

      {showLoginModal && ( <LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} /> )}

      {showPanier && ( <PanierOverlay onClose={() => setShowPanier(false)} onRefresh={refreshCart} /> )}
    </>
  );
}

export default Navbar;