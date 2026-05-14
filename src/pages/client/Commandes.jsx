import { useEffect, useState } from 'react';
import { getOrders } from '../../services/serv_commandes';
import CarteCommande from '../../components/CarteCommande';

function CommandesClient() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mes commandes</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {orders.map(order => (
          <CarteCommande
            key={order.id}
            commande={order}
            showActions={false}  // ← Pas d'actions pour le client
          />
        ))}
      </div>
    </div>
  );
}

export default CommandesClient;