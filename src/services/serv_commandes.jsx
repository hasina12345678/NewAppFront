const API_BASE = 'http://localhost:8000/api/v1/customer/orders';

const getToken = () => sessionStorage.getItem('customer_token');

const isCustomerLoggedIn = () => {
  return sessionStorage.getItem('customer_token') !== null;
};

const fetchWithAuth = async (url, options = {}) => {
  if (!isCustomerLoggedIn()) {
    throw new Error('Utilisateur non connecté');
  }
  
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

const getOrders = async () => {
  if (!isCustomerLoggedIn()) return { data: [] };
  return fetchWithAuth(`${API_BASE}`);
};

const getOrderById = async (orderId) => {
  if (!isCustomerLoggedIn()) throw new Error('Non connecté');
  return fetchWithAuth(`${API_BASE}/${orderId}`);
};

const cancelOrder = async (orderId) => {
  if (!isCustomerLoggedIn()) throw new Error('Non connecté');
  return fetchWithAuth(`${API_BASE}/${orderId}/cancel`, {
    method: 'POST',
  });
};

const reorder = async (orderId) => {
  if (!isCustomerLoggedIn()) throw new Error('Non connecté');
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