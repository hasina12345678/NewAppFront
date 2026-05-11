import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';

function Layout({ children }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="layout">
      {isAuthenticated() && <Navbar />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;