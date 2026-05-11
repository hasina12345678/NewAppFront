import { useEffect, useState } from 'react';

import { importCSV, importExcel } from '../../services/serv_import';
import { getProduits, createProduit, deleteProduitById, viderTousProduits } from '../../services/serv_produit';
import { getCategories } from '../../services/serv_categorie';

import CardProduit from '../../components/admin/CardProduit';

function AdminHome() {
  const [file, setFile] = useState(null);
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    special_price: '',
    special_price_from: '',
    special_price_to: '',
    weight: '',
    color: '',
    transmission: '',
    carburant: '',
    status: 1,
    category_id: ''
  });

  useEffect(() => {
    const chargerDonnees = async () => {
      setLoading(true);
      try {
        const produitsReponse = await getProduits();
        setProduits(produitsReponse.data || []);
        
        const categoriesReponse = await getCategories();
        setCategories(categoriesReponse.data || []);
      } catch (error) {
        console.error('Erreur chargement:', error);
      } finally {
        setLoading(false);
      }
    };
    
    chargerDonnees();
  }, []);

  const rafraichirProduits = async () => {
    try {
      const reponse = await getProduits();
      setProduits(reponse.data || []);
    } catch (error) {
      console.error('Erreur rafraîchissement:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmitProduit = async (e) => {
    e.preventDefault();
    
    const produitData = {
      type: 'simple',
      attribute_family_id: 1,
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      special_price: formData.special_price ? parseFloat(formData.special_price) : null,
      special_price_from: formData.special_price_from || null,
      special_price_to: formData.special_price_to || null,
      weight: formData.weight,
      color: formData.color ? parseInt(formData.color) : null,
      transmission: formData.transmission,
      carburant: formData.carburant ? parseInt(formData.carburant) : null,
      status: formData.status,
      channel: 'default',
      locale: 'fr'
    };
    
    try {
      await createProduit(produitData);
      alert('Produit créé avec succès!');
      setShowOverlay(false);
      setFormData({
        name: '', sku: '', price: '', special_price: '', special_price_from: '',
        special_price_to: '', weight: '', color: '', transmission: '', carburant: '',
        status: 1, category_id: ''
      });
      await rafraichirProduits();
    } catch (error) {
      console.error('Erreur création:', error);
      alert('Erreur lors de la création du produit');
    }
  };

  const handleDeleteProduit = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await deleteProduitById(id);
        alert('Produit supprimé');
        await rafraichirProduits();
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEditProduit = (produit) => {
    alert(`Modification du produit "${produit.name}" - Fonctionnalité à implémenter`);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      alert('Aucun fichier sélectionné');
      return;
    }

    const extension = file.name.split('.').pop().toLowerCase();
    let data = null;

    try {
      if (extension === 'csv') {
        data = await importCSV(file);
      } else if (extension === 'xlsx' || extension === 'xls') {
        data = await importExcel(file);
      } else {
        alert('Format non supporté. Utilisez CSV ou Excel.');
        return;
      }
      
      console.log('Données importées :', data);
      
      for (const produit of data) {
        try {
          await createProduit({
            type: 'simple',
            attribute_family_id: 1,
            name: produit.nom || produit.name,
            sku: produit.sku || `SKU-${Date.now()}`,
            price: parseFloat(produit.prix || produit.price || 0),
            weight: produit.poids || produit.weight || "0",
            status: 1,
            channel: 'default',
            locale: 'fr'
          });
        } catch (err) {
          console.error('Erreur import produit:', err);
        }
      }
      
      await rafraichirProduits();
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'import');
    }
  };

  const handleVider = async () => {
    if (window.confirm(' Supprimer TOUS les produits ?')) {
      try {
        await viderTousProduits();
        alert('Tous les produits ont été supprimés');
        await rafraichirProduits();
        setFile(null);
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Section Actions */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h2>Import de fichier</h2>
          <input 
            type="file" 
            accept=".csv,.xlsx,.xls" 
            onChange={handleFileChange} 
          />
          <button 
            onClick={handleImport} 
            style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
          >
            Importer
          </button>
          {file && <p style={{ marginTop: '1rem' }}>Fichier : {file.name}</p>}
        </div>

        <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h2>Actions</h2>
          <button 
            onClick={() => setShowOverlay(true)}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#2ecc71', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              marginRight: '1rem'
            }}
          >
            + Ajouter un produit
          </button>
          <button 
            onClick={handleVider} 
            style={{ padding: '0.5rem 1rem', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Vider tous les produits
          </button>
        </div>
      </div>

      {/* Liste des produits */}
      <div>
        <h2>Liste des produits ({produits.length})</h2>
        {loading && <p>Chargement...</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {produits.map(produit => (
            <CardProduit 
              key={produit.id}
              produit={produit}
              onEdit={handleEditProduit}
              onDelete={handleDeleteProduit}
            />
          ))}
        </div>
      </div>

      {/* Overlay Formulaire */}
      {showOverlay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90%',
            overflow: 'auto'
          }}>
            <h2>Ajouter un produit</h2>
            <form onSubmit={handleSubmitProduit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Nom *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Prix * (€)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Prix spécial (€)</label>
                <input
                  type="number"
                  step="0.01"
                  name="special_price"
                  value={formData.special_price}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Du</label>
                  <input
                    type="date"
                    name="special_price_from"
                    value={formData.special_price_from}
                    onChange={handleFormChange}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Au</label>
                  <input
                    type="date"
                    name="special_price_to"
                    value={formData.special_price_to}
                    onChange={handleFormChange}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Poids (kg)</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Catégorie</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Couleur</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Transmission</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                >
                  <option value="">Sélectionner</option>
                  <option value="Manuelle">Manuelle</option>
                  <option value="Automatique">Automatique</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Carburant</label>
                <select
                  name="carburant"
                  value={formData.carburant}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                >
                  <option value="">Sélectionner</option>
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Électrique">Électrique</option>
                  <option value="Hybride">Hybride</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status === 1}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 1 : 0 }))}
                  />
                  Actif
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{
                  padding: '0.75rem',
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flex: 1
                }}>
                  Créer
                </button>
                <button type="button" onClick={() => setShowOverlay(false)} style={{
                  padding: '0.75rem',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flex: 1
                }}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHome;