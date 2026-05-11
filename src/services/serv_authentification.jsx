const API_BASE_URL = 'http://localhost:8000/api/v1/customer';

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.message || 'Une erreur est survenue';
    throw new Error(error);
  }
  
  return data;
};

const setToken = (token) => {
  if (token) {
    sessionStorage.setItem('customer_token', token);
  } else {
    sessionStorage.removeItem('customer_token');
  }
};

const getToken = () => {
  return sessionStorage.getItem('customer_token');
};

const removeToken = () => {
  sessionStorage.removeItem('customer_token');
  sessionStorage.removeItem('customer_data');
};

const setUserData = (userData) => {
  sessionStorage.setItem('customer_data', JSON.stringify(userData));
};

const getUserData = () => {
  const data = sessionStorage.getItem('customer_data');
  return data ? JSON.parse(data) : null;
};

const removeUserData = () => {
  localStorage.removeItem('customer_data');
};

const authService = {
  login: async (email, password, deviceName = 'web') => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('device_name', deviceName);
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await handleResponse(response);
    
    if (result.data) {
      const token = result.token || result.access_token;
      if (token) {
        setToken(token);
      }
      setUserData(result.data);
    }
    
    return result;
  },

  register: async (userData) => {
    const formData = new FormData();
    formData.append('first_name', userData.first_name);
    formData.append('last_name', userData.last_name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('password_confirmation', userData.password_confirmation);
    
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      body: formData,
    });
    
    return handleResponse(response);
  },
  
  logout: async () => {
    const token = getToken();
    
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': 'application/json',
      },
    });
    
    removeToken();
    removeUserData();
    return handleResponse(response);
  },
  
  getCurrentCustomer: async () => {
    const token = getToken();
    
    if (!token) {
      throw new Error('Non authentifié');
    }
    
    const response = await fetch(`${API_BASE_URL}/get`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    const result = await handleResponse(response);
    
    if (result.data) {
      setUserData(result.data);
    }
    
    return result;
  },
  
  updateProfile: async (profileData) => {
    const token = getToken();
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    const result = await handleResponse(response);
    
    if (result.data) {
      setUserData(result.data);
    }
    
    return result;
  },
  
  forgotPassword: async (email) => {
    const formData = new FormData();
    formData.append('email', email);
    
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      body: formData,
    });
    
    return handleResponse(response);
  },

  isAuthenticated: () => {
    return getToken() !== null;
  },

  getCurrentUser: () => {
    return getUserData();
  },
  
  isAdmin: () => {
    const user = getUserData();
    return user && user.email === 'admin@gmail.com';
  },
  
  getToken: () => {
    return getToken();
  },
};

export default authService;