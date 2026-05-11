const API_BASE_URL = 'http://localhost:8000/api/v1/admin/catalog/products';

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
      //   'Authorization': token ? `Bearer ${token}` : '',
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


// 1.
const getProduits = async () => {
  return fetchWithAuth(API_BASE_URL);
};

// 2. 
const getProduitById = async (id) => {
  return fetchWithAuth(`${API_BASE_URL}/${id}`);
};

// 3.
const createProduit = async (produitData) => {
  return fetchWithAuth(API_BASE_URL, {
    method: 'POST',
    body: JSON.stringify(produitData),
  });
};

// 4. 
const updateProduit = async (id, produitData) => {
  return fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: 'POST',
    body: JSON.stringify(produitData),
  });
};

// 5.
const deleteProduitById = async (id) => {
  return fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
};

// 6.
const deleteProduitsMass = async (indices) => {
  return fetchWithAuth(`${API_BASE_URL}/mass-destroy`, {
    method: 'POST',
    body: JSON.stringify({ indices }),
  });
};

// 7. 
const viderTousProduits = async () => {
  try {
    const response = await getProduits();
    
    let produits = [];
    if (response.data) {
      produits = response.data;
    } else if (Array.isArray(response)) {
      produits = response;
    } else {
      produits = response.produits || response.items || [];
    }
    
    const indices = produits.map(produit => produit.id);
    
    if (indices.length === 0) {
      return { message: 'Aucun produit à supprimer' };
    }
    
    return await deleteProduitsMass(indices);
  } catch (error) {
    throw new Error(`Erreur lors de la suppression: ${error.message}`);
  }
};

// const serv_produit = {
//   getProduits,
//   getProduitById,
//   createProduit,
//   updateProduit,
//   deleteProduitById,
//   deleteProduitsMass,
//   viderTousProduits,
// };

export {getProduits, getProduitById, createProduit, updateProduit, deleteProduitById, deleteProduitsMass, viderTousProduits};