import { useState } from 'react';

import { addToCart } from '../../services/serv_panier';
import Toast from '../Toast';

function ProduitCard({ produit }) {
    const [quantite, setQuantite] = useState(1);

    const [toast, setToast] = useState(null);

    const handleAjouterPanier = async () => {
        try {
            await addToCart(produit.id, quantite);

            setToast({ message: 'Produit ajouté au panier', type: 'success' });
        } catch (error) {
            // console.error('Erreur:', error);
            setToast({ message: error.message, type: 'error' });
        }
    };

    return (
        <div>
            <h3>{produit.name}</h3>

            <p>{produit.price}€</p>

            <img src={produit.images[0]?.small_image_url} alt="" width="100" />
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
