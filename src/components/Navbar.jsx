import React from 'react';

export default function Navbar({
  backendOnline,
  onCheckBackend,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenOrders,
  cartCount,
  onToggleCart,
  searchQuery,
  onSearchChange,
  onResetView
}) {
  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'User';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="brand" onClick={onResetView} role="button" tabIndex={0}>
          <div className="brand-logo">
            <i className="fa-solid fa-utensils"></i>
          </div>
          <div className="brand-text">
            <span className="brand-title">
              Food<span className="highlight">Express</span>
            </span>
            <span className="brand-subtitle">Fast & Fresh Delivery</span>
          </div>
        </div>

        <div className="search-container">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            id="searchInput"
            placeholder="Search dishes, restaurants, or cuisines..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="nav-actions">
          <div
            className={`backend-status ${backendOnline ? 'online' : 'demo-mode'}`}
            title={backendOnline ? 'Backend API connected on port 8081. Click to recheck.' : 'Running in Demo Mode (Mock data). Click to retry backend connection.'}
            onClick={onCheckBackend}
            style={{ cursor: 'pointer' }}
          >
            <span className="status-pulse"></span>
            <span>{backendOnline ? 'Backend Connected' : 'Demo Mode (Active)'}</span>
          </div>

          <div id="authNavContainer">
            {currentUser ? (
              <div className="user-badge">
                <i className="fa-solid fa-circle-user"></i>
                <span>Hi, {firstName}</span>
                <button
                  className="logout-btn"
                  onClick={onLogout}
                  title="Sign Out"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <button className="nav-btn" onClick={() => onOpenAuth('login')}>
                <i className="fa-solid fa-user"></i>
                <span>Sign In</span>
              </button>
            )}
          </div>

          <button className="nav-btn" onClick={onOpenOrders}>
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>Orders</span>
          </button>

          <button className="cart-btn" onClick={onToggleCart}>
            <i className="fa-solid fa-bag-shopping"></i>
            <span>Cart</span>
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
