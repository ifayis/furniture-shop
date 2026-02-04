import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "@/css/User-Side//orders.css";

import { getMyOrders, cancelOrder } from "@/api/orderApi";
import { isAuthenticated } from "@/utils/tokenService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.info("Login to continue.");
      navigate("/login");
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await getMyOrders();

        const normalized = (Array.isArray(data) ? data : []).map((o) => ({
          id: o.orderId,
          status: o.status,
          date: o.createdAt,
          total: o.totalAmount,
          discount: o.discount ?? 0,
          items: o.items.map((i) => ({
            id: i.productId,
            qty: i.quantity,
            price: i.price,
          })),
        }));

        setOrders(normalized);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      }
    };

    loadOrders();
  }, [navigate]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      setCancellingId(orderId);
      await cancelOrder(orderId);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );

      toast.success("Order cancelled");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

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
        </div>

        <div className="orders-divider" />

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h3>No orders found</h3>
            <button className="primary-btn" onClick={() => navigate("/")}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const canCancel = order.status === "Pending";

              return (
                <article className="order-card" key={order.id}>
                  <div className="order-top">
                    <div>
                      <span className="order-label">Order ID</span>
                      <div className="order-id">#{order.id}</div>
                    </div>

                    <div>
                      <span className="order-label">Date</span>
                      <div className="order-date">
                        {new Date(order.date).toLocaleDateString("en-IN")}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span className="order-label">Status</span>
                      <div className="order-status">{order.status}</div>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => (
                      <div className="order-item-row" key={item.id}>
                        <span>Qty: {item.qty}</span>
                        <span>
                          ₹{(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-bottom">
                    <div className="order-total">
                      <span>Order Total</span>
                      <span className="total-amount">
                        ₹{order.total.toLocaleString()}
                      </span>
                    </div>

                    <div className="card-actions">
                      {order.status !== "Paid" && order.status !== "Cancelled" && (
                        <button
                          className="primary-btn"
                          onClick={() => navigate("/trackorders")}
                        >
                          Track
                        </button>
                      )}

                      {canCancel && (
                        <button
                          className="secondary-btn"
                          disabled={cancellingId === order.id}
                          onClick={() => handleCancel(order.id)}
                        >
                          {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
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
