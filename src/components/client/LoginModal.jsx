import { useState } from 'react';
import { loginClient } from '../../services/serv_auth';
import '../../assets/css/Login.css';

function LoginModal({ onClose, onLoginSuccess }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await loginClient(email, password);

      if (onLoginSuccess) onLoginSuccess();

      onClose();

    } catch (err) {
      setError('Email ou mots de passe Invalide');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">

      <div className="login-card">

        <div className="login-header">
          <h2>Connexion Client</h2>
          <p>Connectez-vous à votre compte</p>
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
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>

            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

        </form>

        <button onClick={onClose} className="close-btn">
          Fermer
        </button>

      </div>

    </div>
  );
}

export default LoginModal;