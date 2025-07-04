import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    setUser(storedUser)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem("user")
    alert("Logged out successfully")
    navigate('/login',{replace:true})
  }

  return (

    <div className="nav">
      <h2 className="logo">🛋️ FurnitureStore</h2>
       {user && (
         <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>
       )}
      {user ? (
  <>
  <div className={`nav-links ${isOpen ? 'active' : ''}`}>
    <Link to="/" className='link2'>Home</Link>
    <Link to="/cart" className='link2'>Cart</Link>
    <Link to="/orders" className='link2'>Orders</Link>
    <button onClick={handleLogout} className="logout">Logout</button>
   </div>
  </>
) : (
  <>
  <div className='auth-links'>
    <Link to="/register" className='link1'>Register</Link>
    <Link to="/login" className='link1'>Login</Link>
    </div>
    
  </>
)}
    </div>
  )
}

export default Navbar
