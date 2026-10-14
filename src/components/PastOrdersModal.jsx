import React from 'react';

export default function PastOrdersModal({ isOpen, onClose, orders, loading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>
            <i className="fa-solid fa-clock-rotate-left"></i> Recent Orders
          </h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="orders-list-body">
          {loading ? (
            <div className="loading-spinner">
              <i className="fa-solid fa-spinner fa-spin"></i> Fetching orders...
            </div>
          ) : orders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '30px',
                color: 'var(--text-muted)'
              }}
            >
              <i
                className="fa-solid fa-receipt"
                style={{ fontSize: '32px', marginBottom: '10px', color: '#cbd5e1' }}
              ></i>
              <p>No orders found yet.</p>
              <small>
                Orders you place will appear here immediately!
              </small>
            </div>
          ) : (
            orders.map((o) => (
              <div className="order-history-card" key={o.id}>
                <div className="order-history-header">
                  <strong>Order #{o.id}</strong>
                  <span className="order-status-badge">{o.status || 'CONFIRMED'}</span>
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--secondary)',
                    marginBottom: '4px'
                  }}
                >
                  <strong>Items:</strong> {o.itemsSummary || 'Food items'}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginBottom: '6px'
                  }}
                >
                  <strong>Delivery to:</strong> {o.deliveryAddress || 'Address'}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--primary)'
                    }}
                  >
                    Total: ${parseFloat(o.totalAmount || 0).toFixed(2)}
                  </span>
                  {o.createdAt && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {o.createdAt}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
