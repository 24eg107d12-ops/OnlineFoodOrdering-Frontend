import React, { useState, useEffect } from 'react';

export default function CheckoutModal({
  isOpen,
  onClose,
  currentUser,
  totalAmount,
  onSubmitOrder
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.email) setEmail(currentUser.email);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !address.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitOrder({
        customerName: name.trim(),
        customerEmail: email.trim(),
        deliveryAddress: address.trim(),
        paymentMethod: payment
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="fa-solid fa-truck-fast"></i> Complete Your Delivery
          </h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="custName">
              <i className="fa-solid fa-user"></i> Full Name
            </label>
            <input
              type="text"
              id="custName"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="custEmail">
              <i className="fa-solid fa-envelope"></i> Email Address
            </label>
            <input
              type="email"
              id="custEmail"
              required
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="custAddress">
              <i className="fa-solid fa-location-dot"></i> Delivery Address
            </label>
            <textarea
              id="custAddress"
              required
              rows="3"
              placeholder="Enter flat/house no., street name, landmark..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label>
              <i className="fa-solid fa-credit-card"></i> Payment Method
            </label>
            <div className="payment-options">
              <label className="pay-option">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={payment === 'COD'}
                  onChange={() => setPayment('COD')}
                />
                <span>💵 Cash on Delivery</span>
              </label>
              <label className="pay-option">
                <input
                  type="radio"
                  name="payment"
                  value="CARD"
                  checked={payment === 'CARD'}
                  onChange={() => setPayment('CARD')}
                />
                <span>💳 Card / UPI</span>
              </label>
            </div>
          </div>

          <div className="modal-bill-summary">
            <span>Order Amount:</span>
            <strong>${totalAmount.toFixed(2)}</strong>
          </div>

          <button
            type="submit"
            className="submit-order-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Placing Order...
              </>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <i className="fa-solid fa-check"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
