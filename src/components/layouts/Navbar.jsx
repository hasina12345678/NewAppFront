import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { isCustomerLoggedIn, getCurrentCustomer, logoutClient } from '../../services/serv_auth';
import LoginModal from '../client/LoginModal';
import PanierOverlay from '../client/PanierOverlay';
import './Navbar.css';

function Navbar({ panierCount, refreshCart }) {

  const [theme, setTheme] = useState( document.body.classList.contains('dark') ? 'dark' : 'light');

  const navigate = useNavigate();

  const pathname = window.location.pathname;

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPanier, setShowPanier] = useState(false);
  const [customer, setCustomer] = useState(getCurrentCustomer());
  
  const isAdmin = pathname.startsWith('/admin');
  const isLoggedIn = isCustomerLoggedIn();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    document.body.classList.remove('light', 'dark');
    document.body.classList.add(newTheme);

    setTheme(newTheme);
  };

  const handleLogout = () => {
    if (isAdmin) {
      sessionStorage.removeItem('admin_logged_in');
      window.location.reload();
      navigate('/client/home');
    } else {
      logoutClient();
      setCustomer(null);
      refreshCart();
      navigate('/client/home');
    }
  };

  const home = () =>{
    navigate('/');
  }

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
    { path: '/admin/stock', label: 'Stock' },
    { path: '/admin/commandes', label: 'Commandes' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <>
      <nav className="navbar">
        
        <div className="navbar-logo" onClick={home}>ETU3519</div>

        <div className="navbar-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-user">

          {/* 🌗 THEME TOGGLE */}
          <button onClick={toggleTheme} className="icon-btn">
            {theme === "light" ? (
              // moon
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                  d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              // sun
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {/* 🛒 CART */}
          {!isAdmin && (
            <>
              <button onClick={() => setShowPanier(true)} className="icon-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <path
                    d="M6 6h15l-1.5 9h-12L6 6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M6 6L5 3H2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="9" cy="20" r="1" fill="currentColor" />
                  <circle cx="18" cy="20" r="1" fill="currentColor" />
                </svg>

                <span className="badge">{panierCount}</span>
              </button>

              {/* 👤 USER */}
              {isLoggedIn ? (
                <>
                  <div className="profile-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <path
                        d="M20 21a8 8 0 0 0-16 0"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                    </svg>

                    <span className="user-name">
                      {customer?.first_name} {customer?.last_name}
                    </span>
                  </div>

                  {/* 🚪 LOGOUT ICON */}
                  <button onClick={handleLogout} className="icon-btn" data-label="Logout">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <path
                        d="M10 17l5-5-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M15 12H3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M21 3v18"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <button onClick={() => setShowLoginModal(true)} className="icon-btn" data-label="Login">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </>
          )}

          {isAdmin && (
            <button onClick={handleLogout} className="icon-btn danger">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                  d="M10 17l5-5-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M15 12H3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M21 3v18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          )}
        </div>
      </nav>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showPanier && (
        <PanierOverlay
          onClose={() => setShowPanier(false)}
          onRefresh={refreshCart}
        />
      )}
    </>
  );
}

export default Navbar;