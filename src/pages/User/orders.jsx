import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "@/css/User-Side//orders.css";

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

  const isUpcoming = (o) => {
    if (!o) return false;
    if (typeof o.status === "string" && o.status.toLowerCase() === "upcoming")
      return true;
    if (o.date) {
      const orderDate = new Date(o.date);
      return orderDate > new Date();
    }
    return false;
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const aUpcoming = isUpcoming(a) ? 1 : 0;
    const bUpcoming = isUpcoming(b) ? 1 : 0;
    if (aUpcoming !== bUpcoming) return bUpcoming - aUpcoming;

    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;
    return bTime - aTime;
  });


  return (
    <div className="orders-container">
      <div className="orders-wrapper">
        <div className="orders-topbar">
          <div className="orders-top-left">
            <h1 className="orders-title">Your Orders</h1>
            <p className="orders-subtitle">
              {totalOrders} order{totalOrders !== 1 ? "s" : ""} • $
              {totalSpent.toLocaleString()} spent
            </p>
          </div>

          <div className="orders-top-actions">
            <button
              className="outline-btn"
              onClick={() => navigate("/")}
              aria-label="Continue shopping"
            >
              Continue Shopping
            </button>

            <div className="orders-count-badge" title="Total orders">
              {totalOrders}
            </div>
          </div>
        </div>

        <div className="orders-divider" />

        {sortedOrders.length === 0 ? (
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
            {sortedOrders.map((order) => {
              const upcomingFlag = isUpcoming(order);
              return (
                <article
                  className={`order-card ${upcomingFlag ? "order-upcoming" : ""}`}
                  key={order.id}
                >
                  <div className="order-top">
                    <div>
                      <span className="order-label">Order ID</span>
                      <div className="order-id">#{order.id}</div>
                    </div>

                    <div>
                      <span className="order-label">Date</span>
                      <div className="order-date">
                        {order.date
                          ? new Date(order.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                          : "—"}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span className="order-label">Status</span>
                      <div className="order-status">
                        {order.status
                          ? order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)
                          : upcomingFlag
                            ? "Upcoming"
                            : "Completed"}
                      </div>
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
                          <div className="order-item-meta">
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
                        ${((order.total || 0)).toLocaleString()}
                      </span>
                    </div>

                    {order.discount > 0 && (
                      <div className="order-discount">
                        <span>Discount</span>
                        <span className="discount-amount">
                          - ${order.discount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="card-actions">
                      <button
                        className="primary-btn"
                        onClick={() => {
                          toast.success(`Tracking order #${order.id}`);
                          navigate('/trackorders');
                        }}
                      >
                        Track
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
