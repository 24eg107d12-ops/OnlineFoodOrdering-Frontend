import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryChips from './components/CategoryChips';
import RestaurantList from './components/RestaurantList';
import MenuSection from './components/MenuSection';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import PastOrdersModal from './components/PastOrdersModal';
import AuthModal from './components/AuthModal';
import { apiService } from './services/api';

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodexpress_cart') || '[]');
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [pastOrders, setPastOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodexpress_user') || 'null');
    } catch {
      return null;
    }
  });

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('foodexpress_cart', JSON.stringify(cart));
  }, [cart]);

  // Initial load
  const loadInitialData = async () => {
    setLoadingRestaurants(true);
    const health = await apiService.checkHealth();
    setBackendOnline(health);

    const { data, isOnline } = await apiService.getRestaurants();
    setRestaurants(data);
    setBackendOnline(isOnline);
    setLoadingRestaurants(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Keyboard shortcut for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsCheckoutOpen(false);
        setIsSuccessOpen(false);
        setIsOrdersOpen(false);
        setIsAuthOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extract all food items across restaurants
  const allFoodItems = useMemo(() => {
    const items = [];
    restaurants.forEach((r) => {
      if (r.menu) {
        r.menu.forEach((item) => {
          items.push({
            ...item,
            restaurantName: r.name,
            restaurantId: r.id
          });
        });
      }
    });
    return items;
  }, [restaurants]);

  // Cart Management
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { id: item.id, name: item.name, price: parseFloat(item.price || 0), qty: 1 }];
    });
  };

  const handleUpdateQty = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + change } : item))
        .filter((item) => item.qty > 0)
    );
  };

  // Cart calculations
  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartDelivery = cartSubtotal > 30 ? 0 : 2.99;
  const cartTax = cartSubtotal * 0.05;
  const cartTotal = cartSubtotal + cartDelivery + cartTax;

  // Search and Filtering
  const sortedRestaurants = useMemo(() => {
    const list = [...restaurants];
    if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return list;
  }, [restaurants, sortBy]);

  // Handlers for Views
  const handleSelectRestaurant = (r) => {
    setSelectedRestaurant(r);
    setActiveCategory('all');
    setSearchQuery('');
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setActiveCategory('all');
    setSearchQuery('');
  };

  const handleSelectCategory = (catKey) => {
    setActiveCategory(catKey);
    setSelectedRestaurant(null);
    setSearchQuery('');
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setSelectedRestaurant(null);
  };

  const handleResetView = () => {
    setSelectedRestaurant(null);
    setActiveCategory('all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Orders Modal
  const handleOpenOrders = async () => {
    setIsOrdersOpen(true);
    setIsOrdersLoading(true);
    const orders = await apiService.getOrders(backendOnline);
    setPastOrders(orders);
    setIsOrdersLoading(false);
  };

  // Checkout and Place Order
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleSubmitOrder = async ({ customerName, customerEmail, deliveryAddress }) => {
    const itemsSummary = cart.map((i) => `${i.qty}x ${i.name}`).join(', ');
    const orderPayload = {
      customerName,
      customerEmail,
      deliveryAddress,
      totalAmount: parseFloat(cartTotal.toFixed(2)),
      status: 'CONFIRMED',
      itemsSummary
    };

    const { order } = await apiService.placeOrder(orderPayload);
    setConfirmedOrder(order);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
  };

  // Auth
  const handleOpenAuth = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('foodexpress_user');
  };

  // Determine what view to render
  const renderMainContent = () => {
    const q = searchQuery.trim().toLowerCase();

    // 1. Search Query active
    if (q) {
      const matchedRestaurants = sortedRestaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisineType.toLowerCase().includes(q)
      );

      const matchedFoods = allFoodItems.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.description && f.description.toLowerCase().includes(q)) ||
          (f.category && f.category.toLowerCase().includes(q))
      );

      if (matchedRestaurants.length > 0) {
        return (
          <RestaurantList
            restaurants={matchedRestaurants}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onSelectRestaurant={handleSelectRestaurant}
            loading={false}
          />
        );
      }

      return (
        <MenuSection
          title={`Search results for "${searchQuery}"`}
          subtitle={`Found ${matchedFoods.length} dishes matching your search`}
          items={matchedFoods}
          onBack={handleBackToRestaurants}
          onAddToCart={handleAddToCart}
        />
      );
    }

    // 2. Specific Restaurant Selected
    if (selectedRestaurant) {
      return (
        <MenuSection
          title={selectedRestaurant.name}
          subtitle={`${selectedRestaurant.cuisineType} Cuisine • ${selectedRestaurant.address} • ⭐ ${selectedRestaurant.rating} Rating`}
          items={selectedRestaurant.menu || []}
          onBack={handleBackToRestaurants}
          onAddToCart={handleAddToCart}
        />
      );
    }

    // 3. Category Filtered (non-'all')
    if (activeCategory !== 'all') {
      const filteredFoods = allFoodItems.filter(
        (f) => f.category && f.category.toLowerCase() === activeCategory.toLowerCase()
      );
      return (
        <MenuSection
          title={`${activeCategory} Dishes`}
          subtitle={`Showing delicious ${activeCategory} choices across top kitchens`}
          items={filteredFoods}
          onBack={handleBackToRestaurants}
          onAddToCart={handleAddToCart}
        />
      );
    }

    // 4. Default Home View: Restaurant List
    return (
      <RestaurantList
        restaurants={sortedRestaurants}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onSelectRestaurant={handleSelectRestaurant}
        loading={loadingRestaurants}
      />
    );
  };

  return (
    <div className="app-root">
      <Navbar
        backendOnline={backendOnline}
        onCheckBackend={loadInitialData}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenOrders={handleOpenOrders}
        cartCount={totalCartCount}
        onToggleCart={() => setIsCartOpen((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onResetView={handleResetView}
      />

      <main className="main-content">
        {!selectedRestaurant && !searchQuery && activeCategory === 'all' && <Hero />}
        {!selectedRestaurant && !searchQuery && (
          <CategoryChips
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
        )}
        {renderMainContent()}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        currentUser={currentUser}
        totalAmount={cartTotal}
        onSubmitOrder={handleSubmitOrder}
      />

      <OrderSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          handleResetView();
        }}
        order={confirmedOrder}
      />

      <PastOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={pastOrders}
        loading={isOrdersLoading}
      />

      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authTab}
        onClose={() => setIsAuthOpen(false)}
        backendOnline={backendOnline}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}
