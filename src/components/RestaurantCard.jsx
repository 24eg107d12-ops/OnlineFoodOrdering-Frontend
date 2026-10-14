import React from 'react';

export default function RestaurantCard({ restaurant, onSelect }) {
  const menuLength = restaurant.menu ? restaurant.menu.length : 0;
  const image = restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4';

  return (
    <div className="restaurant-card" onClick={() => onSelect(restaurant)}>
      <div className="card-img-wrapper">
        <img src={image} alt={restaurant.name} className="card-img" />
        <div className="rating-badge">
          <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i> {restaurant.rating || 4.5}
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{restaurant.name}</h3>
        <div className="card-cuisine">
          {restaurant.cuisineType} Cuisine • 25-35 mins
        </div>
        <p className="card-desc">
          {restaurant.description || 'Delicious prepared meals delivered fast.'}
        </p>
        <div className="card-footer">
          <span>
            <i className="fa-solid fa-location-dot"></i> {restaurant.address || 'City Center'}
          </span>
          <button
            className="btn-view-menu"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(restaurant);
            }}
          >
            View Menu ({menuLength})
          </button>
        </div>
      </div>
    </div>
  );
}
