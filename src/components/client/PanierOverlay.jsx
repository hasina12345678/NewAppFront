import { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeCartItem } from '../../services/serv_panier';
import CheckoutModal from './CheckoutModal';

import './PanierOverlay.css';

import { useNotify } from "../../context/NotificationContext";

function PanierOverlay({ onClose, onRefresh }) {
    const [localItems, setLocalItems] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [disabledButtons, setDisabledButtons] = useState({});

    const { notify } = useNotify();

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
            notify("Stock insuffisant", "error");
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
        <div className="cart-overlay">

            <div className="cart-panel">

                <div className="cart-header">
                    <h2>Mon panier</h2>
                    <button onClick={onClose} className="close-cart-btn">
                        X
                    </button>
                </div>

                {localItems.length === 0 ? (
                <p className="cart-empty">Panier vide</p>
                ) : (
                <>
                    <div className="cart-items">

                    {localItems.map(item => (
                        <div key={item.id} className="cart-item">

                        <div className="cart-image-wrapper">
                            {item.product?.images?.[0]?.small_image_url ? (
                                <img src={item.product.images[0].small_image_url} alt="" className="cart-img" />
                            ) : (
                                <div className="cart-no-image">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                        <path d="M4 16l4-4 3 3 5-5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                                    </svg>
                                </div>
                            )}

                        </div>

                        <div className="cart-info">

                            <h4 className="cart-name">
                            {item.product?.name}
                            </h4>

                            <p className="cart-price">
                            {Number(item.price)} € x {item.quantity} = {(item.price * item.quantity)} €
                            </p>

                            <div className="cart-actions">

                            <button
                                onClick={() => handleUpdateQuantite(item.id, item.quantity - 1)}
                                className="qty-btn"
                            >-</button>

                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                    handleUpdateQuantite(item.id, Number(e.target.value))
                                }
                                min={1}
                                className="cart-qty-input"
                            />

                            <button
                                onClick={() => handleUpdateQuantite(item.id, item.quantity + 1)}
                                disabled={disabledButtons[item.id]}
                                className="qty-btn"
                            >+</button>

                            <button
                                onClick={() => handleSupprimer(item.id)}
                                className="delete-btn"
                            > x </button>

                            </div>

                        </div>

                        </div>
                    ))}

                    </div>

                    <div className="cart-footer">

                        <strong>Total: {total} € </strong>

                        <button onClick={handleValidationClick} className="checkout-btn"> Valider la commande</button>

                    </div>
                </>
                )}

            </div>

        </div>

            {showCheckout && (
            <CheckoutModal
                onClose={() => setShowCheckout(false)}
                onSuccess={handleCheckoutSuccess}
            />
            )}

        </>
    );
}

export default PanierOverlay;