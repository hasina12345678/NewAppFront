function CarteCommande({ commande, showActions = true, onStatusChange, updatingId = null }) {
  
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
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <strong>Commande #{commande.id}</strong>
          <span style={{ marginLeft: '1rem', color: '#666', fontSize: '0.875rem' }}>
            {new Date(commande.created_at).toLocaleDateString('fr-FR')}
          </span>
        </div>
        <div>
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              backgroundColor: getStatusColor(commande.status),
              color: 'white'
            }}
          >
            {getStatusLabel(commande.status)}
          </span>
        </div>
      </div>

      {/* Client */}
      <div style={{ marginBottom: '0.75rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <strong>Client :</strong> {commande.customer_first_name} {commande.customer_last_name}<br />
        <strong>Email :</strong> {commande.customer_email}
      </div>

      {/* Total */}
      <div style={{ marginBottom: '0.75rem' }}>
        <strong>Total :</strong> <span style={{ fontSize: '1.125rem', color: '#2c3e50' }}>{commande.grand_total} €</span>
      </div>

      {/* Produits */}
      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Produits :</strong>
        <div style={{ borderTop: '1px solid #eee' }}>
          {commande.items?.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #eee'
              }}
            >
              <div>
                {item.name} x {item.qty_ordered}
              </div>
              <div style={{ fontWeight: 'bold' }}>
                {(item.price * item.qty_ordered).toFixed(2)} €
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
          {isDisabled ? (
            <span style={{ color: '#999' }}>
              {isCompleted ? '✅ Commande terminée' : '❌ Commande annulée'}
            </span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label>Changer statut :</label>
              <select
                value={commande.status}
                disabled={updatingId === commande.id}
                onChange={(e) => onStatusChange(commande, e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                {commande.status === 'pending' && (
                  <>
                    <option value="pending">En attente</option>
                    <option value="processing">En préparation</option>
                    <option value="completed">Terminée</option>
                  </>
                )}
                {commande.status === 'processing' && (
                  <>
                    <option value="processing">En préparation</option>
                    <option value="completed">Terminée</option>
                  </>
                )}
              </select>
              {updatingId === commande.id && <span>Mise à jour...</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CarteCommande;