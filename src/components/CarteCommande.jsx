import { useState } from 'react';
import './CarteCommande.css';

function CarteCommande({ commande, showActions = true, onStatusChange, updatingId = null }) {
  const [showItems, setShowItems] = useState(false);

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'En attente',
      'processing': 'En préparation',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f39c12',
      'processing': '#3498db',
      'completed': '#2ecc71',
      'cancelled': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const isCompleted = commande.status === 'completed';
  const isCancelled = commande.status === 'cancelled';
  const isDisabled = isCompleted || isCancelled;

  return (
    <div className="commande-card">

      <div className="commande-header">
        <div className="commande-left">
          <h3 className="commande-id"> Commande #{commande.id}</h3>
          <div className="commande-dates">
            {/* <span> UTC : {commande.created_at.replace('T', ' ').replace('Z', '').replace('.000000', '')} </span> */}
            <span> <strong>Date :</strong> {new Date(commande.created_at).toLocaleString('fr-FR')}</span>
          </div>
        </div>
        <span className={`commande-status status-${commande.status}`}> {getStatusLabel(commande.status)}</span>
      </div>  

      <div className="commande-client">
        <p> <strong>Client :</strong> {commande.customer_first_name} {' '} {commande.customer_last_name}</p>
        <p> <strong>Email :</strong> {commande.customer_email} </p>
      </div>

      <div className="commande-total">
        <span>Total :</span>
        <strong> {Number(commande.grand_total)} €</strong>
      </div>

      {showActions && (
        <div className="commande-actions">
          {isDisabled ? (
            <span className="commande-disabled">
              {/* {isCompleted
                ? 'Commande terminée'
                : 'Commande annulée'
              } */}
            </span>
          ) : (
            <div className="commande-select-wrapper">
              <label> Status : </label>

              <select value={commande.status} disabled={updatingId === commande.id}
                onChange={(e) =>
                  onStatusChange(commande, e.target.value)
                }
                className="commande-select"
              >
                {commande.status === 'pending' && (
                  <>
                    <option value="pending">  Pending </option>
                    <option value="processing"> Processing </option>
                    <option value="completed">Completed </option>
                  </>
                )}

                {commande.status === 'processing' && (
                  <>
                    <option value="processing"> Processing </option>

                    <option value="completed"> Completed</option>
                  </>
                )}

              </select>

              {updatingId === commande.id && (
                <span> Mise à jour... </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Produits */}
      <div className="commande-products">

        <button type="button" className="toggle-items-btn" onClick={() => setShowItems(!showItems)}>
          <svg className={`toggle-icon ${showItems ? 'open' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showItems && (
          <div className="commande-products-list">
            {commande.items?.map((item) => (
              <div key={item.id} className="commande-product-item">
                <div className="commande-product-left">
                  {item.product?.images?.[0]?.small_image_url ? (
                    <img src={item.product.images[0].small_image_url} alt={item.name} className="commande-product-image" />
                  ) : (
                    <div className="commande-no-image">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        <path d="M4 16l4-4 3 3 5-5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                      </svg>
                    </div>
                  )}

                  <div className="commande-product-info">
                    <div className="commande-product-name">{item.name}</div>
                    <div className="commande-product-qte">Qté : {item.qty_ordered}</div>
                  </div>

                </div>

                <div className="commande-product-price"> {(item.price * item.qty_ordered)} € </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

}

export default CarteCommande;