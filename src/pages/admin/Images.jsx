import { useState } from 'react';
import { extractZipFiles } from '../../services/serv_import';
import { getProductIdBySku, updateProduit, getProduitById } from '../../services/serv_admin';

function Images() {
  const [fileImages, setFileImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFileImages(e.target.files[0]);
    setMessage('');
  };

  const handleImportImages = async () => {
    if (!fileImages) {
      setMessage('Veuillez sélectionner un fichier ZIP');
      return;
    }

    setLoading(true);
    setMessage('');

    try {

      const images = await extractZipFiles(fileImages);
      
      if (images.length === 0) {
        throw new Error('Aucune image trouvée dans le ZIP');
      }

      let successCount = 0;
      let errorCount = 0;

      const imagesBySku = {};
      images.forEach(img => {
        // Extraire juste le nom du fichier sans le chemin
        const fullName = img.name;
        const baseName = fullName.split('/').pop().replace(/\.[^/.]+$/, ''); // Enlever chemin et extension
        
        // Extraire le SKU (ex: sk-l, sk-m, sk-s)
        const sku = baseName.split('-')[0] + '-' + baseName.split('-')[1];
        
        if (!imagesBySku[sku]) {
          imagesBySku[sku] = [];
        }
        imagesBySku[sku].push(img);
      });

      //  Pour chaque SKU, trouver le produit et ajouter les images
      for (const [sku, productImages] of Object.entries(imagesBySku)) {
        try {
          // Trouver le produit par SKU
          const product_id = await getProductIdBySku(sku);
          console.log("Produit trouvee ID : ", product_id);

          const productData = await getProduitById(product_id);

          if (!product_id) {
            console.error(`Produit non trouvé pour SKU: ${sku}`);
            errorCount++;
            continue;
          }

          const imageFiles = productImages.map(img => {
            return new File(
              [img.blob],
              img.name,
              {
                type: `image/${img.extension}`
              }
            );
          });

          await updateProduit(product_id, {
            ...productData.data,

            categories: productData.data.categories
              ? productData.data.categories.map(cat => cat.id)
              : [],

            images: imageFiles
          });
                    
          successCount++;
        } catch (err) {
          console.error(`Erreur produit ${sku}:`, err);
          errorCount++;
        }
      }

      setMessage(`Import terminé: ${successCount} produits mis à jour, ${errorCount} erreurs`);
    } catch (error) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Import d'Images</h1>
      
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
      
      <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
        <label>Fichier Images (.zip)</label>
        <br />
        <input 
          type="file" 
          accept=".zip" 
          onChange={handleFileChange} 
        />
        {fileImages && <p>Fichier: {fileImages.name}</p>}
        <button 
          onClick={handleImportImages} 
          disabled={loading || !fileImages}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          {loading ? 'Import en cours...' : 'Importer les Images'}
        </button>
      </div>
    </div>
  );
}

export default Images;