import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

function Orders() {
    const [orders, setOrders] = useState([])
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect (() => {
     const user = JSON.parse(localStorage.getItem("user"))
      if (!user) {
      alert("Please login to view your orders")
      navigate("/login")
      return
    }

    setUser(user)
     const userOrders = JSON.parse(localStorage.getItem(`orders-${user.email}`))
     setOrders(userOrders)
    },[])

  return (
    <div className='container2'>
        <h1>YOUR ORDERS</h1>
        <br/><hr/><br/>
        {orders.length === 0 ?(<p>no orders found.</p>) : (
            orders.map(order => (
                <div key = {order.id}>
                    <p><strong>order ID : </strong> {order.id} </p>
                    <p><strong>date : </strong> {order.date} </p>
                    <p><strong>total : </strong> ₹ {order.total} </p>
                    <ul>
                        {order.items.map(item => (
                           <li key={item.id}>
                            {item.name} x {item.qty} = {item.price} * {item.qty}
                           </li> 
                        ))}
                    </ul>
                    <br/><hr/><br/>
                </div>
            ))
        )}
        <button className='btn' onClick={()=> navigate('/')} >Go Home</button>
    </div>
  )
}

export default Orders