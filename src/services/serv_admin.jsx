import {saveAddress, saveShipping, savePayment, saveOrder} from './serv_checkout';
import { addToCart } from './serv_panier';
import { loginClient , logoutClient} from './serv_auth';

const CUSTOMER_API = 'http://localhost:8000/api/v1/admin/customers';
const API_CUSTOMER_REGISTER_URL = 'http://localhost:8000/api/v1/customer/register';
const API_PRODUCTS_URL = 'http://localhost:8000/api/v1/admin/catalog/products';
const API_CATEGORIES_URL = 'http://localhost:8000/api/v1/admin/catalog/categories';
const API_ORDERS_URL = 'http://localhost:8000/api/v1/admin/sales/orders';
const API_CART_URL = 'http://localhost:8000/api/v1/customer/cart';

const token_admin = "Bearer 139|peB8hvzJzjwhUDNQfO2Bc8DH7zmHVbkQojbuQqte64e0d69d"

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

const validateDate = (date) => {
  const [day, month, year] = date.split("/").map(Number);
  if (!day || !month || !year) { throw new Error("Format Date invalide (DD/MM/YYYY)"); }

  // if (year < 2025 || year >= 2027) { throw new Error("Annee invalide"); }
  if (String(year).length !== 4) { throw new Error("Année invalide"); }
  if (month < 1 || month > 12) { throw new Error("Mois invalide"); }
  if (day < 1 || day > 31) { throw new Error("Jour invalide"); }

  return true;
};

const validatePrice = (price) => {
  if (price == null || String(price).trim() === "") return true;
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) { throw new Error("Montant invalide (doit être positif)"); }
  return true;
};

// ============ CUSTOMERS ============
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

  const response = await fetch(API_CUSTOMER_REGISTER_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': token_admin,
    },
    body: formData,
  });

  console.log("======= Client creaction =======");
  console.log(Object.fromEntries(formData));

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
  return fetchWithAuth(API_PRODUCTS_URL);
};

const getProduitById = async (id) => {
  return fetchWithAuth(`${API_PRODUCTS_URL}/${id}`);
};

const createProduit = async (produitData) => {
  const response = await fetch(API_PRODUCTS_URL, {
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

  if (!response.ok) { throw new Error(responseData.message || 'Erreur création'); }

  const productId = responseData.data.id;
  await updateProduit(productId, produitData);
  await updateInventory(productId, produitData.stock_initial || 0);
  return responseData;
};

const updateProduit = async (productId, produitData) => {
  const formData = new FormData();
  formData.append('_method', 'PUT');
  formData.append('channel',produitData.channel || 'default');
  formData.append('locale',produitData.locale || 'fr');
  formData.append('sku',produitData.sku);
  formData.append('name',produitData.name);
  formData.append('url_key',produitData.url_key);

  validatePrice(produitData.price);
  validatePrice(produitData.cost);
  validatePrice(produitData.special_price);

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
  // for (let pair of formData.entries()) {
  //   console.log(pair[0], pair[1]);
  // }
  const response = await fetch(
    `${API_PRODUCTS_URL}/${productId}`,
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
  console.log('=== Produit mis a jour ===');
  console.log(responseData);
  if (!response.ok) { throw new Error(responseData.message || 'Erreur update produit'); }
  return responseData;
};

const updateInventory = async (productId, quantity) => {
  const response = await fetch(
    `${API_PRODUCTS_URL}/${productId}/inventories`,
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
  const responseData = await response.json();
  console.log('=== Produit inventory ===');
  console.log(responseData);
  if (!response.ok) {throw new Error(responseData.message || 'Erreur stock');}
  return responseData;
};

const getProductIdBySku = async (sku) => {
  const response = await fetch(API_PRODUCTS_URL, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': token_admin,
    },
  });
  const data = await response.json();
  if (!response.ok) { throw new Error(data.message || 'Erreur récupération produits'); }
  const cleanSku = sku.replace(/"/g, '');
  const product = data.data.find(p => p.sku === cleanSku);
  console.log("==== Produit trouvee ===");
  console.log(product);
  if (!product) { throw new Error(`Produit introuvable pour SKU: ${sku}`); }
  return product.id;
};

const getStockByProductId = async (productId) => {
  const reponse = await getProduitById(productId);
  const product = reponse.data;
  return product.inventories[0].qty;
};

const addStock = async (productId, qty) => {
  const qty_old = await getStockByProductId(productId);
  const nouveau = parseInt(qty_old) + parseInt(qty);
  await updateInventory(productId, nouveau);
}

const deleteProduitById = async (id) => {
  return fetchWithAuth(`${API_PRODUCTS_URL}/${id}`, {
    method: 'DELETE',
  });
};

const deleteProduitsMass = async (indices) => {
  return fetchWithAuth(`${API_PRODUCTS_URL}/mass-destroy`, {
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

// ============ COMMANDES ============
// const importCommandes = async (commandes) => {
//   let success = 0;
//   let errors = 0;
//   let index = 1;
  
//   const users = JSON.parse(localStorage.getItem("clients")) || [];
//   if (users.length === 0) { throw new Error("Aucun client importé"); }

//   for (const cmd of commandes) {
//     try {
//       console.log(`======= Commande creation ${index} =======`);
//       console.log("=== donnee recu ===");
//       console.log(cmd);

//       validateDate(cmd.date);

//       const user = users.find(u => u.email === cmd.client);
//       if (!user) { throw new Error(`Client introuvable : ${cmd.client}`);}

//       await loginClient(user.email, user?.pwd || "1234567890");  
     
//       let achatStr = cmd.achat.replaceAll('{', '').replaceAll('}', '').trim();
      
//       const itemsStr = achatStr.split('],[');   // separer les produits: ["sk-l";3],["sk-m";2] -> [ ["sk-l";3], ["sk-m";2] ]
//       const items = [];

//       for (let itemStr of itemsStr) {
//         itemStr = itemStr.replaceAll('[', '').replaceAll(']', '');  // Nettoyer les crochets
//         const [sku, qty] = itemStr.split(';');
//         items.push([sku.trim(), parseInt(qty.trim())]);
//       }

//       for (const [sku, qty] of items) {
//         const productId = await getProductIdBySku(sku.trim());
//         console.log("=== add to cart ...===");
//         await addToCart(productId, qty);
//       }
      
//       await saveAddress({
//         billing: {
//           first_name: user.prenom,
//           last_name: user.nom,
//           email: user.email,
//           address: user?.address || [`${user?.prenom} address`],
//           city: "Antananarivo",
//           country: "MG",
//           state: "Analamanga",
//           postcode: "102",
//           phone: user?.phone || "0380000000"
//         },
//         shipping: {
//           first_name: user.prenom,
//           last_name: user.nom,
//           email: cmd.client,
//           address: user?.address || [`${user?.prenom} address`],
//           city: "Antananarivo",
//           country: "MG",
//           state: "Analamanga",
//           postcode: "102",
//           phone: user?.phone || "0380000000"
//         }
//       });

//       const shippingResult = await saveShipping("free_free");   console.log("Shipping:", shippingResult);
//       const paymentResult = await savePayment("cashondelivery");  console.log("Payment:", paymentResult);

//       const orderResponse = await saveOrder();

//       const order = orderResponse.data?.order || orderResponse.data?.[0]?.order || orderResponse.data;

//       if (!order) {throw new Error("Commande introuvable");}
//       if (!order.id) {throw new Error("Commande ID introuvable");}
//       if (!order.items || !Array.isArray(order.items)) {throw new Error("Items commande introuvables");}

//       console.log("=== Commande final cree ====");
//       console.log(order);

//       if (cmd.status?.toLowerCase() === 'processing') {   // STATUS = processing
//         await createInvoice(order);
//       }

//       if (cmd.status?.toLowerCase() === 'completed') {  // STATUS = completed
//         await createInvoice(order);
//         await createShipment(order);
//       }

//       // logoutClient();
//       sessionStorage.removeItem('customer_token');
//       sessionStorage.removeItem('customer_data');

//       success++;
//     } catch (err) {
//       // console.error("Erreur commande:", err.message);
//       throw err;
//       errors++;
//     }
//     index++;
//   }
//   // localStorage.clear();
//   return { success, errors };
// };

const importCommandes = async (commandes) => {
  let success = 0;
  let errors = 0;
  let index = 1;

  const users = JSON.parse(localStorage.getItem("clients")) || [];
  if (users.length === 0) {throw new Error("Aucun client importé"); }

  for (const cmd of commandes) {
    try {
      console.log(`======= Commande ${index} =======`);
      console.log(cmd);

      // 1. Validation date
      validateDate(cmd.date);

      // 2. Client
      const user = users.find(u => u.email === cmd.client);
      if (!user) throw new Error(`Client introuvable : ${cmd.client}`);

      // 3. Login
      await loginClient(user.email, user?.pwd || "1234567890");

      // 4. Parse achat
      let achatStr = cmd.achat.replaceAll('{', '').replaceAll('}', '').trim();
      const itemsStr = achatStr.split('],[');

      const items = [];
      for (let itemStr of itemsStr) {
        itemStr = itemStr.replaceAll('[', '').replaceAll(']', '');
        const [sku, qty] = itemStr.split(';');
        items.push([sku.trim(), parseInt(qty.trim())]);
      }

      // 5. Add to cart
      for (const [sku, qty] of items) {
        const productId = await getProductIdBySku(sku);
        console.log("=== Add to cart ... ===");
        await addToCart(productId, qty);
      }

      // 6. Address
      await saveAddress({
        billing: {
          first_name: user.prenom,
          last_name: user.nom,
          email: user.email,
          address: user?.address || [`${user?.prenom} address`],
          city: "Antananarivo",
          country: "MG",
          state: "Analamanga",
          postcode: "102",
          phone: user?.phone || "0380000000"
        },
        shipping: {
          first_name: user.prenom,
          last_name: user.nom,
          email: cmd.client,
          address: user?.address || [`${user?.prenom} address`],
          city: "Antananarivo",
          country: "MG",
          state: "Analamanga",
          postcode: "102",
          phone: user?.phone || "0380000000"
        }
      });

      // 7. Checkout
      await saveShipping("free_free");
      await savePayment("cashondelivery");

      const orderResponse = await saveOrder();

      const order =orderResponse.data?.order || orderResponse.data?.[0]?.order || orderResponse.data;

      if (!order?.id) throw new Error("Commande invalide");

      // 8. Status
      const status = cmd.status?.toLowerCase();

      if (status === "processing") {
        await createInvoice(order);
      }

      if (status === "completed") {
        await createInvoice(order);
        await createShipment(order);
      }

      // 9. Logout propre
      sessionStorage.removeItem("customer_token");
      sessionStorage.removeItem("customer_data");

      success++;
      console.log(`============= ✔ Commande ${index} OK ===============`);

    } catch (err) {
      console.error(`----------- ✖ Erreur commande ${index} : `, err.message);
      errors++;
    }
    index++;
  }

  return { success, errors };
};

const createInvoice = async (order) => {
  if (!order) {throw new Error('Commande introuvable');}
  if (!order.items || !Array.isArray(order.items)) {throw new Error('Items commande introuvables');}

  const items = {};

  order.items.forEach((item) => {
    const qty = parseInt(item.qty_ordered || 0);
    if (qty > 0) {
      items[item.id] = qty;
    }
  });

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
  console.log("=== created INVOICE ===");
  console.log(data);
  if (!response.ok) { throw new Error(data.message || 'Erreur création invoice'); }
  return data;
};

const createShipment = async (order) => {
  const shipmentItems = {};
  order.items.forEach(item => {
    shipmentItems[item.id] = {
      1: item.qty_ordered
    };
  });
  // console.log("SHIPMENT ITEMS =>", shipmentItems);
  const totalQty = order.items.reduce((sum, item) => sum + item.qty_ordered,0);

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
  console.log("=== created SHIPMENT ===");
  console.log(data);

  if (!response.ok) { throw new Error(data.message || 'Erreur shipment'); }
  return data;
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
  if (!response.ok) { throw new Error(data.message || 'Erreur reset'); }

  const adminLoggedIn = sessionStorage.getItem('admin_logged_in');
  
  sessionStorage.clear();
  localStorage.clear();

  localStorage.setItem("force_logout", Date.now());

  if (adminLoggedIn) { sessionStorage.setItem('admin_logged_in', adminLoggedIn); }

  return data;
};

export {
  getProduits,
  getProduitById,
  createProduit,
  updateProduit,
  getStockByProductId,
  addStock,
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