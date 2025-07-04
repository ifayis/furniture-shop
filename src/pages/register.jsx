import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' })
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
     <div
    style={{
      backgroundImage: `url("/images/bgimg.avif")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width:'100vw'
    }}
  >
    <div className="register-wrapper">
      <h1 className='register-title'>REGISTER HERE</h1>

      <form className='register-form' onSubmit={handleSubmit}>
        <label>USERNAME</label>
        <input className='register-input' type='text' placeholder='Enter the Username' onChange={(e) => setForm({ ...form, username: e.target.value })} />

        <label>E-MAIL</label>
        <input className='register-input' type='email' placeholder='Enter your Email' onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <label>PASSWORD</label>
        <input className='register-input' type='password' placeholder='Enter the Password' onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button className='register-button' type='submit'><strong>SUBMIT</strong></button>
      </form>

      <p className='register-links'>
        <Link to='/login'>Already registered?</Link> | <Link to='/login'>Admin login</Link>
      </p>
    </div>
  </div>
  )
}

export default Register