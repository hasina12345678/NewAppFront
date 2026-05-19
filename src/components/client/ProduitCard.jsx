import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { addToCart } from '../../services/serv_panier';
import { isCustomerLoggedIn } from '../../services/serv_auth';
import { toggleWishlist } from '../../services/serv_wishlist';

import { useNotify } from "../../context/NotificationContext";

import './ProduitCard.css';

function ProduitCard({ produit, wishlistItems, onWishlistUpdate, onAddToCart }) {

    const [quantite, setQuantite] = useState(1);
    const { notify } = useNotify();

    const isWishlisted = wishlistItems?.some( item => item?.product?.id === produit.id);

    const handleAjouterPanier = async () => {
        if (!isCustomerLoggedIn()) {
            notify("Veuillez vous connecter", "error");
            return;
        }
        try {
            await addToCart(produit.id, quantite);
            notify("Produit ajouté", "success");
            if (onAddToCart) onAddToCart();
        } catch (error) {
            notify(error.message,"error" );
        }
    };

    const handleToggleWishlist = async () => {
        if (!isCustomerLoggedIn()) {
            notify("Veuillez vous connecter", "error");
            return;
        }
        try {
            await toggleWishlist(produit.id);
            if (onWishlistUpdate) onWishlistUpdate();
            notify(
                isWishlisted ? 
                "Retiré des favoris" : "Ajouté aux favoris",
                "success"
            );
            
        } catch (error) {
            notify(error.message, "error");
        }
    };

    return (
        <div className="product-card">
            <button type="button" onClick={handleToggleWishlist} className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} >
                {/* cercle de fond */}
                <span className="wishlist-circle"></span>

                {/* icône coeur */}
                <svg viewBox="0 0 24 24" className="wishlist-icon">
                    <path d="M12 20.5L10.55 19.2C5.4 14.55 2 11.48 2 7.9C2 5 4.2 3 7 3C8.8 3 10.5 3.9 12 5.3C13.5 3.9 15.2 3 17 3C19.8 3 22 5 22 7.9C22 11.48 18.6 14.55 13.45 19.2L12 20.5Z" stroke="currentColor"
                    // strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                </svg>
            </button>

            <Link to={`/client/produit/${produit.id}`} className="product-link">
                <div className="product-image-wrapper">
                    {produit.images?.[0]?.small_image_url ? (
                        <img src={produit.images[0].small_image_url} alt={produit.name} className="product-image" />
                    ) : (
                        <div className="image-placeholder">
                            <svg viewBox="0 0 24 24" width="40" height="40" fill="none">
                                <path d="M4 5h16v14H4V5z" stroke="currentColor" strokeWidth="2" />
                                <path d="M4 15l4-4 4 4 4-4 4 4" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span>Aucune image</span>
                        </div>
                    )}
                </div>
                <h3 className="product-title"> {produit.name}</h3>
            </Link>

            {/* <p className="product-price"> {produit.price} €</p> */}
            <p className="product-price"> { Number(produit.price) } €</p>
            

            <input type="number" min="1" value={quantite} onChange={(e) => setQuantite(e.target.value)} className="product-input" />

            <button onClick={handleAjouterPanier} className="product-btn"> Ajouter </button>

        </div>
    );
}

export default ProduitCard;
