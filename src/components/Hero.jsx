import React from 'react';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="hero-tag">
          <i className="fa-solid fa-bolt"></i> Delivered in 30 Mins
        </span>
        <h1 className="hero-heading">
          Craving delicious food? <br />
          Order from the best restaurants!
        </h1>
        <p className="hero-subtext">
          Explore top-rated local eateries with fresh ingredients and lightning-fast doorstep delivery.
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <strong>500+</strong>
            <span>Dishes</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <strong>4.8 ★</strong>
            <span>Average Rating</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <strong>FREE</strong>
            <span>Delivery over $30</span>
          </div>
        </div>
      </div>
      <div className="hero-image-wrapper">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
          alt="Delicious Food"
          className="hero-img"
        />
      </div>
    </section>
  );
}
