import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './register.css'

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' })
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()


  const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.username || !form.email || !form.password) {
      alert("fill all the data first.")
    }

    if (!isValidEmail(form.email)) {
      alert("Enter a valid Gmail address (e.g., example@gmail.com)");
      return;
    }

    const res = await fetch('http://localhost:3001/users', {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Registered Successfully")
      navigate('/')
    } else {
      alert('registration failed')
    }
  }


  return (
   <div style={{
  backgroundImage: `url("/images/login-bg.avif")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  position: 'relative'
}}>

  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 0
  }}></div>

  <div className="register-wrapper" style={{ position: 'relative', zIndex: 1 }}>
    <div className="register-header">
      <h1 className='register-title'>Create Your Account</h1>
      <p className="register-subtitle">Join our furniture community today</p>
    </div>

    <form className='register-form' onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Username</label>
        <div className="input-container">
          <span className="input-icon">👤</span>
          <input 
            className='register-input' 
            type='text' 
            placeholder='Enter your username'
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email Address</label>
        <div className="input-container">
          <span className="input-icon">✉️</span>
          <input 
            className='register-input' 
            type='email' 
            placeholder='your@email.com'
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <div className="input-container">
          <span className="input-icon">🔒</span>
          <input 
            className='register-input' 
            type='password' 
            placeholder='Create a password'
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
           
        </div>
        <p className="password-hint">Use 8+ characters with a mix of letters, numbers & symbols</p>
      </div>


      <button className='register-button' type='submit'>
        <span>Create Account</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </form>

    <div className='register-footer'>
      <p>Already have an account? <Link to='/login' className="auth-link">Sign in</Link></p>
      <p>Are you an admin? <Link to='/login' className="auth-link" onClick={()=>navigate('/login')}>Admin portal</Link></p>
    </div>
  </div>
</div>
  )
}

export default Register