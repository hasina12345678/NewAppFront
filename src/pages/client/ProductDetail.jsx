import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduitById } from '../../services/serv_produit';
import { addToCart } from '../../services/serv_panier';
import { isCustomerLoggedIn } from '../../services/serv_auth';

import {getStockByProductId} from '../../services/serv_admin';

import { useNotify } from "../../context/NotificationContext";

import Loader from '../../components/Loader';

import './ProductDetail.css';

function ProductDetail({ refreshCart }) {
  const { id } = useParams();
  const [produit, setProduit] = useState(null);
  const [stock, setStock] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { notify } = useNotify();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduitById(id);
        // const stockResult = await getStockByProductId(id);
        const stockResult = data.data.inventory_indices[0].qty;
        setProduit(data.data);
        setStock(stockResult);

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
      notify("Veuillez vous connecter", "error");
      return;
    }

    try {
      await addToCart(produit.id, quantite);
      notify("Produit ajouté au panier", "success");
      if (refreshCart) refreshCart();
    } catch (error) {
      notify(error.message, "error");
    }
  };

  if (loading) return <Loader />;
  if (!produit) return <div>Produit non trouvé</div>;

  const images = produit.images || [];
  const mainImage = images[selectedImage]?.large_image_url || produit.base_image?.large_image_url;

  

  return (
    <div className="product-page">

      <div className="product-layout">

        {/* Images */}
        <div className="product-images">

          <img
            src={mainImage}
            alt={produit.name}
            className="product-main-image"
          />

          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((img, index) => (
                <img
                  key={img.id || index}
                  src={img.small_image_url || img.url}
                  alt={`${produit.name} - ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="product-info">

          <h1 className="product-details-title">{produit.name}</h1>

          <div className="product-price">
            {produit.special_price ? (
              <>
                <span className="price-special">
                  {produit.formatted_special_price || `${produit.special_price}€`}
                </span>
                <span className="price-old">
                  {produit.formatted_price || `${produit.price}€`}
                </span>
              </>
            ) : (
              <span className="price-normal">
                {produit.formatted_price || `${produit.price}€`}
              </span>
            )}
          </div>

          <div className="product-categories">
            Categorie : {produit.categories.map(c => (
              <span>{c.name} </span>
            ))}
          </div>

          <div className="product-description"> { produit.description } </div>

          <div className="product-stock">
            Qte dispo : {stock}
          </div>

          <div className="product-actions">

            {/* <label>Quantité:</label> */}

            <input
              type="number"
              min="1"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              className="product-qty-input"
            />

            <button
              onClick={handleAjouterPanier}
              className="add-cart-btn"
            >
              Ajouter au panier
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetail;