import { useState } from 'react';
import '../assets/css/Login.css';

function Login() {

  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    if(email === "admin@gmail.com" && password === "admin123"){

      sessionStorage.setItem('admin_logged_in', 'true');

      window.location.href = '/admin/home';

    } else {
      setError('Email ou mot de passe incorrect');
    }

    setLoading(false);
  };

  return (
    <div className="login-overlay">

      <div className="login-card">

        <div className="login-header">
          <h2>Connexion Admin</h2>
          <p>Administration Dashboard</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@gmail.com"
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="admin123"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;