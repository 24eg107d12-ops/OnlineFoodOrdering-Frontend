import React from 'react';
import RestaurantCard from './RestaurantCard';

export default function RestaurantList({
  restaurants,
  sortBy,
  onSortChange,
  onSelectRestaurant,
  loading
}) {
  return (
    <section className="restaurants-section" id="restaurantsSection">
      <div className="section-header">
        <div>
          <h2>Popular Restaurants</h2>
          <p className="section-subtitle">Top curated dining spots in your neighborhood</p>
        </div>
        <div className="filter-pills">
          <button
            className={`pill ${sortBy === 'rating' ? 'active' : ''}`}
            onClick={() => onSortChange('rating')}
          >
            Top Rated
          </button>
          <button
            className={`pill ${sortBy === 'name' ? 'active' : ''}`}
            onClick={() => onSortChange('name')}
          >
            Name
          </button>
        </div>
      </div>

      <div className="restaurant-grid">
        {loading ? (
          <div className="loading-spinner">
            <i className="fa-solid fa-spinner fa-spin"></i> Loading restaurants...
          </div>
        ) : restaurants.length === 0 ? (
          <p className="empty-msg">No restaurants found matching your criteria.</p>
        ) : (
          restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onSelect={onSelectRestaurant}
            />
          ))
        )}
      </div>
    </section>
  );
}
