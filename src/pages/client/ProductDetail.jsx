import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduitById } from '../../services/serv_produit';
import { addToCart } from '../../services/serv_panier';
import { isCustomerLoggedIn } from '../../services/serv_auth';
import Toast from '../../components/Toast';

function ProductDetail({ refreshCart }) {
  const { id } = useParams();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantite, setQuantite] = useState(1);
  const [toast, setToast] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduitById(id);
        setProduit(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAjouterPanier = async () => {
    if (!isCustomerLoggedIn()) {
      setToast({ message: 'Veuillez vous connecter', type: 'error' });
      return;
    }

    try {
      await addToCart(produit.id, quantite);
      setToast({ message: 'Produit ajouté au panier', type: 'success' });
      if (refreshCart) refreshCart();
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!produit) return <div>Produit non trouvé</div>;

  const images = produit.images || [];
  const mainImage = images[selectedImage]?.large_image_url || produit.base_image?.large_image_url;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Section Images */}
        <div style={{ flex: 1 }}>
          {/* Image principale */}
          <img 
            src={mainImage} 
            alt={produit.name} 
            style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', objectFit: 'cover' }}
          />
          
          {/* Miniatures */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {images.map((img, index) => (
                <img
                  key={img.id || index}
                  src={img.small_image_url || img.url}
                  alt={`${produit.name} - ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid #4caf50' : '1px solid #ddd',
                    opacity: selectedImage === index ? 1 : 0.7
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Infos produit */}
        <div style={{ flex: 1 }}>
          <h1>{produit.name}</h1>
          
          {/* Prix */}
          <div>
            {produit.special_price ? (
              <>
                <span style={{ fontSize: '1.5rem', color: '#e74c3c', marginRight: '1rem' }}>
                  {produit.formatted_special_price || `${produit.special_price}€`}
                </span>
                <span style={{ textDecoration: 'line-through', color: '#999' }}>
                  {produit.formatted_price || `${produit.price}€`}
                </span>
              </>
            ) : (
              <span style={{ fontSize: '1.5rem', color: '#e74c3c' }}>
                {produit.formatted_price || `${produit.price}€`}
              </span>
            )}
          </div>
          
          {/* Description */}
          <div dangerouslySetInnerHTML={{ __html: produit.description }} style={{ marginTop: '1rem' }} />
          
          {/* Quantité et panier */}
          <div style={{ marginTop: '2rem' }}>
            <label>Quantité: </label>
            <input 
              type="number" 
              min="1" 
              value={quantite} 
              onChange={(e) => setQuantite(e.target.value)}
              style={{ width: '60px', marginLeft: '10px', padding: '5px' }}
            />
            <button 
              onClick={handleAjouterPanier}
              style={{
                marginLeft: '1rem',
                padding: '10px 20px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default ProductDetail;