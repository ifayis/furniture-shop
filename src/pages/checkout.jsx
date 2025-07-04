import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div className='container3'>
      <h1>Checkout your orders</h1>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <img src={`/images/${item.image}`} alt={item.name} width="100" />
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>Quantity: {item.qty}</p>
              <p>Total: ₹{item.price * item.qty}</p>
            </div>
          ))}

          <h2>Total Amount: ₹{cart.reduce((sum, item) => sum + item.price * item.qty, 0)}</h2>
        </div>
      )}

      <button className='btn' onClick={() => navigate('/cart')}>Go to Cart</button>
      <br />
      <button className='btn' onClick={handlePayment}>Pay Now</button>
    </div>
  )
}

export default Checkout
