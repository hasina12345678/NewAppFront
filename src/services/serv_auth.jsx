const API_BASE = 'http://localhost:8000/api/v1/customer';

const loginClient = async (email, password) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('device_name', 'web');

  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  if (data.token || data.access_token) {
    sessionStorage.setItem('customer_token', data.token || data.access_token);
    sessionStorage.setItem('customer_data', JSON.stringify(data.data));
  }
  
  return data;
};

// const loginClientTemp = async (email, password) => {
//   const formData = new FormData();
//   formData.append('email', email);
//   formData.append('password', password);
//   formData.append('device_name', 'import');
//   const response = await fetch(`${API_BASE}/login`, {
//     method: 'POST',
//     body: formData,
//   });
//   const data = await response.json();
//   if (!response.ok) {throw new Error(data.message || 'Login failed'); }
//   return data.token || data.access_token;
// };

const logoutClient = async () => {
  const token = sessionStorage.getItem('customer_token');
  
  if (token) {
    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  }
  
  const customer = JSON.parse(sessionStorage.getItem("customer_data"));

  console.log("=== Logout ===");
  console.log(`Nom : ${customer?.first_name}`);
  console.log(`Email : ${customer?.email}`);

  sessionStorage.removeItem('customer_token');
  sessionStorage.removeItem('customer_data');
  
  // window.location.reload();
};

const getCurrentCustomer = () => {
  const data = sessionStorage.getItem('customer_data');
  return data ? JSON.parse(data) : null;
};

const isCustomerLoggedIn = () => {
  return sessionStorage.getItem('customer_token') !== null;
};

export { loginClient, logoutClient, getCurrentCustomer, isCustomerLoggedIn};