import { useEffect, useState } from 'react';
import { getOrders } from '../../services/serv_commandes';

function ClientCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const data = await getOrders();
        setCommandes(data.data || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommandes();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Mes commandes</h1>
      {commandes.length === 0 ? (
        <p>Aucune commande</p>
      ) : (
        commandes.map(order => (
          <div key={order.id}>
            <p>Commande #{order.increment_id} - {order.status} - {order.formatted_grand_total}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ClientCommandes;