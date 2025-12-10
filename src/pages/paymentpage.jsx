import React, { useEffect, useState } from "react";
import "../css/paymentpage.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

    const addressKey = `address-${userData.email}`;
    const savedAddress = JSON.parse(localStorage.getItem(addressKey));
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const addressKey = `address-${user.email}`;
    localStorage.setItem(addressKey, JSON.stringify(address));
  }, [user, address]);

  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 29 : 0;
  const totalBeforeDiscount = subtotal + shipping;
  const finalTotal = Math.max(totalBeforeDiscount - discount, 0);

  const discountDisplay =
    discount > 0 ? `- $${discount.toLocaleString()}` : "$0";

  // Handle applying coupon
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

  // Handle order placement
  const handlePlaceOrder = () => {
    if (!user || cart.length === 0) {
      toast.warning("No items in cart");
      navigate("/");
      return;
    }
    const isAddressValid =
      address.fullName &&
      address.phone &&
      address.line1 &&
      address.city &&
      address.pin;

    if (!isAddressValid) {
      toast.warning("Please fill in all required address fields.");
      return;
    }

    const cartKey = `cart-${user.email}`;
    const orderKey = `orders-${user.email}`;
    const previousOrders = JSON.parse(localStorage.getItem(orderKey)) || [];

    const newOrder = {
      id: Date.now(),
      items: cart,
      total: finalTotal,
      discount,
      date: new Date().toLocaleString(),
    };

    localStorage.setItem(orderKey, JSON.stringify([...previousOrders, newOrder]));
    localStorage.removeItem(cartKey);
    toast.success("Payment successful! Order placed.");
    navigate("/orders");
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  if (cart.length === 0) {
    return (
      <div className="payment-container">
        <div className="empty-payment-box">
          <h2>No items to pay for</h2>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-layout">
        {/* LEFT SIDE – Address + Payment + Coupon */}
        <div className="payment-left">
          <div className="payment-progress">
            <span className="step done">Cart ✓</span>
            <span className="step done">Details ✓</span>
            <span className="step active">Payment</span>
          </div>

          <h2 className="payment-title">Payment & Shipping Details</h2>

          <div className="payment-card">
            <h3 className="card-title">Shipping Address</h3>
            <div className="address-grid">
              <input
                type="text"
                placeholder="Full Name"
                name="fullName"
                value={address.fullName}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                placeholder="Phone Number"
                name="phone"
                value={address.phone}
                onChange={handleAddressChange}
              />
            </div>

            <input
              type="text"
              placeholder="Address Line 1"
              name="line1"
              value={address.line1}
              onChange={handleAddressChange}
            />
            <input
              type="text"
              placeholder="Address Line 2"
              name="line2"
              value={address.line2}
              onChange={handleAddressChange}
            />

            <div className="address-grid">
              <input
                type="text"
                placeholder="City"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                placeholder="PIN Code"
                name="pin"
                value={address.pin}
                onChange={handleAddressChange}
              />
            </div>
          </div>

          {/* Payment Method + Coupon */}
          <div className="payment-card">
            <h3 className="card-title">Payment Method</h3>
            <div className="payment-options">
              <label>
                <input type="radio" name="payment" defaultChecked />
                Credit / Debit Card
              </label>
              <label>
                <input type="radio" name="payment" />
                UPI / GPay
              </label>
              <label>
                <input type="radio" name="payment" />
                Cash on Delivery
              </label>
            </div>

            {/* Coupon Section */}
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
                  className="coupon-input"
                  disabled={couponApplied}
                />
                <button
                  type="button"
                  className="coupon-button"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                >
                  {couponApplied ? "Applied" : "Apply Code"}
                </button>
              </div>
              <p className="coupon-hint">
                Code must be 7 letters/numbers. One use per order.
              </p>
            </div>

            {/* Secure note */}
            <div className="secure-note">
              <div className="secure-icon">🛡️</div>
              <p>256-bit secure payments. We never store your card details.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – Summary */}
        <aside className="payment-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>${shipping}</span>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <span>{discountDisplay}</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-row total">
            <span>Total</span>
            <span>${finalTotal.toLocaleString()}</span>
          </div>

          <div className="summary-actions">
            <button
              className="secondary-btn"
              onClick={() => navigate("/checkout")}
            >
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
