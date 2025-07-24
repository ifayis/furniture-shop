import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import './navbar.css'

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
    toast.success('logout successfully !')
    navigate('/login',{replace:true})
  }

  return (

        <nav className="navbar">
      <div className="navbar-container">
        <h2 className="logo"> LUXELIVING</h2>

        <div 
          className={`hamburger ${isOpen ? 'active' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-links-container ${isOpen ? 'active' : ''}`}>
          {user ? (
            <div className="nav-links">
              <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/cart" className="nav-link" onClick={() => setIsOpen(false)}>Cart</Link>
              <Link to="/orders" className="nav-link" onClick={() => setIsOpen(false)}>Orders</Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }} 
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/register" className="auth-link register" onClick={() => setIsOpen(false)}>Register</Link>
              <Link to="/login" className="auth-link login" onClick={() => setIsOpen(false)}>Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
