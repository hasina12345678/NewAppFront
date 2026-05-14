const API_BASE = 'http://localhost:8000/api/v1/customer/cart';

const getToken = () => sessionStorage.getItem('customer_token');

const isCustomerLoggedIn = () => {
  return sessionStorage.getItem('customer_token') !== null;
};

const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur API');
  }
  
  return response.json();
};

const addToCart = async (productId, quantity = 1) => {
  const body = {
    product_id: productId,
    quantity: quantity
  };
  
  return fetchWithAuth(`${API_BASE}/add/${productId}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

const getCart = async () => {
  if (!isCustomerLoggedIn()) return { data: [] };
  return fetchWithAuth(API_BASE);
};

// const updateCartItem = async (cartItemId, quantity) => {
//   const body = { qty: { [cartItemId]: quantity } };
//   return fetchWithAuth(`${API_BASE}/update`, {
//     method: 'PUT',
//     body: JSON.stringify(body),
//   });

// };

const updateCartItem = async (cartItemId, quantity) => {
  const body = { qty: { [cartItemId]: quantity } };
  const response = await fetchWithAuth(`${API_BASE}/update`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  
  if (response.message && response.message.includes('pas disponible')) {
    throw new Error(response.message);
  }
  
  return response;
};

const removeCartItem = async (cartItemId) => {
  return fetchWithAuth(`${API_BASE}/remove/${cartItemId}`, {
    method: 'DELETE',
  });
};

const clearCart = async () => {
  return fetchWithAuth(`${API_BASE}/remove`, {
    method: 'DELETE',
  });
};

export { getCart, addToCart, updateCartItem, removeCartItem, clearCart };