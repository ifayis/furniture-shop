import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
      navigate("/login", { replace: true });
    
  };

  return (
    <div className='actn'>
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>
      <hr/>
      <br/>
      <div>
        <button className='btn1' onClick={() => navigate("/admin-products")}>Manage Products</button>
        <br/>
        <button className='btn1' onClick={() => navigate("/admin-users")}>Manage Users</button>
         <br/>
         <button className='btn1' onClick={handleLogout} >LOGOUT</button>
      </div>
    </div>
   </div>
  );
}

export default AdminPage;
