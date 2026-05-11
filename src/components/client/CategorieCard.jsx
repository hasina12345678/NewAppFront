function CategorieCard({ categorie, onSelect }) {
  return (
    <div onClick={() => onSelect(categorie.id)} style={{ cursor: 'pointer' }}>
      <p>Id : {categorie.id}</p>
      <p>Nom {categorie.name}</p>
    </div>
  );
}

export default CategorieCard;