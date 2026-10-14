import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function AuthModal({
  isOpen,
  initialTab = 'login',
  onClose,
  backendOnline,
  onAuthSuccess
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
    setActiveTab(initialTab);
    setAlert(null);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setLoginEmail('demo@example.com');
    setLoginPassword('password123');
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setAlert(null);
    try {
      const res = await apiService.login('demo@example.com', 'password123', false);
      if (res.success) {
        setAlert({ type: 'success', message: 'Signed in successfully as Rahul Sharma!' });
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAlert({ type: 'error', message: 'Please enter your email and password.' });
      return;
    }

    setLoading(true);
    setAlert(null);
    try {
      const res = await apiService.login(loginEmail.trim(), loginPassword.trim(), backendOnline);
      if (res.success) {
        setAlert({ type: 'success', message: `Welcome back, ${res.user.name || 'User'}!` });
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 500);
      } else {
        setAlert({ type: 'error', message: res.error || 'Invalid credentials' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Unable to connect. Try one-click demo login!' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setAlert({ type: 'error', message: 'Please fill in name, email, and password.' });
      return;
    }

    setLoading(true);
    setAlert(null);
    try {
      const res = await apiService.register(
        regName.trim(),
        regEmail.trim(),
        regPhone.trim(),
        regPassword.trim(),
        backendOnline
      );
      if (res.success) {
        setAlert({ type: 'success', message: `Account created! Welcome, ${res.user.name}!` });
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 500);
      } else {
        setAlert({ type: 'error', message: res.error || 'Registration failed' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Error creating account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card auth-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setAlert(null);
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('register');
                setAlert(null);
              }}
            >
              Create Account
            </button>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {alert && (
          <div className={`auth-alert ${alert.type}`} style={{ display: 'block' }}>
            {alert.message}
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="loginEmail">
                <i className="fa-solid fa-envelope"></i> Email Address
              </label>
              <input
                type="email"
                id="loginEmail"
                required
                placeholder="demo@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">
                <i className="fa-solid fa-lock"></i> Password
              </label>
              <input
                type="password"
                id="loginPassword"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <div
              className="auth-demo-hint"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <div>
                <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i> Instant Access: Enter <strong>any email ID</strong> & password!
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  border: '1px solid var(--primary)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                1-Click Sign In
              </button>
            </div>

            <button
              type="submit"
              className="submit-order-btn"
              disabled={loading}
              style={{ marginTop: '12px' }}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>{' '}
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                </>
              )}
            </button>
            <p className="auth-switch-text">
              Don't have an account?{' '}
              <a
                href="#register"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('register');
                  setAlert(null);
                }}
              >
                Sign up here
              </a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label htmlFor="regName">
                <i className="fa-solid fa-user"></i> Full Name
              </label>
              <input
                type="text"
                id="regName"
                required
                placeholder="e.g. Rahul Sharma"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="regEmail">
                <i className="fa-solid fa-envelope"></i> Email Address
              </label>
              <input
                type="email"
                id="regEmail"
                required
                placeholder="e.g. rahul@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="regPhone">
                <i className="fa-solid fa-phone"></i> Phone Number
              </label>
              <input
                type="tel"
                id="regPhone"
                placeholder="e.g. +91 9876543210"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="regPassword">
                <i className="fa-solid fa-lock"></i> Password
              </label>
              <input
                type="password"
                id="regPassword"
                required
                placeholder="At least 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="submit-order-btn"
              disabled={loading}
              style={{ marginTop: '12px' }}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Creating account...
                </>
              ) : (
                <>
                  <span>Create Account</span>{' '}
                  <i className="fa-solid fa-user-plus"></i>
                </>
              )}
            </button>
            <p className="auth-switch-text">
              Already have an account?{' '}
              <a
                href="#login"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('login');
                  setAlert(null);
                }}
              >
                Sign in here
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
