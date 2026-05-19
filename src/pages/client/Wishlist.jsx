import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { getWishlist, moveToCart, clearWishlist } from '../../services/serv_wishlist';
import { addToCart } from '../../services/serv_panier';

import { useNotify } from "../../context/NotificationContext";

import ProduitCard from '../../components/client/ProduitCard';

import Loader from '../../components/Loader';

import './Wishlist.css';

function Wishlist({ refreshCart }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const { notify } = useNotify();

    const loadWishlist = async () => {
        try {
            const response = await getWishlist();
            setWishlistItems(response.data || []);
        } catch (error) {
            console.error('Erreur chargement wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, []);

    const handleMoveToCart = async (productId) => {
        try {
            await moveToCart(productId);
            await loadWishlist();
            if (refreshCart) refreshCart();

            notify("Produit déplacé vers le panier", "success");

        } catch (error) {
            notify(error.message, "error");
        }
    };

    const handleClearWishlist = async () => {
        if (window.confirm('Vider toute votre liste de souhaits ?')) {
            try {
                await clearWishlist();
                await loadWishlist();
            
                notify("Liste vidée", "success");
                
            } catch (error) {
                notify(error.message, "error");
            }
        }
    };

    // if (loading) return <div>Chargement...</div>;
    if (loading) return <Loader />;
    // if (loading && !wishlistItems.length === 0) return <Loader />;

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <h1> Ma liste de souhaits </h1>
                {wishlistItems.length > 0 && (
                    <button onClick={handleClearWishlist} className="wishlist-clear-btn" > Tout supprimer </button>
                )}
            </div>

            {wishlistItems.length === 0 ? (
                <div className="wishlist-empty"> Liste de souhaits est vide.</div>
            ) : (
            <div className="wishlist-grid">
                {wishlistItems.map((item) => (
                    <ProduitCard
                        key={item.id}
                        produit={item.product}
                        wishlistItems={wishlistItems}
                        onWishlistUpdate={loadWishlist}
                        onAddToCart={refreshCart}
                    />
                ))}
            </div>
            )}
        </div>
    );
}

export default Wishlist;