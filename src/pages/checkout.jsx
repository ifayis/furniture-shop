import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './checkout.css'

function Checkout() {
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      alert("Please login first")
      navigate('/login')
      return
    }
    setUser(user)
    const cartKey = `cart-${user.email}`
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || []
    setCart(storedCart)
  }, [])

  const handlePayment = () => {
    const cartKey = `cart-${user.email}`
    const orderKey = `orders-${user.email}`
    const previousOrders = JSON.parse(localStorage.getItem(orderKey)) || []

    if (cart.length === 0) {
      alert("Add items to the cart")
      navigate("/products")
      return
    }

    const newOrder = {
      id: Date.now(),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      date: new Date().toLocaleString()
    }

    const updatedOrders = [...previousOrders, newOrder];
    localStorage.setItem(orderKey, JSON.stringify(updatedOrders))
    localStorage.removeItem(cartKey)
    alert("Payment successful, order placed")
    navigate('/orders')
  }

  return (
    <div className="checkout-container">
  <div className="checkout-header">
    <h1 className="checkout-title">Checkout Your Order</h1>
    <div className="checkout-progress">
      <span className="active">Cart</span>
      <span className="active">Details</span>
      <span>Payment</span>
      <span>Complete</span>
    </div>
  </div>

  {cart.length === 0 ? (
    <div className="empty-cart">
      <img src="/images/empty-cart.svg" alt="Empty cart" className="empty-cart-img" />
      <h3>Your cart is empty</h3>
      <button 
        className="primary-btn"
        onClick={() => navigate('/')}
      >
        Continue Shopping
      </button>
    </div>
  ) : (
    <div className="checkout-content">
      <div className="order-summary">
        <h2 className="section-title">Order Summary</h2>
        <div className="order-items">
          {cart.map((item) => (
            <div className="order-item" key={item.id}>
              <div className="item-image-container">
                <img 
                  src={`/images/${item.image}`} 
                  alt={item.name} 
                  className="item-image"
                  loading="lazy"
                />
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-meta">
                  <span className="item-price">${item.price.toLocaleString()}</span>
                  <span className="item-quantity">Qty: {item.qty}</span>
                </div>
                <p className="item-total">${(item.price * item.qty).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="order-totals">
          <div className="total-row">
            <span>Subtotal</span>
            <span>${cart.reduce((sum, item) => sum + item.price * item.qty, 0).toLocaleString()}</span>
          </div>
          <div className="total-row">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="total-row grand-total">
            <span>Total Amount</span>
            <span>${cart.reduce((sum, item) => sum + item.price * item.qty, 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="checkout-actions">
        <button 
          className="secondary-btn"
          onClick={() => navigate('/cart')}
        >
          ← Back to Cart
        </button>
        <button 
          className="primary-btn payment-btn"
          onClick={handlePayment}
        >
          Proceed to Payment
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )}
</div>
  )
}

export default Checkout
