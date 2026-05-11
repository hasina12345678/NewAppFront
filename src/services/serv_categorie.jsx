const API_BASE_URL = 'http://localhost:8000/api/v1/admin/catalog/categories';

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
      'Authorization': 'Bearer 17|xBYxogoFblQGHGRA2hGvLKpQW4p1RgbDLWAtA9zQ2ae9b508',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Une erreur est survenue');
  }
  
  return response.json();
};

// Récupérer toutes les catégories
const getCategories = async () => {
  return fetchWithAuth(`${API_BASE_URL}?pagination=0`);
};

// Récupérer une catégorie par ID
const getCategoryById = async (id) => {
  return fetchWithAuth(`${API_BASE_URL}/${id}`);
};

// Créer une catégorie
const createCategory = async (categoryData) => {
  return fetchWithAuth(API_BASE_URL, {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
};

// Mettre à jour une catégorie
const updateCategory = async (id, categoryData) => {
  return fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
};

// Supprimer une catégorie
const deleteCategory = async (id) => {
  return fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
};

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};