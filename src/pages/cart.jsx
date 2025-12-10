import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.info("Login to continue.");
      navigate("/login");
      return;
    }
    const userCart =
      JSON.parse(localStorage.getItem(`cart-${user.email}`)) || [];
    setCart(userCart);
  }, [navigate]);

  useEffect(() => {
    const ttl = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    setTotal(ttl);
  }, [cart]);

  const updateQty = (id, change) => {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, qty: Math.max(1, item.qty + change) }
        : item
    );
    setCart(updated);
    const user = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem(`cart-${user.email}`, JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const filtered = cart.filter((item) => item.id !== id);
    setCart(filtered);
    const user = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem(`cart-${user.email}`, JSON.stringify(filtered));
  };

  const clearCart = () => {
    if (!cart.length) return;
    if (!window.confirm("Remove all items from your cart?")) return;

    setCart([]);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem(`cart-${user.email}`, JSON.stringify([]));
    }
    toast.info("Cart cleared.");
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const shipping = total > 0 ? 19 : 0;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <div>
          <h2 className="cart-title">Your Cart</h2>
          <p className="cart-subtitle">
            {totalItems} item{totalItems !== 1 ? "s" : ""} • $
            {total.toLocaleString()}
          </p>
        </div>

        {cart.length > 0 && (
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        )}
      </div>

      <div className="cart-divider" />

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <p className="empty-cart-note">
            Add some beautiful furniture to transform your space.
          </p>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Left: items panel */}
          <div className="cart-items-panel">
            {cart.map((item) => {
              const lineTotal = item.price * item.qty;
              return (
                <div className="cart-item" key={item.id}>
                  <div className="item-main">
                    <div className="item-image-container">
                      <img
                        className="item-image"
                        src={`/images/${item.image}`}
                        alt={item.name}
                        loading="lazy"
                      />
                    </div>

                    <div className="item-content">
                      <h3 className="item-name">{item.name}</h3>
                      {item.category && (
                        <p className="item-meta">
                          Category:{" "}
                          <span className="item-meta-highlight">
                            {item.category}
                          </span>
                        </p>
                      )}

                      <div className="item-controls-row">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => updateQty(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="quantity-value">{item.qty}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => updateQty(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-item"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="item-pricing">
                    <p className="item-price-label">Price</p>
                    <p className="item-unit-price">
                      ${item.price.toLocaleString()}
                    </p>
                    <p className="item-line-total">
                      Line Total: ${lineTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
              <span>Items ({totalItems})</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="shipping-free">$19</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${(total + shipping).toLocaleString()}</span>
            </div>

            <p className="summary-note">
              Secure checkout • No extra charges at delivery.
            </p>

            <div className="summary-actions">
              <button
                className="primary-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
