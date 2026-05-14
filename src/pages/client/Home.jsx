import { useState, useEffect } from "react";
import { getCategories, getProductsByCategory } from "../../services/serv_categories";
import CategorieCard from "../../components/client/CategorieCard";
import ProduitCard from "../../components/client/ProduitCard";

function Home({ refreshCart }) {
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const categoriesFiltrees = categories.filter(cat => cat.name !== "Racine");

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories();
      setCategories(result.data);
    };

    fetchCategories();
  }, []);

  const handleClickCategorie = async (categorieId) => {
    const result = await getProductsByCategory(categorieId);
    setProduits(result.data);
  };

  return (
    <div>
      <h1>Liste des catégories</h1>

      {categoriesFiltrees.map((categorie) => (
        <CategorieCard key={categorie.id} categorie={categorie} onSelect={handleClickCategorie} />
      ))}

      <h2>Produits</h2>
      {produits.length === 0 && <p>Aucun produit pour cette catégorie</p>}
      {produits.map(produit => (
        <ProduitCard key={produit.id} produit={produit} onAddToCart={refreshCart} />
      ))}
    </div>
  );
}

export default Home;