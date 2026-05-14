// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// import { addToCart } from '../../services/serv_panier';
// import { isCustomerLoggedIn } from '../../services/serv_auth';

// import Toast from '../Toast';

// function ProduitCard({ produit, onAddToCart }) {
//     const [quantite, setQuantite] = useState(1);
//     const [toast, setToast] = useState(null);

//     const handleAjouterPanier = async () => {
//         if (!isCustomerLoggedIn()) {
//             setToast({ message: 'Veuillez vous connecter pour ajouter au panier', type: 'error' });
//             return;
//         }

//         try {
//             await addToCart(produit.id, quantite);
//             setToast({ message: 'Produit ajouté au panier', type: 'success' });
//             if (onAddToCart) onAddToCart();
//         } catch (error) {
//             setToast({ message: error.message, type: 'error' });
//         }
//     };

//     return (
//         <div>
//             <Link to={`/client/produit/${produit.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//                 <h3>{produit.name}</h3>
//             </Link>
//             <p>{produit.price}€</p>
//             <img src={produit.images[0]?.small_image_url } alt="sary" width="100" />
//             <input 
//                 type="number" 
//                 min="1" 
//                 value={quantite} 
//                 onChange={(e) => setQuantite(e.target.value)} 
//             />
//             <button onClick={handleAjouterPanier}>Ajouter au panier</button>
//             {toast && <Toast {...toast} onClose={() => setToast(null)} />}
//         </div>
//     );
// }

// export default ProduitCard;



import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { addToCart } from '../../services/serv_panier';
import { isCustomerLoggedIn } from '../../services/serv_auth';
import { toggleWishlist, getWishlist } from '../../services/serv_wishlist';

import Toast from '../Toast';

function ProduitCard({ produit, onAddToCart, onWishlistUpdate }) {
    const [quantite, setQuantite] = useState(1);
    const [toast, setToast] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const checkWishlist = async () => {
            if (!isCustomerLoggedIn()) return;
            try {
                const wishlist = await getWishlist();
                const items = wishlist.data || [];
                const found = items.some(item => item.product_id === produit.id);
                setIsWishlisted(found);
            } catch (error) {
                console.error('Erreur vérification wishlist:', error);
            }
        };
        checkWishlist();
    }, [produit.id]);

    const handleAjouterPanier = async () => {
        if (!isCustomerLoggedIn()) {
            setToast({ message: 'Veuillez vous connecter pour ajouter au panier', type: 'error' });
            return;
        }

        try {
            await addToCart(produit.id, quantite);
            setToast({ message: 'Produit ajouté au panier', type: 'success' });
            if (onAddToCart) onAddToCart();
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
        }
    };

    const handleToggleWishlist = async () => {
        if (!isCustomerLoggedIn()) {
            setToast({ message: 'Veuillez vous connecter pour ajouter aux favoris', type: 'error' });
            return;
        }

        try {
            await toggleWishlist(produit.id);
            setIsWishlisted(!isWishlisted);
            setToast({ message: isWishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris', type: 'success' });
            if (onWishlistUpdate) onWishlistUpdate();
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
        }
    };

    return (
        <div style={{ position: 'relative', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
            {/* Icône cœur */}
            <button
                onClick={handleToggleWishlist}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: isWishlisted ? '#e74c3c' : '#ccc'
                }}
            >
                {isWishlisted ? '❤️' : '🤍'}
            </button>

            <Link to={`/client/produit/${produit.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>{produit.name}</h3>
            </Link>
            <p>{produit.price}€</p>
            <img src={produit.images[0]?.small_image_url} alt="sary" width="100" />
            <input 
                type="number" 
                min="1" 
                value={quantite} 
                onChange={(e) => setQuantite(e.target.value)} 
            />
            <button onClick={handleAjouterPanier}>Ajouter au panier</button>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
}

export default ProduitCard;