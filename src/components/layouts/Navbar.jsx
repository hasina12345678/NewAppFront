import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated()) {
    return null;
  }

  const userNavItems = [
    { path: '/client/home', label: 'Home' },
    // { path: '/client/panier', label: 'Panier' },
    { path: '/client/commandes', label: 'Commandes' },
  ];

  const adminNavItems = [
    { path: '/admin/home', label: 'Home' },
    { path: '/admin/produit', label: 'Produits' },
    { path: '/admin/statistique', label: 'Statistiques' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        logo
      </div>
      
      <div className="navbar-links">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="navbar-user">
        <span className="user-name">
          {user?.first_name} {user?.last_name}
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;