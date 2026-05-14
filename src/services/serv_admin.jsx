import {saveAddress, saveShipping, savePayment, saveOrder} from './serv_checkout';

import { addToCart } from './serv_panier';

import { loginClientTemp , logoutClient} from './serv_auth';

const API_BASE_URL = 'http://localhost:8000/api/v1/admin/catalog/products';

const API_CATEGORIES_URL = 'http://localhost:8000/api/v1/admin/catalog/categories';
const API_ORDERS_URL = 'http://localhost:8000/api/v1/admin/sales/orders';
const API_CART_URL = 'http://localhost:8000/api/v1/customer/cart';

const API_CUSTOMERS_URL = 'http://localhost:8000/api/v1/customer/register';

const CUSTOMER_API = 'http://localhost:8000/api/v1/admin/customers';

const token_admin = "Bearer 128|xXVLX2Diy6b5DmKwNOWpqa5VC9rktwhgoyWnJyHv14636815"

const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token_admin,
      ...options.headers,
    },
  });
  if (!response.ok) { const error = await response.json(); throw new Error(error.message || 'Une erreur est survenue');}
  return response.json();
};

const getCustomerByEmail = async (email) => {
  const response = await fetch(CUSTOMER_API,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': token_admin,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) { throw new Error(data.message || 'Erreur récupération clients'); }

  const customers = data.data || [];

  const customer = customers.find((c) => c.email?.toLowerCase() === email.toLowerCase());

  return customer || null;
};

const createCustomer = async (customerData) => {
  const formData = new FormData();
  formData.append('first_name', customerData.first_name);
  formData.append('last_name', customerData.last_name);
  formData.append('email', customerData.email);
  formData.append('gender', customerData.gender || 'Male');
  formData.append('customer_group_id', customerData.customer_group_id || 1);
  if (customerData.phone) formData.append('phone', customerData.phone);
  if (customerData.password) formData.append('password', customerData.password);
  if (customerData.password_confirmation) formData.append('password_confirmation', customerData.password_confirmation);

  const response = await fetch(API_CUSTOMERS_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': token_admin,
    },
    body: formData,
  });
  if (!response.ok) {const error = await response.json(); throw new Error(error.message || 'Erreur création client'); }
  return response.json();
};

const getAllAttributes = async () => {
  try {
    const response = await fetchWithAuth('http://127.0.0.1:8000/api/v1/admin/catalog/attributes?pagination=0');
    const attributes = response.data || [];
    const allAttributeIds = attributes.map(attr => attr.id);
    return allAttributeIds;
  } catch (error) { console.warn('API attributs non disponible:', error.message);return [1]; }
};

const createCategory = async (categoryData, attributeIds = []) => {
  const formData = new FormData();
  formData.append('locale', categoryData.locale || 'fr');
  formData.append('name', categoryData.name);
  formData.append('position', String(categoryData.position || 0));
  formData.append('display_mode', categoryData.display_mode || 'products_and_description');
  formData.append('description', categoryData.description || '');
  formData.append('slug', categoryData.slug);
  
  if (attributeIds.length > 0) {
    attributeIds.forEach(id => { formData.append('attributes[]', String(id)); });
  } else {
    formData.append( 'attributes[]', '1'); 
  }
  if (categoryData.status !== undefined) formData.append('status', String(categoryData.status));
  if (categoryData.parent_id) formData.append('parent_id', String(categoryData.parent_id));
  if (categoryData.meta_title) formData.append('meta_title', categoryData.meta_title);
  if (categoryData.meta_description) formData.append('meta_description', categoryData.meta_description);
  if (categoryData.meta_keywords) formData.append('meta_keywords', categoryData.meta_keywords);
  
  const response = await fetch(API_CATEGORIES_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': token_admin,
    },
    body: formData,
  });
  
  if (!response.ok) { const error = await response.json(); throw new Error(error.message || 'Erreur création catégorie');
  }
  return response.json();
};

const findOrCreateCategory = async (categoryName) => {
  if (!categoryName) return null;
  
  const categories = await getCategories();
  let category = categories.data.find(c => c.name === categoryName);
  
  if (!category) {
    const attributeIds = await getAllAttributes();
    const newCategory = await createCategory({
      name: categoryName,
      slug: categoryName.toLowerCase().replace(/ /g, '-'),
      status: 1,
      parent_id: 1,
      locale: 'fr',
      position: 0,
      display_mode: 'products_and_description',
      description: `Catégorie ${categoryName}`
    }, attributeIds);
    category = newCategory.data;
  }
  return category;
};

// ============ PRODUITS ============
const getProduits = async () => {
  return fetchWithAuth(API_BASE_URL);
};

const getProduitById = async (id) => {
  return fetchWithAuth(`${API_BASE_URL}/${id}`);
};

const createProduit = async (produitData) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token_admin,
    },
    body: JSON.stringify({
      type: produitData.type || 'simple',
      attribute_family_id: produitData.attribute_family_id || 1,
      sku: produitData.sku,
    }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Erreur création');
  }
  const productId = responseData.data.id;

  await updateProduit(productId, produitData);

  await updateInventory(productId, produitData.stock_initial || 0);


  return responseData;
};

const updateInventory = async (productId, quantity) => {

  const response = await fetch(
    `${API_BASE_URL}/${productId}/inventories`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token_admin,
      },

      body: JSON.stringify({
        inventories: {
          1: quantity
        }
      }),
    }
  );

  const data = await response.json();

  console.log('Inventory response =>', data);

  if (!response.ok) {
    throw new Error(data.message || 'Erreur stock');
  }

  return data;
};

const updateProduit = async (productId, produitData) => {
  const formData = new FormData();

  formData.append('_method', 'PUT');
  formData.append('channel',produitData.channel || 'default');
  formData.append('locale',produitData.locale || 'fr');
  formData.append('sku',produitData.sku);
  formData.append('name',produitData.name);
  formData.append('url_key',produitData.url_key);

  formData.append('price',String(produitData.price || 0));
  formData.append('cost',String(produitData.cost || 0));
  formData.append('special_price',String(produitData.special_price || 0));

  formData.append('status',String(produitData.status || 1));
  formData.append('visible_individually',String(produitData.visible_individually || 1));
  formData.append('guest_checkout',String(produitData.guest_checkout || 1));
  formData.append('manage_stock','1');
  formData.append('new',String(produitData.new || 1));
  formData.append('featured',String(produitData.featured || 1));
  formData.append('short_description',produitData.short_description || '');
  formData.append('description',produitData.description || '');
  formData.append('weight',String(produitData.weight || 0));

  if (produitData.categories && produitData.categories.length > 0) {
    produitData.categories.forEach(catId => {
      formData.append('categories[]',String(catId));
    });
  }

  if (produitData.images && produitData.images.length > 0) {
    produitData.images.forEach(imageFile => {
      formData.append('images[files][]', imageFile);
    });
  }

  // if (produitData.stock_initial > 0) {
  //   formData.append('inventories[1]',String(produitData.stock_initial));
  // }

  // DEBUG
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const response = await fetch(
    `${API_BASE_URL}/${productId}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: token_admin,
      },
      body: formData,
    }
  );
  const responseData = await response.json();
  console.log(
    'UPDATE PRODUCT =>',
    responseData
  );

  if (!response.ok) {
    throw new Error(responseData.message || 'Erreur update produit');
  }

  return responseData;
};


// const updateProductWithImage = async (productId, productData, imageFile) => {

//   const productFull = await getProduitById(productId);

//   const existingCategories = productFull.data.categories || [];

//   const fullData = {
//     ...productData,
//     categories: existingCategories.map(cat => cat.id), // AFAKA ESORINA

//     images: [imageFile]

//     // images: productData.images
//     //   ? [...productData.images, imageFile]
//     //   : [imageFile] tsy metyyyyy fa ecraseny fona
//   };

//   return await updateProduit(productId, fullData);
// };


/////

const getProductIdBySku = async (sku) => {
  const response = await fetch(API_BASE_URL, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': token_admin,
    },
  });

  const data = await response.json();

  if (!response.ok) { 
    throw new Error(data.message || 'Erreur récupération produits');
  }

  // console.log("SKU PARAM : ", sku);
  const cleanSku = sku.replace(/"/g, '');

  const product = data.data.find(p => p.sku === cleanSku);

  console.log("Produit trouvé : ", product);

  if (!product) { 
    throw new Error(`Produit introuvable pour SKU: ${sku}`); 
  }

  return product.id;
};


const importCommandes = async (commandes) => {
  let success = 0;
  let errors = 0;

  for (const cmd of commandes) {
    try {
      console.log("IMPORT COMMANDE =>", cmd);

      const token = await loginClientTemp(cmd.client, "1234567890"); 
      sessionStorage.setItem('customer_token', token);

      let achatStr = cmd.achat
        .replaceAll('{', '')
        .replaceAll('}', '')
        .trim();
      
      // Séparer les différents produits: ["sk-l";3],["sk-m";2] -> [ ["sk-l";3], ["sk-m";2] ]
      const itemsStr = achatStr.split('],[');
      
      const items = [];
      for (let itemStr of itemsStr) {
        // Nettoyer les crochets
        itemStr = itemStr.replaceAll('[', '').replaceAll(']', '');
        const [sku, qty] = itemStr.split(';');
        items.push([sku.trim(), parseInt(qty.trim())]);
      }

      for (const [sku, qty] of items) {
        // console.log("Sku :", sku, "Quantité:", qty);
        const productId = await getProductIdBySku(sku.trim());
        await addToCart(productId, qty);
      }
      
      await saveAddress({
        billing: {
          first_name: "Import",
          last_name: "Client",
          email: cmd.client,
          address: ["Import address"],
          city: "Import",
          country: "MG",
          state: "Import",
          postcode: "0000",
          phone: "000000"
        },
        shipping: {
          first_name: "Import",
          last_name: "Client",
          email: cmd.client,
          address: ["Import address"],
          city: "Import",
          country: "MG",
          state: "Import",
          postcode: "0000",
          phone: "000000"
        }
      });

      await saveShipping("free_free");

      await savePayment("cashondelivery");

      const orderResponse = await saveOrder();

      console.log("Commande CREEEEE : ", orderResponse);

      const order =
        orderResponse.data?.order ||
        orderResponse.data?.[0]?.order ||
        orderResponse.data;

      if (!order) {
        throw new Error("Commande introuvable");
      }

      if (!order.id) {
        throw new Error("Order ID introuvable");
      }

      if (!order.items || !Array.isArray(order.items)) {
        throw new Error("Items commande introuvables");
      }

      console.log("ORDER FINAL =>", order);

      // STATUS = processing
      if (cmd.status?.toLowerCase() === 'processing') {
        await createInvoice(order);
      }

      // STATUS = completed
      if (cmd.status?.toLowerCase() === 'completed') {
        await createInvoice(order);
        await createShipment(order);
      }

      success++;
    } catch (err) {
      console.error("Erreur commande:", err.message);
      errors++;
    }
    
  }
  logoutClient();
  return { success, errors };
};

const createInvoice = async (order) => {

  if (!order) {
    throw new Error('Commande introuvable');
  }

  if (!order.items || !Array.isArray(order.items)) {
    throw new Error('Items commande introuvables');
  }

  const items = {};

  order.items.forEach((item) => {

    const qty = parseInt(item.qty_ordered || 0);

    if (qty > 0) {
      items[item.id] = qty;
    }
  });

  console.log("INVOICE ITEMS =>", items);

  const response = await fetch(
    `http://localhost:8000/api/v1/admin/sales/invoices/${order.id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token_admin,
      },
      body: JSON.stringify({
        invoice: {
          items: items
        },
        can_create_transaction: 1
      }),
    }
  );

  const data = await response.json();

  console.log("CREATE INVOICE =>", data);

  if (!response.ok) {
    throw new Error(
      data.message || 'Erreur création invoice'
    );
  }

  return data;
};

const createShipment = async (order) => {

  const shipmentItems = {};

  order.items.forEach(item => {
    shipmentItems[item.id] = {
      1: item.qty_ordered
    };
  });

  console.log("SHIPMENT ITEMS =>", shipmentItems);

  const totalQty = order.items.reduce(
    (sum, item) => sum + item.qty_ordered,
    0
  );

  const response = await fetch(
    `http://localhost:8000/api/v1/admin/sales/shipments/${order.id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token_admin,
      },
      body: JSON.stringify({
        shipment: {
          carrier_title: "Import Shipment",
          track_number: `TRK-${Date.now()}`,
          source: 1,
          total_qty: totalQty,
          items: shipmentItems
        }
      }),
    }
  );

  const data = await response.json();

  console.log("CREATE SHIPMENT =>", data);

  if (!response.ok) {
    throw new Error(data.message || 'Erreur shipment');
  }

  return data;
};



const deleteProduitById = async (id) => {
  return fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
};

const deleteProduitsMass = async (indices) => {
  return fetchWithAuth(`${API_BASE_URL}/mass-destroy`, {
    method: 'POST',
    body: JSON.stringify({ indices }),
  });
};

const viderTousProduits = async () => {
  try {
    const response = await getProduits();
    let produits = response.data || [];
    const indices = produits.map(produit => produit.id);
    
    if (indices.length === 0) return { message: 'Aucun produit à supprimer' };
    return await deleteProduitsMass(indices);
  } catch (error) {
    throw new Error(`Erreur suppression produits: ${error.message}`);
  }
};

// ============ CATÉGORIES ============
const getCategories = async () => {
  return fetchWithAuth(`${API_CATEGORIES_URL}?pagination=0`);
};

const deleteCategoryById = async (id) => {
  return fetchWithAuth(`${API_CATEGORIES_URL}/${id}`, {
    method: 'DELETE',
  });
};

const deleteCategoriesMass = async (indices) => {
  return fetchWithAuth(`${API_CATEGORIES_URL}/mass-destroy`, {
    method: 'POST',
    body: JSON.stringify({ indices }),
  });
};

const viderToutesCategories = async () => {
  try {
    const response = await getCategories();
    let categories = response.data || [];
    const categoriesToDelete = categories.filter(c => c.name !== 'Racine' && c.id !== 1);
    const indices = categoriesToDelete.map(cat => cat.id);
    
    if (indices.length === 0) return { message: 'Aucune catégorie à supprimer' };
    return await deleteCategoriesMass(indices);
  } catch (error) {
    throw new Error(`Erreur suppression catégories: ${error.message}`);
  }
};


// ============ COMMANDES ============
const getOrders = async () => {
  try {
    return await fetchWithAuth(`${API_ORDERS_URL}?pagination=0`);
  } catch (error) {
    console.warn('API commandes non disponible:', error.message);
    return { data: [] };
  }
};

const deleteOrderById = async (id) => {
  try {
    return await fetchWithAuth(`${API_ORDERS_URL}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.warn(`Impossible de supprimer commande ${id}:`, error.message);
    return { message: 'Commande ignorée' };
  }
};


const resetAllData = async () => {

  const response = await fetch(
    'http://localhost:8000/admin/reset-all-data',
    {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
        // 'Authorization': token_admin,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erreur reset');
  }

  return data;
};


export {
  getProduits,
  getProduitById,
  createProduit,
  updateProduit,
  deleteProduitById,
  deleteProduitsMass,
  viderTousProduits,
  getCategories,
  deleteCategoryById,
  deleteCategoriesMass,
  viderToutesCategories,
  getOrders,
  deleteOrderById,

  resetAllData,

  createCustomer,

  createCategory,
  findOrCreateCategory,

  importCommandes,

  getProductIdBySku,

  createInvoice,
  createShipment
};