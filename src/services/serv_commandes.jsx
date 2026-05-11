const API_BASE = 'http://localhost:8000/api/v1/customer/orders';

const getToken = () => sessionStorage.getItem('customer_token');

const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur API');
  }
  
  return response.json();
};

// Récupérer toutes les commandes du client connecté
const getOrders = async () => {
  return fetchWithAuth(`${API_BASE}?pagination=0`);
};

// Récupérer une commande par son ID
const getOrderById = async (orderId) => {
  return fetchWithAuth(`${API_BASE}/${orderId}`);
};

// Annuler une commande
const cancelOrder = async (orderId) => {
  return fetchWithAuth(`${API_BASE}/${orderId}/cancel`, {
    method: 'POST',
  });
};

// Re-commander (ajoute au panier les produits d'une commande précédente)
const reorder = async (orderId) => {
  return fetchWithAuth(`${API_BASE}/reorder/${orderId}`, {
    method: 'GET',
  });
};

export {
  getOrders,
  getOrderById,
  cancelOrder,
  reorder
};