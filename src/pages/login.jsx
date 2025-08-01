import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './login.css'

function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: 'user' })
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.alert('fill all the data first')
      return;
    }

    const res = await fetch(`https://furniture-shop-asjh.onrender.com/users?email=${form.email}&password=${form.password}&role=${form.role}`);
    const data = await res.json()

    if (data.length > 0) {
      localStorage.setItem('user', JSON.stringify(data[0]))
      if (data[0].role === "admin") {
        navigate("/adminpage");
      } else {
        navigate("/");
      }
    } else {
      toast.warning('Wrong data. Register firt')
      navigate('/register')
    }

  }
  return (
   
  <div className="login-bg-wrapper">

  <div className="login-container" style={{ position: 'relative', zIndex: 1 }}>
    <form className="login-form" onSubmit={handleSubmit}>
      
      <div className="login-header">
        <h2>Welcome Back</h2>
        <p>Login to explore our furniture collection</p>
      </div>

      <div className="form-group">
        <div className="input-with-icon">
          <span className="input-icon">👤</span>
          <select 
            className="role-select"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <div className="input-with-icon">
          <span className="input-icon">✉️</span>
          <input 
            type="email" 
            className="form-input"
            placeholder="your@email.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <div className="input-with-icon">
          <span className="input-icon">🔒</span>
          <input 
            type="password" 
            className='form-input'
            placeholder="••••••••"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
         
        </div>
      </div>

      <button type="submit" className="login-button">
        Sign In
      </button>
      <div className="login-footer">
        <p>New to Furniture Store? <a href="/register"><span className='createacc'>Create account</span></a></p>
        <a className='forgot-pass'>
          <img src="/images/lock-icon.png" alt="" width="14" />
          Forgot password?
        </a>
      </div>
    </form>
  </div>
</div>
  )
}

export default Login



