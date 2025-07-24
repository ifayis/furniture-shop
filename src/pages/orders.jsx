import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import './orders.css'

function Orders() {
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect (() => {
     const user = JSON.parse(localStorage.getItem("user"))
      if (!user) {
      toast.info('login to countinue.')
      navigate("/login")
      return
    }

    setUser(user)
     const userOrders = JSON.parse(localStorage.getItem(`orders-${user.email}`))
     setOrders(userOrders)
    },[])

  return (
   <div className="orders-container">
  <div className="orders-header">
    <h1 className="orders-title">Your Orders</h1>
    <div className="orders-divider"></div>
  </div>

  {orders.length === 0 ? (
    <div className="empty-orders">
      <img src="/images/empty-orders.svg" alt="No orders" className="empty-orders-img" />
      <h3>No orders found</h3>
      <p>You haven't placed any orders yet</p>
      <button 
        className="primary-btn"
        onClick={() => navigate('/')}
      >
        Browse Products
      </button>
    </div>
  ) : (
    <div className="orders-list">
      {orders.map(order => (
        <div className="order-card" key={order.id}>
          <div className="order-header">
            <div>
              <span className="order-meta-label">Order ID:</span>
              <span className="order-id">{order.id}</span>
            </div>
            <div>
              <span className="order-meta-label">Date:</span>
              <span className="order-date">{new Date(order.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</span>
            </div>
          </div>

          <div className="order-items">
            <h4 className="items-title">Items Ordered</h4>
            <ul className="items-list">
              {order.items.map(item => (
                <li className="item-row" key={item.id}>
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">x{item.qty}</span>
                  <span className="item-price">${(item.price * item.qty).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-footer">
            <div className="order-total">
              <span>Order Total:</span>
              <span className="total-amount">${order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  {orders.length > 0 && (
    <button 
      className="secondary-btn"
      onClick={() => navigate('/')}
    >
      Continue Shopping
    </button>
  )}
</div>
  )
}

export default Orders