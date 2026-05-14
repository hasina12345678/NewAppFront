import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, moveToCart, clearWishlist } from '../../services/serv_wishlist';
import { addToCart } from '../../services/serv_panier';
import Toast from '../../components/Toast';

function Wishlist({ refreshCart }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

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
            setToast({ message: 'Produit déplacé vers le panier', type: 'success' });
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
        }
    };

    const handleClearWishlist = async () => {
        if (window.confirm('Vider toute votre liste de souhaits ?')) {
            try {
                await clearWishlist();
                await loadWishlist();
                setToast({ message: 'Liste vidée', type: 'success' });
            } catch (error) {
                setToast({ message: error.message, type: 'error' });
            }
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Ma liste de souhaits</h1>
                {wishlistItems.length > 0 && (
                    <button
                        onClick={handleClearWishlist}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Tout supprimer
                    </button>
                )}
            </div>

            {wishlistItems.length === 0 ? (
                <p>Votre liste de souhaits est vide.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {wishlistItems.map(item => (
                        <div key={item.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
                        <Link to={`/client/produit/${item.product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3>{item.product.name}</h3>
                        </Link>
                        <p>{item.product.price}€</p>
                        {item.product.images?.[0] && (
                            <img src={item.product.images[0].small_image_url} alt="" width="100" />
                        )}
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <button
                            onClick={() => handleMoveToCart(item.product.id)}
                            style={{ padding: '0.5rem', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', flex: 1 }}
                            >
                            Ajouter au panier
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
            )}
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
}

export default Wishlist;