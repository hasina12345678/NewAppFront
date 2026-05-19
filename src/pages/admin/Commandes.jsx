import { useEffect, useState } from 'react';
import { getOrders, createInvoice, createShipment } from '../../services/serv_admin';
import CarteCommande from '../../components/CarteCommande';
import './Commandes.css';

import Loader from '../../components/Loader';

function Commandes() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error("Erreur chargement commandes :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async ( order, newStatus ) => {
    try {
      setUpdatingId(order.id);
      const hasInvoice = order.invoices && order.invoices.length > 0;
      const hasShipment = order.shipments && order.shipments.length > 0;
      // processing = invoice
      if (newStatus === 'processing') {
        if (!hasInvoice) {
          await createInvoice(order);
        }
      }
      // completed = invoice + shipment
      if (newStatus === 'completed') {
        if (!hasInvoice) {
          await createInvoice(order);
        }
        if (!hasShipment) {
          const updatedOrders = await getOrders();
          const freshOrder = updatedOrders.data.find(o => o.id === order.id );
          await createShipment(freshOrder);
        }
      }
      await loadOrders();
      // alert("Commande mise à jour");

    } catch (err) {
      console.error("Erreur update status :",err);
      alert(err.message || "Erreur mise à jour commande");
    } finally {
      setUpdatingId(null);
    }
  };

  // if (loading) return <div>Chargement commandes...</div>;
  if (loading) return <Loader />;

  return (
    <div className='commandes-page'>
      <h1>Gestion des commandes</h1>
      {orders.length === 0 && <p>Aucune commande</p>}
      <div className='commandes'>
        {orders.map(order => (
          <CarteCommande
            key={order.id}
            commande={order}
            showActions={true}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />
        ))}
      </div>
    </div>
  );
}

export default Commandes;




