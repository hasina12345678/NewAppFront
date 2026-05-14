const API_BASE = 'http://localhost:8000/api/v1/customer/wishlist';

const getToken = () => sessionStorage.getItem('customer_token');

const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur API');
  }
  
  return response.json();
};

const getWishlist = async () => {
  return fetchWithAuth(API_BASE);
};

const toggleWishlist = async (productId) => {
  return fetchWithAuth(`${API_BASE}/${productId}`, {
    method: 'POST',
  });
};

const moveToCart = async (productId) => {
  return fetchWithAuth(`${API_BASE}/${productId}/move-to-cart`, {
    method: 'POST',
  });
};

const clearWishlist = async () => {
  return fetchWithAuth(`${API_BASE}/all`, {
    method: 'DELETE',
  });
};

export {getWishlist, toggleWishlist, moveToCart, clearWishlist };