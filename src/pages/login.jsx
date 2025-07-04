import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: 'user' })
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert('fill all the data first')
      return;
    }

    const res = await fetch(`http://localhost:3001/users?email=${form.email}&password=${form.password}&role=${form.role}`);
    const data = await res.json()

    if (data.length > 0) {
      localStorage.setItem('user', JSON.stringify(data[0]))
      if (data[0].role === "admin") {
        navigate("/adminpage");
      } else {
        navigate("/");
      }
    } else {
      alert('invalid details, register')
    }

  }
  return (
    <div style={{
      backgroundImage: `url("/images/bgimg.avif")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100vw',
      height: '100vh',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
    }} >

       <div className="login-container">
      <form className="login-form">
        <h2>LOGIN HERE</h2>
        <select  onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option>user</option>
          <option>admin</option>
        </select>
        <label>E-MAIL</label>
        <input type="email" placeholder="Enter your Email" onChange={(e) => setForm({ ...form, email: e.target.value })}/>
        <label>PASSWORD</label>
        <input type="password" placeholder="Enter the Password" onChange={(e) => setForm({ ...form, password: e.target.value })}/>
        <button type="submit" style={{color:'black'}} onClick={handleSubmit} >LOGIN</button>
      </form>
    </div>
    </div>
     
  )
}

export default Login



