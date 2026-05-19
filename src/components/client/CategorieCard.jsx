import './CategorieCard.css';

function CategorieCard({ categorie, onSelect, isActive }) {

  return (
    <div className={`categorie-card ${isActive ? 'active' : ''}`} onClick={() => onSelect(categorie.id)}>
      {/* <p className="categorie-id"> #{categorie.id} </p> */}
      <h3 className="categorie-name">{categorie.name} </h3>
        
    </div>
  );
}

export default CategorieCard;