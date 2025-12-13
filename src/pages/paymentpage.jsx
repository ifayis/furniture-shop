import React, { useEffect, useState } from "react";
import "../css/paymentpage.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = "https://furniture-shop-asjh.onrender.com";

function maskCard(cardNumber = "") {
  const digits = cardNumber.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return last4 ? `**** **** **** ${last4}` : null;
}

function PaymentPage() {
  const [user, setUser] = useState(null);

  const [cart, setCart] = useState([]);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    pin: "",
  });

  // hold server address record id if exists
  const [addressRecord, setAddressRecord] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      toast.info("Please login to continue.");
      navigate("/login");
      return;
    }
    setUser(userData);

    const cartKey = `cart-${userData.email}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(storedCart);

    (async () => {
      try {
        const q = encodeURIComponent(userData.email);
        const res = await fetch(`${API_BASE}/Addresses?userEmail=${q}`);
        if (!res.ok) throw new Error("Failed to fetch addresses");
        const arr = await res.json();
        if (Array.isArray(arr) && arr.length > 0) {
          const addr = arr[0];
          setAddressRecord(addr.id || addr._id || null);
          setAddress({
            fullName: addr.fullName || "",
            phone: addr.phone || "",
            line1: addr.line1 || "",
            line2: addr.line2 || "",
            city: addr.city || "",
            pin: addr.pin || "",
          });
          if (addr.paymentMeta) {
            if (addr.paymentMeta.method === "upi" && addr.paymentMeta.upiId) {
              setUpiId(addr.paymentMeta.upiId);
              setPaymentMethod("upi");
            } else if (addr.paymentMeta.method === "card" && addr.paymentMeta.cardMasked) {
              setPaymentMethod("card");
            }
          }
        }
      } catch (err) {
        console.warn("Could not load saved address:", err.message || err);
      }
    })();
  }, [navigate]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 29 : 0;
  const totalBeforeDiscount = subtotal + shipping;
  const finalTotal = Math.max(totalBeforeDiscount - discount, 0);

  // coupon
  const handleApplyCoupon = () => {
    if (!totalBeforeDiscount) {
      toast.warning("Add items to cart before applying a coupon.");
      return;
    }
    if (couponApplied) {
      toast.info("Coupon already applied.");
      return;
    }
    const code = coupon.trim().toUpperCase();
    const isValid = code.length === 7 && /^[A-Z0-9]+$/.test(code);
    if (!isValid) {
      toast.warning("Wrong coupon code.");
      return;
    }
    setCoupon(code);
    setDiscount(10);
    setCouponApplied(true);
    toast.success("Coupon applied! $10 discount added.");
  };

  async function saveOrUpdateAddressOnServer(onlyAddress = true) {
    if (!user) throw new Error("No user");
    const payload = {
      userEmail: user.email,
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      pin: address.pin,
    };

    try {
      const q = encodeURIComponent(user.email);
      const listRes = await fetch(`${API_BASE}/Addresses?userEmail=${q}`);
      if (!listRes.ok) throw new Error("Failed to query Addresses");
      const list = await listRes.json();
      if (Array.isArray(list) && list.length > 0) {
        const rec = list[0];
        const id = rec.id || rec._id || rec.id === 0 ? rec.id : undefined;
        const patchBody = { ...payload };

        const res = await fetch(`${API_BASE}/Addresses/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patchBody),
        });
        if (!res.ok) throw new Error("Failed to update address");
        const updated = await res.json();
        setAddressRecord(updated.id || updated._id || null);
        return updated;
      } else {
        // create new address
        const res = await fetch(`${API_BASE}/Addresses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create address");
        const created = await res.json();
        setAddressRecord(created.id || created._id || null);
        return created;
      }
    } catch (err) {
      console.error("Address save/update error:", err);
      throw err;
    }
  }

  async function savePaymentMetaToAddress(addressRec, method, card, upi) {
    if (!addressRec || !addressRec.id && !addressRec._id && !addressRecord) {
      if (!addressRecord) return null;
    }
    const id = addressRec?.id || addressRec?._id || addressRecord;
    if (!id) return null;

    const paymentMeta = { method: method };

    if (method === "card" && card && card.cardNumber) {
      paymentMeta.cardMasked = maskCard(card.cardNumber);
      paymentMeta.cardName = card.cardName || "";
      paymentMeta.lastExpiry = card.expiry || "";
      // DO NOT store CVV or full PAN
    } else if (method === "upi" && upi) {
      paymentMeta.upiId = upi;
    }

    try {
      const res = await fetch(`${API_BASE}/Addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMeta }),
      });
      if (!res.ok) throw new Error("Failed to save payment meta");
      const updated = await res.json();
      return updated;
    } catch (err) {
      console.warn("Could not save payment meta to address:", err);
      return null;
    }
  }

  const handlePlaceOrder = async () => {
    if (!user || cart.length === 0) {
      toast.warning("No items in cart");
      navigate("/");
      return;
    }

    const requiredFields = [
      address.fullName,
      address.phone,
      address.line1,
      address.city,
      address.pin,
    ];
    if (requiredFields.some((f) => !f || !String(f).trim())) {
      toast.warning("Please fill in all required address fields.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardInfo.cardNumber || !cardInfo.cardName || !cardInfo.expiry || !cardInfo.cvv) {
        toast.warning("Please enter all credit card details.");
        return;
      }
    }
    if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        toast.warning("Please enter your UPI ID.");
        return;
      }
    }

    try {
      // 1) Save or update address on server (creates address record if missing)
      const savedAddress = await saveOrUpdateAddressOnServer();

      // 2) Create order payload and POST to Orders endpoint
      const orderPayload = {
        userEmail: user.email,
        items: cart,
        total: finalTotal,
        discount,
        shipping: {
          // store shipping inline (copy of address) and/or reference addressId
          addressId: savedAddress.id || savedAddress._id || addressRecord,
          ...{
            fullName: savedAddress.fullName,
            phone: savedAddress.phone,
            line1: savedAddress.line1,
            line2: savedAddress.line2,
            city: savedAddress.city,
            pin: savedAddress.pin,
          },
        },
        paymentMethod,
        paymentMeta:
          paymentMethod === "card"
            ? { cardMasked: maskCard(cardInfo.cardNumber), cardName: cardInfo.cardName }
            : paymentMethod === "upi"
            ? { upiId }
            : null,
        status: "pending",
        date: new Date().toISOString(),
      };

      const orderRes = await fetch(`${API_BASE}/Orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create order on server");
      }
      const savedOrder = await orderRes.json();

      // 3) Save payment meta into address record for future updates (masked only)
      if (paymentMethod === "card" || paymentMethod === "upi") {
        await savePaymentMetaToAddress(savedAddress, paymentMethod, cardInfo, upiId);
      }

      // 4) Clean up local cart and navigate to orders/track page using server id (if available)
      localStorage.removeItem(`cart-${user.email}`);
      toast.success("Payment successful! Order placed.");

      // Prefer direct track route if server returns id
      const serverOrderId = savedOrder.id || savedOrder._id || savedOrder.orderId || savedOrder;
      if (serverOrderId) {
        navigate(`/track-order/${serverOrderId}`);
      } else {
        navigate("/orders");
      }
    } catch (err) {
      console.error("Order flow error:", err);
      toast.error("Failed to place order. Try again.");
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-layout">
        {/* LEFT */}
        <div className="payment-left">
          <div className="payment-progress">
            <span className="step done">Cart ✓</span>
            <span className="step done">Details ✓</span>
            <span className="step active">Payment</span>
          </div>

          <div className="payment-card">
            <h3 className="card-title">Shipping Address</h3>
            <div className="address-grid">
              <input
                type="text"
                placeholder="Full Name"
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="Address Line 1"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={address.line2}
              onChange={(e) => setAddress({ ...address, line2: e.target.value })}
            />
            <div className="address-grid">
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="PIN Code"
                value={address.pin}
                onChange={(e) => setAddress({ ...address, pin: e.target.value })}
              />
            </div>
          </div>

          <div className="payment-card">
            <h3 className="card-title">Payment Method</h3>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Credit / Debit Card
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                />
                UPI (GPay / PhonePe)
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>
            </div>

            {paymentMethod === "card" && (
              <div className="card-inputs">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardInfo.cardNumber}
                  maxLength={19}
                  onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Name on Card"
                  value={cardInfo.cardName}
                  onChange={(e) => setCardInfo({ ...cardInfo, cardName: e.target.value })}
                />
                <div className="address-grid">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardInfo.expiry}
                    onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength={4}
                    value={cardInfo.cvv}
                    onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                  />
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <input
                type="text"
                placeholder="Enter UPI ID (example@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            )}

            <div className="coupon-section">
              <label htmlFor="coupon">Discount Coupon</label>
              <div className="coupon-input-row">
                <input
                  id="coupon"
                  type="text"
                  maxLength={7}
                  placeholder="ENTER CODE"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  disabled={couponApplied}
                />
                <button className="coupon-button" onClick={handleApplyCoupon} disabled={couponApplied}>
                  {couponApplied ? "Applied" : "Apply Code"}
                </button>
              </div>
            </div>

            <div className="secure-note">
              <div className="secure-icon">🛡️</div>
              <p>256-bit secure payments. We never store your card details.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <aside className="payment-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
          <div className="summary-row"><span>Discount</span><span>- ${discount.toFixed(2)}</span></div>

          <div className="summary-divider" />
          <div className="summary-row total">
            <span>Total</span><span>${finalTotal.toFixed(2)}</span>
          </div>

          <div className="summary-actions">
            <button className="secondary-btn" onClick={() => navigate("/checkout")}>
              ← Back to Checkout
            </button>
            <button className="primary-btn" onClick={handlePlaceOrder}>
              Place Order & Pay
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PaymentPage;
