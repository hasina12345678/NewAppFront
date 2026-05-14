const API_BASE = 'http://localhost:8000/api/v1/countries';

const loadCountries = async () => {
  const response = await fetch(`${API_BASE}?pagination=0`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Erreur chargement pays');
  }
  
  return response.json();
};

export { loadCountries };