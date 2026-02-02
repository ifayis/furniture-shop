import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "@/css/User-Side//cart.css";

import {
  getMyCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/api/cartApi";
import { isAuthenticated } from "@/utils/tokenService";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.info("Login to continue.");
      navigate("/login");
      return;
    }

    const loadCart = async () => {
      try {
        const data = await getMyCart();
        setCart(Array.isArray(data) ? data : data.items ?? []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cart");
      }
    };

    loadCart();
  }, [navigate]);

  useEffect(() => {
    const ttl = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(ttl);
  }, [cart]);

  const updateQty = async (productId, change) => {
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + change);

    try {
      await updateCartItem(productId, newQty);

      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId ? { ...i, quantity: newQty } : i
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeCartItem(productId);
      setCart((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      toast.info("Item removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (!cart.length) return;
    if (!window.confirm("Remove all items from your cart?")) return;

    try {
      await clearCart();
      setCart([]);
      toast.info("Cart cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear cart");
    }
  };

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const shipping = total > 500 ? 100 : 0;

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
          <button className="clear-cart-btn" onClick={handleClearCart}>
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

          <div className="cart-items-panel">
            {cart.map((item) => {
              const lineTotal = item.price * item.quantity;
              return (
                <div className="cart-item" key={item.productId}>
                  <div className="item-main">
                    <div className="item-image-container">
                      <img
                        className="item-image"
                        src={`/images/${item.image}`}
                        alt={item.name}
                      />
                    </div>

                    <div className="item-content">
                      <h3 className="item-name">{item.name}</h3>

                      <div className="item-controls-row">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() =>
                              updateQty(item.productId, -1)
                            }
                          >
                            -
                          </button>
                          <span className="quantity-value">
                            {item.quantity}
                          </span>
                          <button
                            className="quantity-btn"
                            onClick={() =>
                              updateQty(item.productId, 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-item"
                          onClick={() =>
                            removeItem(item.productId)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="item-pricing">
                    <p className="item-unit-price">
                      ₹{item.price.toLocaleString()}
                    </p>
                    <p className="item-line-total">
                      Line Total: ₹{lineTotal.toLocaleString()}
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
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{(total + shipping).toLocaleString()}</span>
            </div>

            <div className="summary-actions">
              <button
                className="primary-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
