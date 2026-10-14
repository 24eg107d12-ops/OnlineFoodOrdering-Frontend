import React from 'react';

export default function OrderSuccessModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card success-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-animation">
          <i className="fa-solid fa-circle-check"></i>
        </div>
        <h2>Order Placed Successfully!</h2>
        <p className="order-id-label">
          Order #<span>{order.id}</span>
        </p>

        <div className="tracker-stepper">
          <div className="step active">
            <div className="step-circle">
              <i className="fa-solid fa-check"></i>
            </div>
            <span>Confirmed</span>
          </div>
          <div className="step-line active"></div>
          <div className="step active">
            <div className="step-circle">
              <i className="fa-solid fa-fire"></i>
            </div>
            <span>Cooking</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-circle">
              <i className="fa-solid fa-motorcycle"></i>
            </div>
            <span>On the Way</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <div className="step-circle">
              <i className="fa-solid fa-house"></i>
            </div>
            <span>Delivered</span>
          </div>
        </div>

        <div className="order-details-box">
          <div className="detail-row">
            <span>Customer:</span>
            <strong>{order.customerName}</strong>
          </div>
          <div className="detail-row">
            <span>Delivery Address:</span>
            <strong>{order.deliveryAddress}</strong>
          </div>
          <div className="detail-row">
            <span>Items:</span>
            <span>{order.itemsSummary}</span>
          </div>
          <div className="detail-row">
            <span>Total Paid:</span>
            <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>
              ${parseFloat(order.totalAmount || 0).toFixed(2)}
            </strong>
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '15px' }}
          onClick={onClose}
        >
          Back to Food Menu
        </button>
      </div>
    </div>
  );
}
