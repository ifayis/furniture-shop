import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "@/css/User-Side//checkout.css";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.info("Login to continue.");
      navigate("/login");
      return;
    }
    setUser(user);
    const cartKey = `cart-${user.email}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(storedCart);
  }, [navigate]);

  const handlePayment = () => {
    if (cart.length === 0) {
      toast.warning("No items available");
      navigate("/products");
      return;
    }
    navigate("/paymentpage");
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const shipping = cart.length > 0 ? 19 : 0;
  const total = subtotal + shipping;

  return (
    <div className="checkout-container">
      {cart.length === 0 ? (
        <div className="empty-cart-box">
          <img
            src="/images/empty-cart.svg"
            alt="Empty cart"
            className="empty-img"
          />
          <h2>Your cart is empty</h2>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="checkout-layout">
          {/* LEFT SIDE – Items + Progress */}
          <div className="checkout-left">
            <div className="checkout-progress">
              <span className="step done">Cart ✓</span>
              <span className="step active">Details</span>
              <span className="step">Payment</span>
            </div>

            <h2 className="checkout-title">Review Your Order</h2>

            <div className="checkout-items">
              {cart.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <div className="ci-left">
                    <img
                      src={`/images/${item.image}`}
                      alt={item.name}
                      className="ci-img"
                    />
                    <div>
                      <h3 className="ci-name">{item.name}</h3>
                      <p className="ci-meta">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <div className="ci-right">
                    <p className="ci-price">
                      ${(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="secure-note">
              <div className="secure-icon">🛡️</div>
              <p>Safe & Secure Payments. Fast Delivery. Authentic Products.</p>
            </div>
          </div>

          {/* RIGHT SIDE – Order Summary */}
          <aside className="checkout-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">${shipping.toLocaleString()}</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>

            <div className="summary-actions">
              <button
                className="secondary-btn"
                onClick={() => navigate("/cart")}
              >
                ← Back to Cart
              </button>

              <button
                className="primary-btn"
                onClick={handlePayment}
              >
                Proceed to Payment →
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Checkout;
