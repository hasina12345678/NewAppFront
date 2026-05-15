import { useEffect, useState } from 'react';
import { addStock, getProduits } from '../../services/serv_admin';

function AdminStock() {

  const [products, setProducts] = useState([]);
  const [qtyState, setQtyState] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProduits();
    setProducts(data.data);
  };

  const handleAddStock = async (productId, qty) => {
    try {
        setProducts((prev) => prev.map((p) => p.id === productId ? { ...p,  inventories: [ { ...p.inventories[0], qty: p.inventories[0].qty + parseInt(qty) } ] } : p));
        await addStock(productId, qty);
        setQtyState({...qtyState, [productId]: ''});
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleChangeQty = (e, productId) => {
    const valeur = e.target.value;
    setQtyState({
      ...qtyState,
      [productId]: valeur
    });
  };

  return (
    <div style={{ padding: '2rem' }}>

      <h1>Liste des produits</h1>

      {products.map((p) => (
        <div key={p.id}>

          <p>{p.name} - {p.price} - Stock : {p.inventories[0].qty} </p>

          <input type="number" value={qtyState[p.id] || "" } onChange={(e) => handleChangeQty(e, p.id)} />

          <button onClick={() => handleAddStock(p.id, qtyState[p.id])} >
            Ajouter
          </button>

        </div>
      ))}

    </div>
  );
}

export default AdminStock;