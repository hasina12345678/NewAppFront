import { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeCartItem } from '../../services/serv_panier';
import CheckoutModal from './CheckoutModal';

import Toast from '../Toast';

function PanierOverlay({ onClose, onRefresh }) {
    const [localItems, setLocalItems] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [disabledButtons, setDisabledButtons] = useState({});
    const [toast, setToast] = useState(null);

    useEffect(() => {
        chargerPanier();
    }, []);

    const chargerPanier = async () => {
        const data = await getCart();
        const items = data.data?.items || [];
        setLocalItems(items);
    };

    const handleUpdateQuantite = async (itemId, newQty) => {
        if (newQty < 1) return;

        setDisabledButtons(prev => ({ ...prev, [itemId]: false }));

        const updatedItems = localItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQty } : item
        );
        setLocalItems(updatedItems);
        
        try {
            await updateCartItem(itemId, newQty);
            // chargerPanier();
        } catch (error) {
            chargerPanier();
            setDisabledButtons(prev => ({ ...prev, [itemId]: true }));
            setToast({ message: 'Stock insuffisant', type: 'error' });
            setTimeout(() => setToast(null), 2000);
        }
    };

    const handleSupprimer = (itemId) => {
        const filteredItems = localItems.filter(item => item.id !== itemId);
        setLocalItems(filteredItems);
        removeCartItem(itemId).catch(() => chargerPanier());
        chargerPanier();
    };

    const handleValidationClick = () => {
        setShowCheckout(true);
    };

    const handleCheckoutSuccess = () => {
        if (onRefresh) onRefresh();
        onClose();
    };

    const total = localItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <>
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
                    <button onClick={onClose}>Fermer</button>

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
                                            <button onClick={() => handleUpdateQuantite(item.id, item.quantity + 1)} disabled={disabledButtons[item.id]}>+</button>
                                            <button onClick={() => handleSupprimer(item.id)} style={{ marginLeft: '10px', color: 'red' }}>Supprimer</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div style={{ marginTop: '20px' }}>
                                <strong>Total: {total.toFixed(2)}€</strong>
                            </div>
                            <button 
                                onClick={handleValidationClick}
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
                                Valider la commande
                            </button>
                        </>
                    )}
                </div>
            </div>

            {showCheckout && (
                <CheckoutModal onClose={() => setShowCheckout(false)} onSuccess={handleCheckoutSuccess} />
            )}

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </>
    );
}

export default PanierOverlay;