import { useState } from 'react';
import { loginClient } from '../../services/serv_auth';

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
      setError(err.message || 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '400px'
      }}>
        <h2>Connexion Client</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <button onClick={onClose} style={{ marginTop: '1rem', width: '100%' }}>
          Fermer
        </button>
      </div>
    </div>
  );
}

export default LoginModal;