import React, { useState } from 'react';

export default function FoodCard({ item, onAddToCart }) {
  const [justAdded, setJustAdded] = useState(false);
  const image = item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';

  const handleAdd = () => {
    onAddToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 500);
  };

  return (
    <div className="food-card">
      <div className="food-img-wrapper">
        <img src={image} alt={item.name} className="food-img" />
        <span className="food-category-badge">{item.category || 'Special'}</span>
      </div>
      <div className="food-body">
        <h4 className="food-name">{item.name}</h4>
        <p className="food-desc">
          {item.description || 'Prepared fresh with high quality ingredients.'}
        </p>
        <div className="food-action">
          <span className="food-price">${parseFloat(item.price || 0).toFixed(2)}</span>
          <button
            className={`add-cart-btn ${justAdded ? 'added' : ''}`}
            onClick={handleAdd}
          >
            <i className={`fa-solid ${justAdded ? 'fa-check' : 'fa-plus'}`}></i>{' '}
            {justAdded ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
