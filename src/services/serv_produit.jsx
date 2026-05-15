const API_BASE_URL = 'http://localhost:8000/api/v1/products';

const fetch_a = async (url, options = {}) => {
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Une erreur est survenue');
  }
  
  return response.json();
};

// 1.
const getProduits = async () => {
  return fetch_a(API_BASE_URL);
};

// 2. 
const getProduitById = async (id) => {
  return fetch_a(`${API_BASE_URL}/${id}`);
};



export {getProduits, getProduitById};