import { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../../services/serv_panier';

import { saveAddress, saveShipping, savePayment, saveOrder } from '../../services/serv_checkout';

function PanierOverlay({ onClose, panierItems, setPanierItems }) {
    const [localItems, setLocalItems] = useState([]);

    useEffect(() => {
        chargerPanier();
    }, []);

    const chargerPanier = async () => {
        const data = await getCart();
        const items = data.data?.items || [];
        setPanierItems(items);
        setLocalItems(items);
    };

    const handleUpdateQuantite = (itemId, newQty) => {
        if (newQty < 1) return;

        // 1. Mettre à jour UI immédiatement
        const updatedItems = localItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQty } : item
        );
        setLocalItems(updatedItems);

        // 2. Appel API en arrière-plan
        updateCartItem(itemId, newQty).catch(err => {
            console.error('Erreur synchro:', err);
            chargerPanier(); // Recharge si erreur
        });
    };

    const handleSupprimer = (itemId) => {
        // 1. Mettre à jour UI immédiatement
        const filteredItems = localItems.filter(item => item.id !== itemId);
        setLocalItems(filteredItems);

        // 2. Appel API en arrière-plan
        removeCartItem(itemId).catch(err => {
            console.error('Erreur suppression:', err);
            chargerPanier();
        });
    };


    const handleValidation = async () => {
        try {
            const cartData = await getCart();
            const cart = cartData.data;
            
            const addressData = {
            billing: {
                first_name: cart.customer_first_name || "Client",
                last_name: cart.customer_last_name || "Client",
                email: cart.customer_email || "client@email.com",
                address: ["Adresse par défaut"],
                city: "Paris",
                country: "FR",
                state: "Paris",
                postcode: "75000",
                phone: "0123456789"
            },
            shipping: {
                first_name: cart.customer_first_name || "Client",
                last_name: cart.customer_last_name || "Client",
                email: cart.customer_email || "client@email.com",
                address: ["Adresse par défaut"],
                city: "Paris",
                country: "FR",
                state: "Paris",
                postcode: "75000",
                phone: "0123456789"
            }
            };
            
            console.log("Adresse envoyée:", addressData);
            
            await saveAddress(addressData);
            console.log('✓ Adresse enregistrée');
            
            await saveShipping('free_free');
            console.log('✓ Livraison enregistrée');
            
            await savePayment('cashondelivery');
            console.log('✓ Paiement enregistré');
            
            const orderResult = await saveOrder();
            console.log('✓ Commande créée', orderResult);
            
            alert('Commande validée avec succès !');
            onClose();
            
        } catch (error) {
            console.error('Erreur validation:', error);
            alert(`Erreur: ${error.message}`);
        }
    };

    const total = localItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, left: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'flex-end',
    }}>
      <div style={{
        width: '500px', backgroundColor: 'white', height: '100%',
        padding: '20px', overflow: 'auto'
      }}>
        <h2>Mon panier</h2>
        <button onClick={onClose}>✖ Fermer</button>

        {localItems.length === 0 ? (
          <p>Panier vide</p>
        ) : (
          <>
            {localItems.map(item => (
              <div key={item.id} style={{ borderBottom: '1px solid #ccc', padding: '10px', display: 'flex', gap: '10px' }}>
                <img src={item.product?.images?.[0]?.small_image_url} alt="" width="50" />
                <div style={{ flex: 1 }}>
                  <h4>{item.product?.name}</h4>
                  <p>{item.price}€ x {item.quantity} = {(item.price * item.quantity).toFixed(2)}€</p>
                  <div>
                    <button onClick={() => handleUpdateQuantite(item.id, item.quantity - 1)}>-</button>
                    <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantite(item.id, item.quantity + 1)}>+</button>
                    <button onClick={() => handleSupprimer(item.id)} style={{ marginLeft: '10px', color: 'red' }}>Supprimer</button>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '20px' }}>
              <strong>Total: {total.toFixed(2)}€</strong>
            </div>
            <button 
                onClick={handleValidation}
                style={{ 
                    marginTop: '20px', 
                    backgroundColor: '#4caf50', 
                    color: 'white', 
                    padding: '12px', 
                    width: '100%',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Valider la commande (Paiement à la livraison)
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PanierOverlay;