import React from 'react';
import FoodCard from './FoodCard';

export default function MenuSection({
  title,
  subtitle,
  items,
  onBack,
  onAddToCart
}) {
  return (
    <section className="menu-section" id="menuSection">
      <div className="menu-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Back to Restaurants
        </button>
        <div className="restaurant-banner-info">
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--secondary)' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="food-grid">
        {items.length === 0 ? (
          <p className="empty-msg">No menu items found in this category.</p>
        ) : (
          items.map((item) => (
            <FoodCard
              key={`${item.id}-${item.name}`}
              item={item}
              onAddToCart={onAddToCart}
            />
          ))
        )}
      </div>
    </section>
  );
}
