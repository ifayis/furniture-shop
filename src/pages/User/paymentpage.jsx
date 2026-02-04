import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "@/css/User-Side/paymentpage.css";

import { makePayment } from "@/api/paymentApi";
import { getMyCart } from "@/api/cartApi";
import {
  getMyShippingAddresses,
  createShippingAddress,
  updateShippingAddress,
} from "@/api/shippingAddressApi";
import { isAuthenticated } from "@/utils/tokenService";

function maskCard(cardNumber = "") {
  const digits = cardNumber.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return last4 ? `**** **** **** ${last4}` : null;
}

function PaymentPage() {
  const [cart, setCart] = useState([]);
  const [addressRecord, setAddressRecord] = useState(null);

  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pinCode: "",
  });

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
    if (!isAuthenticated()) {
      toast.info("Please login to continue.");
      navigate("/login");
      return;
    }

    const loadCart = async () => {
      try {
        const data = await getMyCart();

        const items = Array.isArray(data?.items) ? data.items : [];

        const normalized = items.map(i => ({
          productId: i.productId,
          name: i.name,
          price: Number(i.price),
          image: i.imageurl,
          qty: Number(i.quantity)
        }));

        setCart(normalized);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cart");
      }
    };

    loadCart();

    const loadAddress = async () => {
      try {
        const addresses = await getMyShippingAddresses();
        if (Array.isArray(addresses) && addresses.length > 0) {
          const addr = addresses[0];
          setAddressRecord(addr.id);
          setAddress({
            fullName: addr.fullName || "",
            phoneNumber: addr.phone || "",
            addressLine1: addr.line1 || "",
            addressLine2: addr.line2 || "",
            city: addr.city || "",
            pinCode: addr.pin || "",
          });
        }
      } catch {
      }
    };

    loadAddress();
  }, [navigate]);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 500 ? 100 : 0;
  const finalTotal = Math.max(subtotal + shipping - discount, 0);

  const handleApplyCoupon = () => {
    if (!subtotal || couponApplied) return;
    if (!/^[A-Z0-9]{7}$/.test(coupon)) {
      toast.warning("Invalid coupon code");
      return;
    }
    setDiscount(50);
    setCouponApplied(true);
    toast.success("Coupon applied");
  };

  const saveOrUpdateAddress = async () => {
    const payload = {
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      pinCode: address.pinCode,
    };

    if (addressRecord) {
      await updateShippingAddress(addressRecord, payload);
      return;
    }

    await createShippingAddress(payload);

    const addresses = await getMyShippingAddresses();

    if (Array.isArray(addresses) && addresses.length > 0) {
      setAddressRecord(addresses[0].id);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.length === 0) {
      toast.warning("Cart is empty");
      return;
    }

    const required = [
      address.fullName,
      address.phoneNumber,
      address.addressLine1,
      address.city,
      address.pinCode,
    ];

    const hasEmptyField = required.some(
      (f) => String(f ?? "").trim() === ""
    );

    if (hasEmptyField) {
      toast.warning("Fill all required address fields");
      return;
    }

    if (
      paymentMethod === "card" &&
      (!cardInfo.cardNumber ||
        !cardInfo.cardName ||
        !cardInfo.expiry ||
        !cardInfo.cvv)
    ) {
      toast.warning("Enter all card details");
      return;
    }

    if (paymentMethod === "upi" && String(upiId ?? "").trim() === "") {
      toast.warning("Enter UPI ID");
      return;
    }

    try {
      await saveOrUpdateAddress();
      await makePayment();

      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
    console.log("Address validation payload:", address);
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
                onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="Address Line 1"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={address.line2}
              onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
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
                onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
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
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>₹{shipping.toFixed(2)}</span></div>
          <div className="summary-row"><span>Discount</span><span>- ₹{discount.toFixed(2)}</span></div>

          <div className="summary-divider" />
          <div className="summary-row total">
            <span>Total</span><span>₹{finalTotal.toFixed(2)}</span>
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
