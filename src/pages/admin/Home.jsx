import { resetAllData } from '../../services/serv_admin';

function AdminHome() {

  const handleResetAll = async () => {
    if (window.confirm(' RÉINITIALISATION TOTALE ?')) {
      try {
        await resetAllData();
        alert('Toutes les données ont été réinitialisées');
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la réinitialisation');
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button 
        onClick={handleResetAll} 
        style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: '#e67e22', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Vider toutes les données
      </button>
    </div>
  );
}

export default AdminHome;