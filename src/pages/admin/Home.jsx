import { useState } from 'react';
import { resetAllData } from '../../services/serv_admin';

import './Home.css';

function AdminHome() {
  const[message, setMessage] = useState('');

  const handleResetAll = async () => {
    if (window.confirm(' RÉINITIALISATION TOTALE ?')) {
      try {
        
        await resetAllData();
        setMessage('');
        alert('Toutes les données ont été réinitialisées');

      } catch (error) {
        console.error('Erreur:', error);
        setMessage(error.message);
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>

      <h1>Reset all data</h1>

      {message && <p style={{color:'red'}}> {message} </p> }

      <button 
        className='reset-all-btn'
        onClick={handleResetAll}
      >
        Vider toutes les données
      </button>
    </div>
  );
}

export default AdminHome;