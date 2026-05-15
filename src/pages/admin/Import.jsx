import { useState } from 'react';
import { importCSV } from '../../services/serv_import';
import { createCustomer, createProduit, findOrCreateCategory } from '../../services/serv_admin';
import { importCommandes } from '../../services/serv_admin';

function Import() {

  const [fileClients, setFileClients] = useState(null);
  const [fileProduits, setFileProduits] = useState(null);
  const [fileCommandes, setFileCommandes] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleImportClients = async () => {
    if (!fileClients) {
      setMessage('Veuillez sélectionner un fichier clients');
      return;
    }

    setLoading(true);
    setMessage('');
    setErrors([]);

    try {
      const data = await importCSV(fileClients);

      let successCount = 0;
      let errorCount = 0;

      for (const client of data) {
        try {
          const customerData = {
            first_name: client.nom,
            last_name: client.prenom,
            email: client.email,
            gender: 'Male',
            customer_group_id: 1,
            phone: client.phone || '',
            password: client.pwd,
            password_confirmation: client.pwd,
          };

          await createCustomer(customerData);
          successCount++;

        } catch (err) {
          console.error('Erreur import client:', err);
          const msg = err?.message || err?.errors?.password?.[0] || "Erreur inconnue";
          setErrors(prev => [
            ...prev,
            `${client.email} : ${msg}`
          ]);
          errorCount++;
        }
      }

      localStorage.clear();
      localStorage.setItem("clients", JSON.stringify(data));

      setMessage(`Import terminé: ${successCount} clients créés, ${errorCount} erreurs`);

    } catch (err) {
      console.error('Erreur globale import:', err);
      setMessage(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleImportProduits = async () => {
    if (!fileProduits) { setMessage('Veuillez sélectionner un fichier produits'); return;}
    setLoading(true);
    setMessage('');

    try {
      const data = await importCSV(fileProduits);
      let successCount = 0;
      let errorCount = 0;

      for (const produit of data) {
        try {
          let categoryId = null;
          if (produit.Categorie) {
            const category = await findOrCreateCategory(produit.Categorie);
            categoryId = category.id;
          }
          
          const produitData = {
            type: 'simple',
            attribute_family_id: 1,
            // sku: `${produit.sku}-${Date.now()}`,
            sku: produit.sku,
            name: produit.name,
            url_key: `${produit.sku}-${Date.now()}`.toLowerCase(),
            price: parseFloat(produit.prix_vente) || 0,
            cost: produit.prix_achat? parseFloat(produit.prix_achat): null,
            special_price: produit.prix_promo? parseFloat(produit.prix_promo): null,
            stock_initial: parseInt(produit.stock_initial || 0),
            weight: "0",
            status: 1,
            new: 1,
            featured: 1,
            visible_individually: 1,
            guest_checkout: 1,
            short_description: `${produit.name} - Description courte`,
            description: `${produit.name} - Description détaillée du produit`,
            channel: 'default',
            locale: 'fr',
            categories: categoryId ? [categoryId] : []
          };
          
          console.log("======= Produit creaction =======");
          console.log("Donnee recu : ", produit);

          await createProduit(produitData);
          successCount++;
        } catch (err) {
          console.error('Erreur import produit:', err);
          const msg = err?.message || "Erreur inconnue";
          setErrors(prev => [
            ...prev,
            `${produit.name} : ${msg}`
          ]);
          errorCount++;
        }
      }
      setMessage(`Import produits terminé: ${successCount} produits créés, ${errorCount} erreurs`);
    } catch (error) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImportCommandes = async () => {
    if (!fileCommandes) {
      setMessage('Veuillez sélectionner un fichier commandes');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const data = await importCSV(fileCommandes);
      const result = await importCommandes(data);
      setMessage( `Import commandes terminé: ${result.success} OK, ${result.errors} erreurs`);

     } catch (error) {
      // setMessage(`Erreur: ${error.message}`);
      const msg = error?.message || "Erreur inconnue";
      setErrors(prev => [
        ...prev,
        msg
      ]);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Import de données</h1>
      
      {message && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1rem', 
          backgroundColor: message.includes('erreur') ? '#ffcccc' : '#ccffcc',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      {errors.length > 0 && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          <h4>Erreurs :</h4>
          <ul>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
        <label>Fichier Clients (.csv)</label>
        <br />
        <input 
          type="file" 
          accept=".csv" 
          onChange={(e) => handleFileChange(e, setFileClients)} 
        />
        {fileClients && <p>Fichier: {fileClients.name}</p>}
        <button 
          onClick={handleImportClients} 
          disabled={loading || !fileClients}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          {loading && fileClients ? 'Import en cours...' : 'Importer les clients'}
        </button>
      </div>

      <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
        <label>Fichier Produits (.csv)</label>
        <br />
        <input 
          type="file" 
          accept=".csv" 
          onChange={(e) => handleFileChange(e, setFileProduits)} 
        />
        {fileProduits && <p>Fichier: {fileProduits.name}</p>}
        <button 
          onClick={handleImportProduits} 
          disabled={loading || !fileProduits}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          {loading && fileProduits ? 'Import en cours...' : 'Importer les produits'}
        </button>
      </div>

      <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
        <label>Fichier Commandes (.csv)</label>
        <br />
        <input 
          type="file" 
          accept=".csv" 
          onChange={(e) => handleFileChange(e, setFileCommandes)} 
        />
        {fileCommandes && <p>Fichier: {fileCommandes.name}</p>}
        <button
          onClick={handleImportCommandes}
          disabled={loading || !fileCommandes}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          {loading && fileCommandes ? 'Import en cours...' : 'Importer les commandes'}
        </button>

      </div>
      
    </div>
  );
}

export default Import;