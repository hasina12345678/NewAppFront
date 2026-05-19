import { useEffect, useState } from 'react';
import { getOrders } from '../../services/serv_commandes';
import CarteCommande from '../../components/CarteCommande';

import Loader from '../../components/Loader';

import './Commande.css';

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

  // if (loading) return <div>Chargement...</div>;
  if (loading) return <Loader />;

  return (
    <div className='commande-page'>
      <h1>Mes commandes</h1>
      <div className='commandes'>
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