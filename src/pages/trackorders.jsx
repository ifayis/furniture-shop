import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/trackorders.css";

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

  const loadOrder = (orderId) => {
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) return null;
      const userObj = JSON.parse(userJson);
      setUser(userObj);
      const key = `orders-${userObj.email}`;
      const stored = JSON.parse(localStorage.getItem(key)) || [];
      const found = stored.find((o) => String(o.id) === String(orderId));
      if (found) return { found, sourceKey: key, all: stored };
      return { found: null, sourceKey: key, all: stored };
    } catch (err) {
      console.error("loadOrder error", err);
      return null;
    }
  };

  // When order not found create a minimal mock
  const mockOrder = (orderId) => {
    const now = new Date();
    const items = [
      { id: "mock-1", name: "Oak Minimal Shelf", image: "shelves.jpg", price: 56, qty: 1 },
      { id: "mock-2", name: "Classic Almirah", image: "almirah.jpg", price: 179, qty: 1 },
    ];
    return {
      id: orderId || Date.now(),
      date: now.toISOString(),
      status: "processing",
      items,
      total: items.reduce((s, i) => s + i.price * i.qty, 0),
      shipping: {
        name: "John Doe",
        phone: "+91 98765 43210",
        address: "12 Green Ave, Block B, New Town, City, 560001",
      },
      discount: 0,
      _mock: true,
    };
  };

  const buildTimeline = (ord) => {
    const base = ord?.date ? new Date(ord.date) : new Date();
    const currentIndex = Math.max(
      0,
      STATUS_STEPS.indexOf((ord.status || "pending").toLowerCase())
    );

    const entries = STATUS_STEPS.map((step, idx) => {
      const diff = idx - currentIndex;
      const hours = diff * 12;
      const ts = new Date(base.getTime() + hours * 60 * 60 * 1000);
      return {
        step,
        time: ts,
        done: idx <= currentIndex,
      };
    });
    return entries;
  };

  useEffect(() => {
    const res = loadOrder(id);
    if (res && res.found) {
      setOrder(res.found);
      setTimeline(buildTimeline(res.found));
    } else {
      const m = mockOrder(id || "000");
      setOrder(m);
      setTimeline(buildTimeline(m));
    }
  }, [id]);

  const persistOrder = (updated) => {
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) return;
      const userObj = JSON.parse(userJson);
      const key = `orders-${userObj.email}`;
      const all = JSON.parse(localStorage.getItem(key)) || [];
      const idx = all.findIndex((o) => String(o.id) === String(updated.id));
      if (idx >= 0) {
        all[idx] = updated;
        localStorage.setItem(key, JSON.stringify(all));
      }
    } catch (err) {
      console.error("persistOrder error", err);
    }
  };

  const handleCancel = () => {
    if (!order) return;
    const currentIdx = STATUS_STEPS.indexOf(order.status || "pending");
    if (order.status === "delivered") {
      toast.info("Delivered orders cannot be cancelled.");
      return;
    }
    // Confirm
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    const updated = { ...order, status: "cancelled", cancelledAt: new Date().toISOString() };
    setOrder(updated);
    setTimeline(buildTimeline({ ...updated, status: "cancelled" }));
    persistOrder(updated);
    toast.success("Order cancelled.");
  };

  const handleReorder = () => {
    if (!order) return;
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      toast.info("Login to reorder.");
      navigate("/login");
      return;
    }
    const userObj = JSON.parse(userJson);
    const cartKey = `cart-${userObj.email}`;
    const existing = JSON.parse(localStorage.getItem(cartKey)) || [];
    const toAdd = order.items.map((it) => ({ ...it }));
    const merged = [...existing, ...toAdd];
    localStorage.setItem(cartKey, JSON.stringify(merged));
    toast.success("Items added to cart for reorder.");
    navigate("/cart");
  };

  const handleContact = () => {
    const subject = encodeURIComponent(`Support request: Order #${order?.id || ""}`);
    const body = encodeURIComponent(
      `Hello support,\n\nI need help with order #${order?.id || ""}.\n\nOrder date: ${order?.date || "—"}\n\nPlease assist.\n`
    );
    window.location.href = `mailto:support@luxeliving.example?subject=${subject}&body=${body}`;
  };

  // format helpers
  const fmtDateTime = (d) =>
    d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

  const fmtMoney = (n) =>
    typeof n === "number" ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n;

  if (!order) return <div className="track-empty">Loading order...</div>;

  const currentIndexRaw = STATUS_STEPS.indexOf((order.status || "pending").toLowerCase());
  const currentIndex = currentIndexRaw >= 0 ? currentIndexRaw : 0;
  const statusLabel =
    order.status && order.status !== "cancelled"
      ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
      : order.status === "cancelled"
      ? "Cancelled"
      : "Pending";

  return (
    <div className="track-container">
      <div className="track-wrapper">
        <div className="track-topbar">
          <div>
            <h1 className="track-title">Order Tracking</h1>
            <p className="track-subtitle">Order #{order.id} · {fmtDateTime(order.date)}</p>
          </div>
          <div className="track-actions">
            <button className="outline-btn" onClick={() => navigate("/orders")}>← Back to orders</button>
            <button className="primary-btn" onClick={handleContact}>Contact Support</button>
          </div>
        </div>

        <div className="track-content">

          <section className="track-left">
            <div className="stepper">
              {STATUS_STEPS.map((stepName, idx) => {
                const done = idx <= currentIndex && order.status !== "cancelled";
                return (
                  <div key={stepName} className={`step ${done ? "done" : ""} ${idx === currentIndex ? "current" : ""}`}>
                    <div className="step-bullet">{done ? "✓" : idx + 1}</div>
                    <div className="step-info">
                      <div className="step-name">{stepName.toUpperCase()}</div>
                      <div className="step-time">
                        {(() => {
                          const t = timeline.find((t) => t.step === stepName);
                          return t ? fmtDateTime(t.time) : "—";
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
              {order.status === "cancelled" && (
                <div className="cancel-note">Order cancelled on {fmtDateTime(order.cancelledAt)}</div>
              )}
            </div>

            <div className="timeline-card">
              <h3>Timeline</h3>
              <ul>
                {(timeline || []).map((t) => (
                  <li key={t.step} className={t.done ? "tl-done" : ""}>
                    <div className="tl-left">{t.step.toUpperCase()}</div>
                    <div className="tl-right">{fmtDateTime(t.time)}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* RIGHT: Order summary */}
          <aside className="track-right">
            <div className="summary-card">
              <h3>Summary</h3>

              <div className="order-items-list">
                {order.items.map((it) => (
                  <div className="summary-item" key={it.id}>
                    <div className="si-left">
                      <div className="si-thumb">
                        <img src={`/images/${it.image}`} alt={it.name} onError={(e)=>{e.target.onerror=null; e.target.src='/images/product-placeholder.png'}}/>
                      </div>
                      <div className="si-meta">
                        <div className="si-name">{it.name}</div>
                        <div className="si-qty">Qty: {it.qty}</div>
                      </div>
                    </div>
                    <div className="si-price">₹ {fmtMoney(it.price * it.qty)}</div>
                  </div>
                ))}
              </div>

              <div className="summary-break" />

              <div className="summary-row"><span>Subtotal</span><span>₹ {fmtMoney(order.total - (order.discount || 0))}</span></div>
              <div className="summary-row"><span>Discount</span><span>- ₹ {fmtMoney(order.discount || 0)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>₹ {order.shipping?.fee ? fmtMoney(order.shipping.fee) : "19.00"}</span></div>

              <div className="summary-total"><span>Total</span><span>₹ {fmtMoney(order.total)}</span></div>

              <div className="shipping-card">
                <h4>Shipping</h4>
                {order.shipping ? (
                  <div className="ship-meta">
                    <div className="ship-name">{order.shipping.name}</div>
                    <div className="ship-phone">{order.shipping.phone}</div>
                    <div className="ship-address">{order.shipping.address}</div>
                  </div>
                ) : (
                  <div className="ship-missing">No shipping address on record.</div>
                )}
              </div>

              <div className="summary-actions">
                <button className="primary-btn" onClick={handleReorder}>Reorder</button>
                <button
                  className="secondary-btn"
                  onClick={() => {
                    if (order.status === "delivered") {
                      toast.info("Delivered orders cannot be cancelled.");
                      return;
                    }
                    handleCancel();
                  }}
                >
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
