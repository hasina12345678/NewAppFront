import Navbar from './Navbar';

function Layout({ children, panierCount, refreshCart }) {
  const pathname = window.location.pathname;
  const hideNavbar = pathname === '/admin';
  
  return (

    <div className="layout">

      {!hideNavbar && <Navbar panierCount={panierCount} refreshCart={refreshCart} />}

      <main className="app-container">
        {children}
      </main>

    </div>
    
  );
}

export default Layout;