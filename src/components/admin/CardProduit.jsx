function CardProduit({ produit, onEdit, onDelete }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Image */}
      {produit.images && produit.images.length > 0 && (
        <img 
          src={produit.images[0].url} 
          alt={produit.name}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}
        />
      )}
      
      {/* Infos principales */}
      <h3 style={{ margin: '0 0 0.5rem 0' }}>{produit.name}</h3>
      <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
        SKU: {produit.sku}
      </p>
      
      <div style={{ marginBottom: '0.5rem' }}>
        {produit.price && (
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            marginRight: '1rem'
          }}>
            {produit.price} €
          </span>
        )}
        
        {produit.special_price && (
          <span style={{ 
            fontSize: '1rem', 
            color: '#e74c3c',
            textDecoration: 'line-through'
          }}>
            {produit.special_price} €
          </span>
        )}
      </div>
      
      {/* Attributs voiture */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.5rem',
        marginBottom: '1rem',
        fontSize: '0.85rem'
      }}>
        {produit.color && (
          <span style={{ backgroundColor: '#ecf0f1', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            Couleur: {produit.color}
          </span>
        )}
        {produit.transmission && (
          <span style={{ backgroundColor: '#ecf0f1', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            Transmission: {produit.transmission}
          </span>
        )}
        {produit.carburant && (
          <span style={{ backgroundColor: '#ecf0f1', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            Carburant: {produit.carburant}
          </span>
        )}
        {produit.weight && (
          <span style={{ backgroundColor: '#ecf0f1', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            Poids: {produit.weight} kg
          </span>
        )}
      </div>
      
      {/* Statut */}
      <div style={{ marginBottom: '1rem' }}>
        <span style={{
          display: 'inline-block',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          backgroundColor: produit.status === 1 ? '#d4edda' : '#f8d7da',
          color: produit.status === 1 ? '#155724' : '#721c24'
        }}>
          {produit.status === 1 ? 'Actif' : 'Inactif'}
        </span>
      </div>
      
      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => onEdit(produit)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(produit.id)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default CardProduit;