import { fallbackRestaurants } from '../data/fallbackData';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchWithTimeout(url, options = {}, timeoutMs = 1500) {
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

export const apiService = {
  async checkHealth() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/status`, {}, 1200);
      return res.ok;
    } catch {
      return false;
    }
  },

  async getRestaurants() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/restaurants`, {}, 1500);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      return { data, isOnline: true };
    } catch (err) {
      console.warn('Backend unavailable, using fallback restaurants:', err);
      return { data: fallbackRestaurants, isOnline: false };
    }
  },

  async placeOrder(orderPayload) {
    let orderId = Math.floor(1000 + Math.random() * 9000);
    let isSavedOnBackend = false;

    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      }, 2000);
      if (res.ok) {
        const data = await res.json();
        orderId = data.id || orderId;
        isSavedOnBackend = true;
      }
    } catch (err) {
      console.warn('Backend order failed, falling back to local storage:', err);
    }

    const localOrder = {
      ...orderPayload,
      id: orderId,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Save to local storage for instant availability
    const saved = JSON.parse(localStorage.getItem('foodexpress_demo_orders') || '[]');
    saved.unshift(localOrder);
    localStorage.setItem('foodexpress_demo_orders', JSON.stringify(saved));

    return { order: localOrder, isSavedOnBackend };
  },

  async getOrders(isBackendOnline) {
    if (isBackendOnline) {
      try {
        const res = await fetchWithTimeout(`${API_BASE}/api/orders`, {}, 1500);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data;
          }
        }
      } catch (err) {
        console.warn('Could not fetch backend orders:', err);
      }
    }
    return JSON.parse(localStorage.getItem('foodexpress_demo_orders') || '[]');
  },

  async login(email, password, isBackendOnline) {
    if (!email || !password) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    // Derive a nice friendly name from any email (e.g. reddyl23@gmail.com -> Reddyl23)
    const prefix = email.split('@')[0] || 'User';
    const formattedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);

    // Try backend if online
    if (isBackendOnline) {
      try {
        const res = await fetchWithTimeout(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }, 1500);

        const data = await res.json();
        if (res.ok && data.user) {
          localStorage.setItem('foodexpress_user', JSON.stringify(data.user));
          return { success: true, user: data.user };
        }
      } catch (err) {
        console.warn('Backend login attempt fell back to instant client auth:', err);
      }
    }

    // Instant access: Accept any email ID with zero verification or confirmation hurdles
    const user = {
      id: Math.floor(1000 + Math.random() * 9000),
      name: formattedName,
      email: email.trim(),
      phone: '+1 555-0199',
      role: 'CUSTOMER'
    };
    localStorage.setItem('foodexpress_user', JSON.stringify(user));
    return { success: true, user };
  },

  async register(name, email, phone, password, isBackendOnline) {
    if (!name || !email || !password) {
      return { success: false, error: 'Please fill in name, email, and password.' };
    }

    if (isBackendOnline) {
      try {
        const res = await fetchWithTimeout(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password, role: 'CUSTOMER' })
        }, 1500);

        const data = await res.json();
        if (res.ok && data.user) {
          localStorage.setItem('foodexpress_user', JSON.stringify(data.user));
          return { success: true, user: data.user };
        }
      } catch (err) {
        console.warn('Backend registration fell back to instant client auth:', err);
      }
    }

    // Instant registration: Save user immediately
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '+1 555-0199',
      role: 'CUSTOMER'
    };
    localStorage.setItem('foodexpress_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  }
};
