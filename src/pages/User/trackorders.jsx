import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../css/User-Side/trackorders.css";

function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [user, setUser] = useState(null);

  const STATUS_STEPS = [
    "pending",
    "processing",
    "shipped",
    "out for delivery",
    "delivered",
  ];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      toast.warning("Login to continue.");
      navigate("/login");
      return;
    }
    setUser(userData);

    fetch(`https://furniture-shop-asjh.onrender.com/Orders/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Order not found");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setTimeline(buildTimeline(data));
      })
      .catch(() => {
        toast.error("Order not found on server");
        navigate("/orders");
      });
  }, [id]);

  const buildTimeline = (ord) => {
    const base = ord?.date ? new Date(ord.date) : new Date();
    const currentIndex = STATUS_STEPS.indexOf(
      (ord.status || "pending").toLowerCase()
    );

    return STATUS_STEPS.map((step, idx) => {
      const ts = new Date(base.getTime() + (idx - currentIndex) * 12 * 3600 * 1000);
      return { step, time: ts, done: idx <= currentIndex };
    });
  };

  const handleCancel = async () => {
    if (!order) return;

    if (order.status === "delivered") {
      toast.info("Delivered orders cannot be cancelled.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    const updated = {
      ...order,
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
    };

    try {
      await fetch(
        `https://furniture-shop-asjh.onrender.com/Orders/${order.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );

      setOrder(updated);
      setTimeline(buildTimeline(updated));
      toast.success("Order cancelled.");
    } catch (err) {
      toast.error("Failed to update the order.");
    }
  };

  const handleReorder = () => {
    if (!order) return;

    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      toast.info("Login to reorder.");
      navigate("/login");
      return;
    }

    const cartKey = `cart-${userData.email}`;
    const existing = JSON.parse(localStorage.getItem(cartKey)) || [];

    const newCart = [...existing, ...order.items];
    localStorage.setItem(cartKey, JSON.stringify(newCart));

    toast.success("Items added to cart.");
    navigate("/cart");
  };

  const fmtDateTime = (d) =>
    new Date(d).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const fmtMoney = (n) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (!order) return <div className="track-empty">Loading order...</div>;

  const currentIndex = STATUS_STEPS.indexOf(
    (order.status || "pending").toLowerCase()
  );

  return (
    <div className="track-container">
      <div className="track-wrapper">
        <div className="track-topbar">
          <div>
            <h1 className="track-title">Order Tracking</h1>
            <p className="track-subtitle">
              Order #{order.id} · {fmtDateTime(order.date)}
            </p>
          </div>
          <div className="track-actions">
            <button className="outline-btn" onClick={() => navigate("/orders")}>
              ← Back to orders
            </button>
            <button className="primary-btn" onClick={() => handleContact(order)}>
              Contact Support
            </button>
          </div>
        </div>

        <div className="track-content">
          {/* LEFT PANEL */}
          <section className="track-left">
            <div className="stepper">
              {STATUS_STEPS.map((stepName, idx) => (
                <div
                  key={stepName}
                  className={`step ${
                    idx <= currentIndex ? "done" : ""
                  } ${idx === currentIndex ? "current" : ""}`}
                >
                  <div className="step-bullet">
                    {idx <= currentIndex ? "✓" : idx + 1}
                  </div>
                  <div className="step-info">
                    <div className="step-name">{stepName.toUpperCase()}</div>
                    <div className="step-time">
                      {fmtDateTime(timeline[idx].time)}
                    </div>
                  </div>
                </div>
              ))}

              {order.status === "cancelled" && (
                <div className="cancel-note">
                  Order cancelled on {fmtDateTime(order.cancelledAt)}
                </div>
              )}
            </div>

            <div className="timeline-card">
              <h3>Timeline</h3>
              <ul>
                {timeline.map((t) => (
                  <li key={t.step} className={t.done ? "tl-done" : ""}>
                    <div className="tl-left">{t.step.toUpperCase()}</div>
                    <div className="tl-right">{fmtDateTime(t.time)}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="track-right">
            <div className="summary-card">
              <h3>Summary</h3>

              <div className="order-items-list">
                {order.items.map((it) => (
                  <div className="summary-item" key={it.id}>
                    <div className="si-left">
                      <div className="si-thumb">
                        <img
                          src={`/images/${it.image}`}
                          alt={it.name}
                          onError={(e) => {
                            e.target.src = "/images/product-placeholder.png";
                          }}
                        />
                      </div>
                      <div className="si-meta">
                        <div className="si-name">{it.name}</div>
                        <div className="si-qty">Qty: {it.qty}</div>
                      </div>
                    </div>
                    <div className="si-price">
                      ₹ {fmtMoney(it.price * it.qty)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-break" />

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹ {fmtMoney(order.total - (order.discount || 0))}</span>
              </div>

              <div className="summary-row">
                <span>Discount</span>
                <span>- ₹ {fmtMoney(order.discount || 0)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>₹ 19.00</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>₹ {fmtMoney(order.total)}</span>
              </div>

              <div className="shipping-card">
                <h4>Shipping</h4>
                {order.shipping ? (
                  <div className="ship-meta">
                    <div className="ship-name">{order.shipping.fullName}</div>
                    <div className="ship-phone">{order.shipping.phone}</div>
                    <div className="ship-address">
                      {order.shipping.line1}, {order.shipping.city} -{" "}
                      {order.shipping.pin}
                    </div>
                  </div>
                ) : (
                  <div className="ship-missing">
                    No shipping address available.
                  </div>
                )}
              </div>

              <div className="summary-actions">
                <button className="primary-btn" onClick={handleReorder}>
                  Reorder
                </button>
                <button className="secondary-btn" onClick={handleCancel}>
                  Cancel Order
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;
