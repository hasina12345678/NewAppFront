import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

// Fonction 1 : CSV avec bibliothèque
const importCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Fonction 2 : CSV fait main
const importCSV2 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      
      const headers = lines[0].split(',').map(h => h.trim());
      
      const result = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = values[j];
        }
        result.push(row);
      }
      
      resolve(result);
    };
    
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsText(file);
  });
};

// Fonction 3 : Excel
const importExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      resolve(jsonData);
    };
    
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsArrayBuffer(file);
  });
};

const parserLigne = (row) => {
  const newRow = {};
  for (let key in row) {
    let value = row[key];
    
    // Détecte et convertit les tableaux
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      try {
        newRow[key] = eval(value); // Attention: eval() mais pour CSV contrôlé
      } catch {
        newRow[key] = value;
      }
    }
    // Convertit les booléens
    else if (value === 'true') newRow[key] = true;
    else if (value === 'false') newRow[key] = false;
    // Convertit les nombres
    else if (!isNaN(value) && value !== '') newRow[key] = Number(value);
    else newRow[key] = value;
  }
  return newRow;
};

const extractZipFiles = async (file) => {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);
  
  const files = [];
  
  for (const [filename, zipEntry] of Object.entries(contents.files)) {
    if (!zipEntry.dir && (filename.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
      const imageData = await zipEntry.async('blob');
      files.push({
        name: filename,
        blob: imageData,
        extension: filename.split('.').pop().toLowerCase()
      });
    }
  }
  
  return files;
};

export { importCSV, importCSV2, importExcel , extractZipFiles};