import { useEffect, useState } from 'react';
import { addStock, getOrders } from '../../services/serv_admin';
import { getProduits } from '../../services/serv_produit';

import './Stock.css';

import Loader from '../../components/Loader';

function AdminStock() {

  const [products, setProducts] = useState([]);
  const [qtyState, setQtyState] = useState({});

  const [loading, setLoading] = useState(true);

  const [showTable, setShowTable] = useState(false);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    const data = await getProduits();
    setProducts(data.data);
    setLoading(false);
  };

  const handleAddStock = async (productId, qty) => {
    try {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id !== productId) return p;
            const currentQty = p.inventory_indices?.[0]?.qty || 0;
            return {
              ...p,
              inventory_indices: [
                {
                  ...p.inventory_indices?.[0],
                  qty: currentQty + parseInt(qty || 0),
                },
              ],
            };
          })
        );
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

  const loadOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error("Erreur chargement commandes :", err);
    }
  };

  const soldMap = {};

  orders.forEach((c) => {
    c.items?.forEach((i) => {
      const id = i.product_id;
      soldMap[id] = (soldMap[id] || 0) + Number(i.qty_shipped || 0);
    });
  });

   if (loading) return <Loader />;

  return (
    <div className="stock-page">
        <div className="stock-header">
          <h1>{showTable ? "Quantite final du produit" : "Ajout de Stock"}</h1>

          <button className="stock-switch-btn" onClick={() => setShowTable(!showTable)} >
            {showTable ? "Ajouter Stock" : "Voir Stock"}
          </button>
        </div>

      {!showTable ? (

        <div className="stock-grid">
          {products.map((p) => (
            <div key={p.id} className="stock-card">
              <div className="stock-image-wrapper">
                {p.images?.[0]?.small_image_url ? (
                  <img src={p.images[0].small_image_url} alt={p.name} className="stock-image" />
                ) : (
                  <div className="stock-no-image">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M4 16l4-4 3 3 5-5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className="stock-info">
                <h3 className="stock-product-name"> {p.name} </h3>
                <p className="stock-price"> {Number(p.price)} € </p>
                <p className="stock-qty">Stock : {p.inventory_indices?.[0]?.qty || 0} </p>
                {/* <p className="stock-qty">Stock : {p.inventories?.[0]?.qty || 0} </p> */}
              </div>

              <div className="stock-actions">
                <input
                  type="number"
                  value={qtyState[p.id] || ""}
                  onChange={(e) => handleChangeQty(e, p.id)}
                  className="stock-input"
                />

                <button onClick={() => handleAddStock(p.id, qtyState[p.id])} className="stock-btn" >Ajouter</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='stock-list-table'>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Disponible</th>
                <th>Commandée</th>
                <th>Vendue</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.inventory_indices?.[0]?.qty || 0}</td>
                  <td>{p.ordered_inventories?.[0]?.qty || 0}</td>
                  <td>{soldMap[p.id] || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

}

export default AdminStock;