import React from 'react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onProceedToCheckout
}) {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal > 30 ? 0.0 : 2.99;
  const tax = subtotal * 0.05;
  const total = subtotal + delivery + tax;

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />
      <aside className={`cart-drawer ${isOpen ? 'active' : ''}`} id="cartDrawer">
        <div className="cart-header">
          <div className="cart-title">
            <i className="fa-solid fa-bag-shopping"></i>
            <h3>Your Cart ({totalCount})</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <i className="fa-solid fa-basket-shopping empty-icon"></i>
              <p>Your cart is empty</p>
              <span>Add delicious items from the menu to start ordering</span>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <span>${item.price.toFixed(2)} each</span>
                </div>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQty(item.id, -1)}
                  >
                    −
                  </button>
                  <span className="qty-val">{item.qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: 'var(--secondary)',
                    fontSize: '14px'
                  }}
                >
                  ${(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="bill-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="bill-row">
              <span>Delivery Fee</span>
              <span>{delivery === 0 ? 'FREE' : `$${delivery.toFixed(2)}`}</span>
            </div>
            <div className="bill-row">
              <span>Taxes & Fees (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="bill-divider"></div>
            <div className="bill-row total-row">
              <strong>To Pay</strong>
              <strong className="total-amount">${total.toFixed(2)}</strong>
            </div>
            <button className="checkout-btn" onClick={onProceedToCheckout}>
              <span>Proceed to Checkout</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
