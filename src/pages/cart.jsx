import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log("User ", user)
    if (!user) {
      alert('proceed to login')
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
    <div className='container2' style={{ padding: "2rem" }}>
      <h2>🛒 Your Cart</h2>
      <hr/>
      <br/>

      {cart.length === 0 ? <p>No items in cart</p> :
        <div className='ctnr'>
          {cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <img className='img3' src={`/images/${item.image}`} alt={item.name} width="100" />
              <div>
                <h4>{item.name}</h4>
                <p>Price: ₹{item.price}</p>
                <p>
                  Quantity :
                  <button className='plus' onClick={() => updateQty(item.id, -1)}>-</button>
                  {item.qty}
                  <button className='plus' onClick={() => updateQty(item.id, 1)}>+</button>
                </p>
                <button className='remove' onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </div>
          ))}
          <h3>Total: ₹{total}</h3>
        </div>
      }
      {cart.length > 0 && (
        <button className='buy' onClick={() => navigate("/checkout")}>Proceed To Checkout</button>
      )}
    </div>
  )
}

export default Cart