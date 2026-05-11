import { useState, useEffect } from "react";
import { getCategories, getProductsByCategory } from "../../services/serv_categories";

import CategorieCard from "../../components/client/CategorieCard";
import ProduitCard from "../../components/client/ProduitCard";

import { getCart, addToCart, updateCartItem, removeCartItem } from '../../services/serv_panier';
import PanierOverlay from '../../components/client/PanierOverlay';

function Home() {
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);

  const [showPanier, setShowPanier] = useState(false);
  const [panierItems, setPanierItems] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const valiny = await getCategories();
      setCategories(valiny.data);
    };
    fetchCategories();
  }, []);

  const handleClickCategorie = async (categorieId) => {
    const result = await getProductsByCategory(categorieId);
    setProduits(result.data);
    console.log("Produits:", result.data);
  };

  return (
    <div>

      <h1>Liste des catégories</h1>

      <button onClick={() => setShowPanier(true)}> Panier ({panierItems.length > 0 ? panierItems.length : ''}) </button>

      {categories.map((categorie) => (
        <CategorieCard key={categorie.id} categorie={categorie} onSelect={handleClickCategorie} />
      ))}

      <h2>Produits</h2>

      {produits.map(produit => (
        <ProduitCard key={produit.id} produit={produit} />
      ))}

      {showPanier && (
        <PanierOverlay 
          onClose={() => setShowPanier(false)}
          panierItems={panierItems}
          setPanierItems={setPanierItems}
          updateCartItem={updateCartItem}
          removeCartItem={removeCartItem}
        />
      )}

    </div>
  );
}

export default Home;