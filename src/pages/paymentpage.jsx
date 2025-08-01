import React, { useEffect, useState } from 'react';
import './paymentpage.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function PaymentPage() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Fetch user and cart on load
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      toast.info('Please login to continue.');
      navigate('/login');
      return;
    }
    setUser(userData);

    const cartKey = `cart-${userData.email}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(storedCart);
  }, []);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

  // Handle order placement
  const handlePlaceOrder = () => {
    if (!user || cart.length === 0) {
      toast.warning('No items in cart');
      navigate('/');
      return;
    }

    const cartKey = `cart-${user.email}`;
    const orderKey = `orders-${user.email}`;
    const previousOrders = JSON.parse(localStorage.getItem(orderKey)) || [];

    const newOrder = {
      id: Date.now(),
      items: cart,
      total,
      date: new Date().toLocaleString()
    };

    localStorage.setItem(orderKey, JSON.stringify([...previousOrders, newOrder]));
    localStorage.removeItem(cartKey);
    toast.success('Payment successful! Order placed.');
    navigate('/orders');
  };

  return (
    <div className="payment-container">
      <div className="checkout-grid">
        {/* Address Section */}
        <div className="address-section">
          <h3>Shipping Address</h3>
          <form className="address-form">
            <input type="text" placeholder="Full Name" required />
            <input type="text" placeholder="Phone Number" required />
            <input type="text" placeholder="Address Line 1" required />
            <input type="text" placeholder="Address Line 2" />
            <div className="input-row">
              <input type="text" placeholder="City" required />
              <input type="text" placeholder="PIN Code" required />
            </div>
          </form>

          <h3>Payment Method</h3>
          <div className="payment-options">
            <label>
              <input type="radio" name="payment" defaultChecked />
              Credit / Debit Card
            </label>
            <label>
              <input type="radio" name="payment" />
              UPI / Gpay
            </label>
            <label>
              <input type="radio" name="payment" />
              Cash on Delivery
            </label>
          </div>
        </div>

        {/* Summary Section */}
        <div className="summary-section">
          <h3>Order Summary</h3>
          <div className="summary-box">
            <p>Subtotal: ${subtotal.toLocaleString()}</p>
            <p>Shipping: ${shipping}</p>
            <p><strong>Total: ${total.toLocaleString()}</strong></p>
          </div>
          <button className="pay-button" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
