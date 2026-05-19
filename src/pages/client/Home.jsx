import { useState, useEffect } from "react";

import { isCustomerLoggedIn } from '../../services/serv_auth';

import { getCategories, getProductsByCategory } from "../../services/serv_categories";

import CategorieCard from "../../components/client/CategorieCard";
import ProduitCard from "../../components/client/ProduitCard";

import { toggleWishlist, getWishlist } from '../../services/serv_wishlist';

import Loader from '../../components/Loader';

import './Home.css';

function Home({ refreshCart }) {

  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);

  const [activeCategorieId, setActiveCategorieId] = useState(null);

  const categoriesFiltrees = categories.filter(cat => cat.name !== "Racine");
  
  const [wishlistItems, setWishlistItems] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const catRes = await getCategories();
      const cats = catRes.data || [];

      setCategories(cats);

      const filtered = cats.filter(cat => cat.name !== "Racine");

      if (filtered.length > 0) {
        const firstCatId = filtered[0].id;

        setActiveCategorieId(firstCatId);

        const prodRes = await getProductsByCategory(firstCatId);
        setProduits(prodRes.data || []);
      }

      setLoading(false);
    };

    init();
  }, []);


  
  useEffect(() => {
    loadWishlist();
  }, []);

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  const fetchCategories = async () => {
    const result = await getCategories();
    setCategories(result.data);
  };

  const loadWishlist = async () => {
    if (!isCustomerLoggedIn()) return;
    const res = await getWishlist();
    setWishlistItems(res.data || []);
  };

  const handleClickCategorie = async (categorieId) => {
    setActiveCategorieId(categorieId);
    const result = await getProductsByCategory(categorieId);
    setProduits(result.data);
  };

  if (loading) return <Loader />;

  return (

    <div className="home-page">
      <div className="categories-section">
        {/* <h2>Catégories</h2> */}
        <div className="categories-list">
          {categoriesFiltrees.map((categorie) => (
            <CategorieCard
              key={categorie.id}
              categorie={categorie}
              onSelect={handleClickCategorie}
              isActive={activeCategorieId === categorie.id}
            />
          ))}
        </div>
      </div>

      <div className="products-section">
        <h1>Produits</h1>
        {produits.length === 0 && (<p>Sélectionnez une catégorie pour afficher les produits correspondants.</p>)}

        <div className="products-grid">
          {produits.map((produit) => (
            <ProduitCard
              key={produit.id}
              produit={produit}
              wishlistItems={wishlistItems}
              onWishlistUpdate={loadWishlist}
              onAddToCart={refreshCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;



