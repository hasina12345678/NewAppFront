const API_BASE_URL = 'http://localhost:8000/api/categories';
const API_PRODUCTS_URL = 'http://localhost:8000/api/v1/products';

const getToken = () => {
  return sessionStorage.getItem('customer_token');
};

const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 'Authorization': 'Bearer 17|xBYxogoFblQGHGRA2hGvLKpQW4p1RgbDLWAtA9zQ2ae9b508',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Une erreur est survenue');
  }
  
  return response.json();
};

const getCategories = async () => {
  const reponse = await fetch(API_BASE_URL);
  return reponse.json();
  // return fetchWithAuth(API_BASE_URL);
};

const getProductsByCategory = async (categoryId) => {
  const response = await fetch(`${API_PRODUCTS_URL}?category_id=${categoryId}`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) { throw new Error('Erreur lors de la récupération des produits'); }
  
  return response.json();
};

export { getCategories, getProductsByCategory };