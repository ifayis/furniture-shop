import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "@/css/User-Side//checkout.css";

import { getCheckout } from "@/api/checkoutApi";
import { isAuthenticated } from "@/utils/tokenService";

function Checkout() {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.info("Login to continue.");
      navigate("/login");
      return;
    }

    const loadCheckout = async () => {
      try {
        const data = await getCheckout();

        const rawItems = Array.isArray(data?.items)
          ? data.items
          : [];

        const normalized = rawItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.imageurl,
          price: Number(item.price),
          quantity: Number(item.quantity),
        }));

        setItems(normalized);

        const ttl = normalized.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        setSubtotal(ttl);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load checkout");
      }
    };

    loadCheckout();
  }, [navigate]);

  const shipping = subtotal > 500 ? 100 : 0;
  const total = subtotal + shipping;

  const handlePayment = () => {
    if (items.length === 0) {
      toast.warning("No items available");
      navigate("/products");
      return;
    }
    navigate("/paymentpage");
  };

  return (
    <div className="checkout-container">
      {items.length === 0 ? (
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
          {/* LEFT */}
          <div className="checkout-left">
            <div className="checkout-progress">
              <span className="step done">Cart ✓</span>
              <span className="step active">Details</span>
              <span className="step">Payment</span>
            </div>

            <h2 className="checkout-title">Review Your Order</h2>

            <div className="checkout-items">
              {items.map((item) => (
                <div className="checkout-item" key={item.productId}>
                  <div className="ci-left">
                    <img
                      src={`/images/${item.image}`}
                      alt={item.name}
                      className="ci-img"
                    />
                    <div>
                      <h3 className="ci-name">{item.name}</h3>
                      <p className="ci-meta">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="ci-right">
                    <p className="ci-price">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="secure-note">
              <div className="secure-icon">🛡️</div>
              <p>
                Safe & Secure Payments. Fast Delivery. Authentic Products.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <aside className="checkout-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <div className="summary-actions">
              <button
                className="secondary-btn"
                onClick={() => navigate("/cart")}
              >
                ← Back to Cart
              </button>

              <button className="primary-btn" onClick={handlePayment}>
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
