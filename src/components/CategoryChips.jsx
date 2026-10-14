import React from 'react';

const CATEGORIES = [
  { key: 'all', label: 'All Items', icon: 'fa-solid fa-border-all' },
  { key: 'Pizza', label: 'Pizza', icon: 'fa-solid fa-pizza-slice' },
  { key: 'Burger', label: 'Burgers', icon: 'fa-solid fa-burger' },
  { key: 'Curry', label: 'Curries', icon: 'fa-solid fa-bowl-rice' },
  { key: 'Rice', label: 'Biryani & Rice', icon: 'fa-solid fa-fire-burner' },
  { key: 'Sides', label: 'Snacks & Sides', icon: 'fa-solid fa-cookie' }
];

export default function CategoryChips({ activeCategory, onSelectCategory }) {
  return (
    <section className="categories-section">
      <div className="section-header">
        <h2>Browse by Category</h2>
      </div>
      <div className="category-chips">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`chip ${activeCategory.toLowerCase() === cat.key.toLowerCase() ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.key)}
          >
            <i className={cat.icon}></i> {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
}
