import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      toast.info("Login to continue.");
      navigate("/login");
      return;
    }

    setUser(userData);

    const userOrders =
      JSON.parse(localStorage.getItem(`orders-${userData.email}`)) || [];
    setOrders(userOrders);
  }, [navigate]);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div>
          <h1 className="orders-title">Your Orders</h1>
          <p className="orders-subtitle">
            {totalOrders} order{totalOrders !== 1 ? "s" : ""} • $
            {totalSpent.toLocaleString()} spent
          </p>
        </div>
        {orders.length > 0 && (
          <button className="secondary-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        )}
      </div>

      <div className="orders-divider" />

      {orders.length === 0 ? (
        <div className="empty-orders">
          <img
            src="/images/empty-orders.svg"
            alt="No orders"
            className="empty-orders-img"
          />
          <h3>No orders found</h3>
          <p>You haven&apos;t placed any orders yet.</p>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-top">
                <div className="order-id-block">
                  <span className="order-label">Order ID</span>
                  <span className="order-id">#{order.id}</span>
                </div>
                <div className="order-date-block">
                  <span className="order-label">Date</span>
                  <span className="order-date">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="order-status-block">
                  <span className="order-label">Status</span>
                  <span className="order-status">Completed</span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-item-row" key={item.id}>
                    <div className="order-item-left">
                      <div className="order-item-thumb">
                        <img
                          src={`/images/${item.image}`}
                          alt={item.name}
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-qty">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <div className="order-item-price">
                      ${(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-bottom">
                <div className="order-total">
                  <span>Order Total</span>
                  <span className="total-amount">
                    ${order.total.toLocaleString()}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="order-discount">
                    <span>Discount Applied</span>
                    <span className="discount-amount">
                      - ${order.discount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
