import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import './admin-users.css'

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetch("https://furniture-shop-asjh.onrender.com/users")
      .then(res => res.json())
      .then(data => setUsers(data.filter(u => u.isActive !== false && u.role !== 'admin')));
  }, []);

  const handleBlockToggle = async (user) => {
    await fetch(`https://furniture-shop-asjh.onrender.com/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: !user.isBlocked })
    });

    setUsers(users.map(u => u.id === user.id && user.role  ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  const handleSoftDelete = async (user) => {
    await fetch(`https://furniture-shop-asjh.onrender.com/users/${user.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false })
    });

    setUsers(users.filter(u => u.id !== user.id));
  };

  return (
    <div className='user-management-container' style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
  <div className='admin-header'>
    <h2>Manage Users</h2>
    <button 
      className='back-button' 
      onClick={() => navigate('/adminpage')}
    >
      ← Go Back
    </button>
  </div>

  <div className='table-container'>
    <table className='user-table'>
      <thead>
        <tr>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td className='email-cell'>
              <span className='user-email'>{user.email}</span>
              {user.isAdmin && <span className='admin-badge'>Admin</span>}
            </td>
            <td className={`status-cell ${user.isBlocked ? 'blocked' : 'active'}`}>
              {user.isBlocked ? "Blocked" : "Active"}
            </td>
            <td className='action-cell'>
              <button 
                className={`action-btn ${user.isBlocked ? 'unblock-btn' : 'block-btn'}`}
                onClick={() => handleBlockToggle(user)}
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </button>
              <button 
                className='action-btn delete-btn'
                onClick={() => handleSoftDelete(user)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}

export default AdminUsers;
