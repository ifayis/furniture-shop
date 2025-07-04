import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then(res => res.json())
      .then(data => setUsers(data.filter(u => u.isActive !== false && u.role !== 'admin')));
  }, []);

  const handleBlockToggle = async (user) => {
    await fetch(`http://localhost:3001/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: !user.isBlocked })
    });

    setUsers(users.map(u => u.id === user.id && user.role  ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  const handleSoftDelete = async (user) => {
    await fetch(`http://localhost:3001/users/${user.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false })
    });

    setUsers(users.filter(u => u.id !== user.id));
  };

  return (
    <div className='acontainer3' style={{ padding: '2rem' }}>
      <h2>Manage Users</h2>
      <button className='btn' style={{width:'20%'}} onClick={ () => navigate('/adminpage')} >Go Back</button>

      <table border="1" cellPadding="10" style={{ width:'40%', marginTop: '1rem'}}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Block/Unblock</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><strong>{user.email}</strong></td>
              <td>{user.isBlocked ? "Blocked" : "Active"}</td>
              <td>
                <button className='btn2' onClick={() => handleBlockToggle(user)}>
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
              <td>
                <button className='btn2' onClick={() => handleSoftDelete(user)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
