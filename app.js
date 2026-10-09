// FoodExpress Frontend Application Logic
const API_BASE = (window.location.protocol.startsWith('http') && window.location.port === '8081') ? '' : 'http://localhost:8081';

// State Management
let restaurants = [];
let allFoodItems = [];
let cart = [];
let activeCategory = 'all';
let currentUser = JSON.parse(localStorage.getItem('foodexpress_user') || 'null');
let isBackendOnline = false;

// Fast fetch helper with timeout to completely prevent lagging/freezing
async function fetchWithTimeout(url, options = {}, timeoutMs = 1200) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}

// Fallback demo data in case backend server is paused
const fallbackRestaurants = [
    {
        id: 1,
        name: "Pizza Bella",
        cuisineType: "Italian",
        address: "123 Napoli Way, City Center",
        rating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
        menu: [
            { id: 1, name: "Margherita Pizza", description: "Fresh mozzarella, San Marzano tomatoes, and basil.", price: 12.99, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80" },
            { id: 2, name: "Pepperoni Feast", description: "Double pepperoni with melted provolone and mozzarella.", price: 15.99, category: "Pizza", imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80" },
            { id: 3, name: "Garlic Breadsticks", description: "Crispy outside, soft inside with warm marinara dip.", price: 6.49, category: "Sides", imageUrl: "https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=500&auto=format&fit=crop&q=80" }
        ]
    },
    {
        id: 2,
        name: "Burger Nation",
        cuisineType: "American",
        address: "456 Broadway Avenue",
        rating: 4.6,
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
        menu: [
            { id: 4, name: "Classic Cheeseburger", description: "Angus beef patty, aged cheddar, pickles & secret sauce.", price: 10.99, category: "Burger", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80" },
            { id: 5, name: "Crispy Chicken Burger", description: "Southern fried chicken breast, spicy mayo & pickles.", price: 11.99, category: "Burger", imageUrl: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80" },
            { id: 6, name: "Loaded Truffle Fries", description: "Crispy fries drizzled with truffle oil and parmesan.", price: 6.99, category: "Sides", imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80" }
        ]
    },
    {
        id: 3,
        name: "Spice Route",
        cuisineType: "Indian",
        address: "789 Curry Lane",
        rating: 4.9,
        imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80",
        menu: [
            { id: 7, name: "Butter Chicken with Naan", description: "Tender chicken in a velvety spiced tomato butter sauce.", price: 14.99, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1603894583373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80" },
            { id: 8, name: "Paneer Tikka Masala", description: "Grilled cottage cheese cubes in rich spiced gravy.", price: 13.99, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80" },
            { id: 9, name: "Hyderabadi Dum Biryani", description: "Fragrant basmati rice layered with aromatic spices and chicken.", price: 16.49, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80" }
        ]
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkBackendHealth();
    renderAuthUI();
    loadRestaurants();
    setupModalEventHandlers();
});

// Check Backend Server Status
async function checkBackendHealth(userTriggered = false) {
    const badge = document.getElementById('backendBadge');
    const text = document.getElementById('backendStatusText');
    if (!badge || !text) return false;

    if (userTriggered) {
        text.innerText = 'Checking...';
    }

    try {
        const res = await fetchWithTimeout(`${API_BASE}/api/status`, {}, 1200);
        if (res.ok) {
            isBackendOnline = true;
            badge.className = 'backend-status online';
            text.innerText = 'Backend Connected';
            badge.title = 'Backend API is running on port 8081. Click to recheck.';
            if (userTriggered) {
                loadRestaurants();
            }
            return true;
        } else {
            throw new Error('Status not OK');
        }
    } catch (err) {
        isBackendOnline = false;
        badge.className = 'backend-status demo-mode';
        text.innerText = 'Demo Mode (Active)';
        badge.title = 'Running in Demo Mode (Mock data). Click to retry connection to backend.';
        return false;
    }
}

// Fetch and display Restaurants
async function loadRestaurants() {
    const grid = document.getElementById('restaurantGrid');
    try {
        const res = await fetchWithTimeout(`${API_BASE}/api/restaurants`, {}, 1200);
        if (!res.ok) throw new Error('Network error');
        restaurants = await res.json();
    } catch (err) {
        // Fallback demo data loaded instantly with 0 lag
        restaurants = fallbackRestaurants;
    }

    // Extract all food items for category search
    allFoodItems = [];
    restaurants.forEach(r => {
        if (r.menu) {
            r.menu.forEach(item => {
                allFoodItems.push({ ...item, restaurantName: r.name });
            });
        }
    });

    renderRestaurants(restaurants);
}

function renderRestaurants(list) {
    const grid = document.getElementById('restaurantGrid');
    if (!list || list.length === 0) {
        grid.innerHTML = '<p class="empty-msg">No restaurants found matching your criteria.</p>';
        return;
    }

    grid.innerHTML = list.map(r => `
        <div class="restaurant-card" onclick="viewRestaurantMenu(${r.id})">
            <div class="card-img-wrapper">
                <img src="${r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}" alt="${r.name}" class="card-img">
                <div class="rating-badge">
                    <i class="fa-solid fa-star" style="color: #f59e0b;"></i> ${r.rating || 4.5}
                </div>
            </div>
            <div class="card-body">
                <h3 class="card-title">${r.name}</h3>
                <div class="card-cuisine">${r.cuisineType} Cuisine • 25-35 mins</div>
                <p class="card-desc">${r.description || 'Delicious prepared meals delivered fast.'}</p>
                <div class="card-footer">
                    <span><i class="fa-solid fa-location-dot"></i> ${r.address || 'City Center'}</span>
                    <button class="btn-view-menu" onclick="event.stopPropagation(); viewRestaurantMenu(${r.id})">
                        View Menu (${r.menu ? r.menu.length : 0})
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// View Single Restaurant Menu
function viewRestaurantMenu(restaurantId) {
    const r = restaurants.find(item => item.id === restaurantId);
    if (!r) return;

    document.getElementById('restaurantsSection').style.display = 'none';
    const menuSection = document.getElementById('menuSection');
    menuSection.style.display = 'block';

    document.getElementById('restaurantBannerInfo').innerHTML = `
        <h2 style="font-size: 26px; font-weight: 800; color: var(--secondary);">${r.name}</h2>
        <p style="color: var(--text-muted); font-size: 14px;">${r.cuisineType} • ${r.address} • ⭐ ${r.rating} Rating</p>
    `;

    renderFoodItems(r.menu || []);
    window.scrollTo({ top: 300, behavior: 'smooth' });
}

// Show All Restaurants View
function showAllRestaurants() {
    document.getElementById('restaurantsSection').style.display = 'block';
    document.getElementById('menuSection').style.display = 'none';
    renderRestaurants(restaurants);
}

// Render Food Items Grid
function renderFoodItems(items) {
    const grid = document.getElementById('foodGrid');
    if (!items || items.length === 0) {
        grid.innerHTML = '<p class="empty-msg">No menu items found in this category.</p>';
        return;
    }

    grid.innerHTML = items.map(item => `
        <div class="food-card">
            <div class="food-img-wrapper">
                <img src="${item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}" alt="${item.name}" class="food-img">
                <span class="food-category-badge">${item.category || 'Special'}</span>
            </div>
            <div class="food-body">
                <h4 class="food-name">${item.name}</h4>
                <p class="food-desc">${item.description || 'Prepared fresh with high quality ingredients.'}</p>
                <div class="food-action">
                    <span class="food-price">$${parseFloat(item.price).toFixed(2)}</span>
                    <button class="add-cart-btn" onclick="addToCart(${item.id}, '${escapeQuotes(item.name)}', ${item.price})">
                        <i class="fa-solid fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function escapeQuotes(str) {
    return str.replace(/'/g, "\\'");
}

// Category Filtering
function filterCategory(category, chipElement) {
    activeCategory = category;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    if (chipElement) chipElement.classList.add('active');

    if (category === 'all') {
        showAllRestaurants();
        return;
    }

    // Filter food items across restaurants matching category
    const filteredFoods = allFoodItems.filter(f => f.category && f.category.toLowerCase() === category.toLowerCase());
    
    document.getElementById('restaurantsSection').style.display = 'none';
    const menuSection = document.getElementById('menuSection');
    menuSection.style.display = 'block';

    document.getElementById('restaurantBannerInfo').innerHTML = `
        <h2 style="font-size: 26px; font-weight: 800; color: var(--secondary);">${category} Dishes</h2>
        <p style="color: var(--text-muted); font-size: 14px;">Showing delicious ${category} choices across top kitchens</p>
    `;

    renderFoodItems(filteredFoods);
}

// Search Handler
function handleSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
        showAllRestaurants();
        return;
    }

    const matchedRestaurants = restaurants.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.cuisineType.toLowerCase().includes(q)
    );

    const matchedFoods = allFoodItems.filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );

    if (matchedRestaurants.length > 0) {
        document.getElementById('restaurantsSection').style.display = 'block';
        document.getElementById('menuSection').style.display = 'none';
        renderRestaurants(matchedRestaurants);
    } else {
        document.getElementById('restaurantsSection').style.display = 'none';
        const menuSection = document.getElementById('menuSection');
        menuSection.style.display = 'block';
        document.getElementById('restaurantBannerInfo').innerHTML = `
            <h2>Search results for "${query}"</h2>
        `;
        renderFoodItems(matchedFoods);
    }
}

// Sort Restaurants
function sortRestaurants(type) {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    event.target.classList.add('active');

    if (type === 'rating') {
        restaurants.sort((a, b) => b.rating - a.rating);
    } else if (type === 'name') {
        restaurants.sort((a, b) => a.name.localeCompare(b.name));
    }
    renderRestaurants(restaurants);
}

// Cart Management
function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
}

function addToCart(id, name, price) {
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, price: parseFloat(price), qty: 1 });
    }
    updateCartUI();

    // Pulse cart button
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
}

function updateCartQty(id, change) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += change;
    if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== id);
    }
    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartBadge').innerText = totalCount;
    document.getElementById('cartCount').innerText = totalCount;

    const container = document.getElementById('cartItemsContainer');
    const footer = document.getElementById('cartFooter');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-basket-shopping empty-icon"></i>
                <p>Your cart is empty</p>
                <span>Add delicious items from the menu to start ordering</span>
            </div>
        `;
        footer.style.display = 'none';
        return;
    }

    footer.style.display = 'block';
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>$${item.price.toFixed(2)} each</span>
            </div>
            <div class="qty-control">
                <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">−</button>
                <span class="qty-val">${item.qty}</span>
                <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
            </div>
            <div style="font-weight: 700; color: var(--secondary); font-size: 14px;">
                $${(item.price * item.qty).toFixed(2)}
            </div>
        </div>
    `).join('');

    // Bill calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = subtotal > 30 ? 0.00 : 2.99;
    const tax = subtotal * 0.05;
    const total = subtotal + delivery + tax;

    document.getElementById('billSubtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('billDelivery').innerText = delivery === 0 ? 'FREE' : `$${delivery.toFixed(2)}`;
    document.getElementById('billTax').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('billTotal').innerText = `$${total.toFixed(2)}`;
    document.getElementById('modalTotalPay').innerText = `$${total.toFixed(2)}`;
}

// Checkout Flow
function openCheckoutModal() {
    if (cart.length === 0) return;
    toggleCart(); // close drawer
    if (currentUser) {
        if (document.getElementById('custName')) document.getElementById('custName').value = currentUser.name || '';
        if (document.getElementById('custEmail')) document.getElementById('custEmail').value = currentUser.email || '';
    }
    document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// Local Demo Orders Storage Helpers
function getLocalOrders() {
    return JSON.parse(localStorage.getItem('foodexpress_demo_orders') || '[]');
}

function saveLocalOrder(order) {
    const orders = getLocalOrders();
    orders.unshift(order);
    localStorage.setItem('foodexpress_demo_orders', JSON.stringify(orders));
}

async function handlePlaceOrder(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submitOrderBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Placing Order...';

    const customerName = document.getElementById('custName').value.trim();
    const customerEmail = document.getElementById('custEmail').value.trim();
    const deliveryAddress = document.getElementById('custAddress').value.trim();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = subtotal > 30 ? 0.00 : 2.99;
    const tax = subtotal * 0.05;
    const totalAmount = parseFloat((subtotal + delivery + tax).toFixed(2));

    const itemsSummary = cart.map(i => `${i.qty}x ${i.name}`).join(', ');

    const payload = {
        customerName,
        customerEmail,
        deliveryAddress,
        totalAmount,
        status: "CONFIRMED",
        itemsSummary
    };

    let orderId = Math.floor(1000 + Math.random() * 9000);

    if (isBackendOnline) {
        try {
            const res = await fetchWithTimeout(`${API_BASE}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }, 1500);
            if (res.ok) {
                const data = await res.json();
                orderId = data.id || orderId;
            }
        } catch (err) {
            console.warn('Backend order failed, stored locally:', err);
        }
    }

    // Save locally for immediate viewing in Past Orders modal
    saveLocalOrder({
        id: orderId,
        customerName,
        customerEmail,
        deliveryAddress,
        totalAmount,
        status: "CONFIRMED",
        itemsSummary,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Confirm & Place Order</span> <i class="fa-solid fa-check"></i>';
    closeCheckoutModal();

    // Show Success Modal
    showSuccessModal(orderId, customerName, deliveryAddress, itemsSummary, totalAmount);

    // Clear Cart
    cart = [];
    updateCartUI();
}

function showSuccessModal(orderId, name, address, items, total) {
    document.getElementById('confirmedOrderId').innerText = orderId;
    document.getElementById('trackCustName').innerText = name;
    document.getElementById('trackCustAddress').innerText = address;
    document.getElementById('trackItems').innerText = items;
    document.getElementById('trackTotal').innerText = `$${total.toFixed(2)}`;

    document.getElementById('orderSuccessModal').classList.add('active');
}

function closeSuccessModal() {
    document.getElementById('orderSuccessModal').classList.remove('active');
    showAllRestaurants();
}

// Past Orders Modal
async function openOrdersModal() {
    const modal = document.getElementById('pastOrdersModal');
    const container = document.getElementById('pastOrdersList');
    modal.classList.add('active');
    container.innerHTML = '<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Fetching orders...</div>';

    let orders = [];
    if (isBackendOnline) {
        try {
            const res = await fetchWithTimeout(`${API_BASE}/api/orders`, {}, 1500);
            if (res.ok) {
                orders = await res.json();
            }
        } catch (err) {
            console.warn('Backend orders unavailable, showing demo orders:', err);
        }
    }

    // Fallback to local demo orders if backend returned empty or offline
    if (!orders || orders.length === 0) {
        orders = getLocalOrders();
    }

    renderOrdersList(orders);
}

function renderOrdersList(orders) {
    const container = document.getElementById('pastOrdersList');
    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 30px; color: var(--text-muted);">
                <i class="fa-solid fa-receipt" style="font-size: 32px; margin-bottom: 10px; color: #cbd5e1;"></i>
                <p>No orders found yet.</p>
                <small>Orders you place in demo mode will appear here immediately!</small>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(o => `
        <div class="order-history-card">
            <div class="order-history-header">
                <strong>Order #${o.id}</strong>
                <span class="order-status-badge">${o.status || 'CONFIRMED'}</span>
            </div>
            <p style="font-size: 13px; color: var(--secondary); margin-bottom: 4px;"><strong>Items:</strong> ${o.itemsSummary || 'Food items'}</p>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;"><strong>Delivery to:</strong> ${o.deliveryAddress || 'Address'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; font-weight: 700; color: var(--primary);">Total: $${parseFloat(o.totalAmount || 0).toFixed(2)}</span>
                ${o.createdAt ? `<span style="font-size: 11px; color: var(--text-muted);">${o.createdAt}</span>` : ''}
            </div>
        </div>
    `).join('');
}

function closeOrdersModal() {
    document.getElementById('pastOrdersModal').classList.remove('active');
}

// ================= AUTHENTICATION LOGIC =================
function renderAuthUI() {
    const container = document.getElementById('authNavContainer');
    if (!container) return;

    if (currentUser) {
        const firstName = currentUser.name ? currentUser.name.split(' ')[0] : 'User';
        container.innerHTML = `
            <div class="user-badge">
                <i class="fa-solid fa-circle-user"></i>
                <span>Hi, ${firstName}</span>
                <button class="logout-btn" onclick="handleLogout()" title="Sign Out">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <button class="nav-btn" onclick="openAuthModal('login')">
                <i class="fa-solid fa-user"></i>
                <span>Sign In</span>
            </button>
        `;
    }
}

function openAuthModal(tab = 'login') {
    switchAuthTab(tab);
    clearAuthAlert();
    document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(tab) {
    clearAuthAlert();
    const loginBtn = document.getElementById('loginTabBtn');
    const registerBtn = document.getElementById('registerTabBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (tab === 'login') {
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        registerBtn.classList.add('active');
        loginBtn.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    }
}

function showAuthAlert(type, msg) {
    const alertBox = document.getElementById('authAlert');
    if (alertBox) {
        alertBox.className = `auth-alert ${type}`;
        alertBox.innerText = msg;
        alertBox.style.display = 'block';
    }
}

function clearAuthAlert() {
    const alertBox = document.getElementById('authAlert');
    if (alertBox) {
        alertBox.style.display = 'none';
        alertBox.innerText = '';
    }
}

// Auto-fill demo credentials
function fillDemoCredentials() {
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');
    if (emailInput) emailInput.value = 'demo@example.com';
    if (passInput) passInput.value = 'password123';
}

// 1-Click Instant Demo Login
function quickDemoLogin() {
    fillDemoCredentials();
    completeDemoLogin('Rahul Sharma', 'demo@example.com');
}

function completeDemoLogin(name = 'Rahul Sharma', email = 'demo@example.com') {
    currentUser = { id: 1, name, email, phone: '+1 555-0199', role: 'CUSTOMER' };
    localStorage.setItem('foodexpress_user', JSON.stringify(currentUser));
    renderAuthUI();
    showAuthAlert('success', `Signed in successfully as ${name}!`);
    setTimeout(() => {
        closeAuthModal();
    }, 500);
}

async function handleLogin(event) {
    if (event) event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const submitBtn = document.getElementById('loginSubmitBtn');

    if (!email || !password) {
        showAuthAlert('error', 'Please enter your email and password.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

    const isDemoCreds = (email === 'demo@example.com' && password === 'password123');

    // Instant login for demo account if backend is offline or demo mode
    if (!isBackendOnline && isDemoCreds) {
        completeDemoLogin('Rahul Sharma', email);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Sign In</span> <i class="fa-solid fa-arrow-right-to-bracket"></i>';
        return;
    }

    try {
        const res = await fetchWithTimeout(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }, 1500);

        const data = await res.json();
        if (res.ok) {
            currentUser = data.user;
            localStorage.setItem('foodexpress_user', JSON.stringify(currentUser));
            renderAuthUI();
            showAuthAlert('success', 'Signed in successfully!');
            setTimeout(() => {
                closeAuthModal();
            }, 500);
        } else {
            showAuthAlert('error', data.error || 'Invalid email or password.');
        }
    } catch (err) {
        if (isDemoCreds) {
            completeDemoLogin('Rahul Sharma', email);
        } else {
            isBackendOnline = false;
            showAuthAlert('error', 'Backend is unreachable. Use demo credentials (demo@example.com / password123) or click "One-Click Demo Sign In".');
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Sign In</span> <i class="fa-solid fa-arrow-right-to-bracket"></i>';
    }
}

async function handleRegister(event) {
    if (event) event.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const submitBtn = document.getElementById('registerSubmitBtn');

    if (!name || !email || !password) {
        showAuthAlert('error', 'Please fill in name, email, and password.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';

    if (!isBackendOnline) {
        currentUser = { id: Date.now(), name, email, phone, role: 'CUSTOMER' };
        localStorage.setItem('foodexpress_user', JSON.stringify(currentUser));
        renderAuthUI();
        showAuthAlert('success', `Account created successfully for ${name} (Demo mode)!`);
        setTimeout(() => {
            closeAuthModal();
        }, 500);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Create Account</span> <i class="fa-solid fa-user-plus"></i>';
        return;
    }

    try {
        const res = await fetchWithTimeout(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password, role: 'CUSTOMER' })
        }, 1500);

        const data = await res.json();
        if (res.ok) {
            currentUser = data.user;
            localStorage.setItem('foodexpress_user', JSON.stringify(currentUser));
            renderAuthUI();
            showAuthAlert('success', 'Account created successfully!');
            setTimeout(() => {
                closeAuthModal();
            }, 500);
        } else {
            showAuthAlert('error', data.error || 'Registration failed');
        }
    } catch (err) {
        currentUser = { id: Date.now(), name, email, phone, role: 'CUSTOMER' };
        localStorage.setItem('foodexpress_user', JSON.stringify(currentUser));
        renderAuthUI();
        showAuthAlert('success', `Account created successfully for ${name} (Demo mode)!`);
        setTimeout(() => {
            closeAuthModal();
        }, 500);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Create Account</span> <i class="fa-solid fa-user-plus"></i>';
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('foodexpress_user');
    renderAuthUI();
}

// Modal closing helpers
function setupModalEventHandlers() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
            const drawer = document.getElementById('cartDrawer');
            const overlay = document.getElementById('cartOverlay');
            if (drawer) drawer.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        }
    });
}

