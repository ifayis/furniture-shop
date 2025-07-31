import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './cart.css'

function Cart() {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log("User ", user)
    if (!user) {
      toast.info('login to countinue.')
      navigate('/login')
      return;
    }
    const userCart = JSON.parse(localStorage.getItem(`cart-${user.email}`)) || []
    console.log("cart items : ", userCart)
    setCart(userCart)
  }, [])

  useEffect(() => {
    const ttl = cart.reduce((sum, item) =>
      sum + item.price * item.qty, 0)
    setTotal(ttl)
  }, [cart])

  const updateQty = (id, change) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item
    )
    setCart(updated)
    const user = JSON.parse(localStorage.getItem('user'))
    localStorage.setItem(`cart-${user.email}`, JSON.stringify(updated))
  }

  const removeItem = (id) => {
    const filtered = cart.filter(item => item.id !== id)
    setCart(filtered)
    const user = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem(`cart-${user.email}`, JSON.stringify(filtered));
  }


  return (
    <div className="cart-container">
  <div className="cart-header">
    <h2 className="cart-title">🛒 Your Shopping Cart</h2>
    <div className="cart-divider"></div>
  </div>

  {cart.length === 0 ? (
    <div className="empty-cart">
      <p>Your cart is empty</p>
      <br/>
      <button className="checkout-btn" onClick={() => navigate("/")}>
        Continue Shopping
      </button>
    </div>
  ) : (
    <>
      <div className="cart-items">
        {cart.map(item => (
          <div className="cart-item" key={item.id}>
            <div className="item-image-container">
              <img 
                className="item-image" 
                src={`/images/${item.image}`} 
                alt={item.name} 
                loading="lazy"
              />
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>              
              <div className="quantity-controls">
                <button 
                  className="quantity-btn minus" 
                  onClick={() => updateQty(item.id, -1)}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity-value">{item.qty}</span>
                <button 
                  className="quantity-btn plus" 
                  onClick={() => updateQty(item.id, 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              
              <button 
                className="remove-item" 
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            <p className="item-price">${item.price.toLocaleString()}</p>

            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="total-section">
          <span>Subtotal:</span>
          <span>${total.toLocaleString()}</span>
        </div>
        <div className="total-section">
          <span>Shipping:</span>
          <span>FREE</span>
        </div>
        <div className="total-section grand-total">
          <span>Total:</span>
          <span>${total.toLocaleString()}</span>
        </div>
        
        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
        
        <button className="checkout-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </>
  )}
</div>
  )
}

export default Cart