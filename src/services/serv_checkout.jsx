const API_BASE = 'http://localhost:8000/api/v1/customer/checkout';

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

// 1. Enregistrer l'adresse
export const saveAddress = async (addressData) => {
  return fetchWithAuth(`${API_BASE}/save-address`, {
    method: 'POST',
    body: JSON.stringify(addressData),
  });
};

// 2. Enregistrer le mode de livraison
export const saveShipping = async (shippingMethod) => {
  return fetchWithAuth(`${API_BASE}/save-shipping`, {
    method: 'POST',
    body: JSON.stringify({ shipping_method: shippingMethod }),
  });
};

// 3. Enregistrer le mode de paiement
// export const savePayment = async (paymentMethod) => {
//   return fetchWithAuth(`${API_BASE}/save-payment`, {
//     method: 'POST',
//     body: JSON.stringify({ method: paymentMethod }),
//   });
// };

export const savePayment = async (paymentMethod) => {
  return fetchWithAuth(`${API_BASE}/save-payment`, {
    method: 'POST',
    body: JSON.stringify({ payment: { method: paymentMethod } }),
  });
};

// 4. Vérifier commande minimum (optionnel)
export const checkMinimumOrder = async () => {
  return fetchWithAuth(`${API_BASE}/check-minimum-order`, {
    method: 'POST',
  });
};

// 5. Créer la commande
export const saveOrder = async () => {
  return fetchWithAuth(`${API_BASE}/save-order`, {
    method: 'POST',
  });
};