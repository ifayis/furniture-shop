import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/admin-users.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://furniture-shop-asjh.onrender.com/users")
      .then((res) => res.json())
      .then((data) =>
        setUsers(data.filter((u) => u.isActive !== false && u.role !== "admin"))
      );
  }, []);

  const handleBlockToggle = async (user) => {
    await fetch(
      `https://furniture-shop-asjh.onrender.com/users/${user.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      }
    );

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u
      )
    );
  };

  const handleSoftDelete = async (user) => {
    if (!window.confirm("Remove this user from active list?")) return;

    await fetch(
      `https://furniture-shop-asjh.onrender.com/users/${user.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      }
    );

    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const handleViewInfo = (user) => {
    const cartKey = `cart-${user.email}`;
    const orderKey = `orders-${user.email}`;

    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const orders = JSON.parse(localStorage.getItem(orderKey)) || [];

    const cartTotal = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 0),
      0
    );
    const totalSpent = orders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    setSelectedUser(user);
    setUserStats({
      cart,
      orders,
      cartTotal,
      totalSpent,
    });
  };

  const closeInfoPanel = () => {
    setSelectedUser(null);
    setUserStats(null);
  };

  return (
    <div className="user-management-container">
      <div className="admin-content">
        {/* HEADER */}
        <div className="admin-header">
          <div>
            <h2 className="admin-title">User Management</h2>
            <p className="admin-subtitle">
              Block, remove or inspect user activity across carts and orders.
            </p>
          </div>
          <button
            className="back-button"
            onClick={() => navigate("/adminpage")}
          >
            ← Back to Admin
          </button>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>User Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="empty-row">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="email-cell">
                      <span className="user-email">{user.email}</span>
                      {user.role === "admin" && (
                        <span className="admin-badge">Admin</span>
                      )}
                    </td>
                    <td
                      className={`status-cell ${
                        user.isBlocked ? "blocked" : "active"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </td>
                    <td className="action-cell">
                      {/* Info button */}
                      <button
                        className="action-btn info-btn"
                        type="button"
                        onClick={() => handleViewInfo(user)}
                      >
                        ℹ Info
                      </button>

                      {/* Block / Unblock */}
                      <button
                        className={`action-btn ${
                          user.isBlocked ? "unblock-btn" : "block-btn"
                        }`}
                        type="button"
                        onClick={() => handleBlockToggle(user)}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>

                      {/* Delete / soft remove */}
                      <button
                        className="action-btn delete-btn"
                        type="button"
                        onClick={() => handleSoftDelete(user)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* INFO PANEL */}
        {selectedUser && userStats && (
          <div className="user-info-overlay" onClick={closeInfoPanel}>
            <div
              className="user-info-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="user-info-header">
                <div>
                  <h3>User Details</h3>
                  <p>{selectedUser.email}</p>
                </div>
                <button
                  className="close-info-btn"
                  type="button"
                  onClick={closeInfoPanel}
                >
                  ✕
                </button>
              </div>

              <div className="user-info-summary">
                <div className="stat-box">
                  <span className="stat-label">Total Orders</span>
                  <span className="stat-value">
                    {userStats.orders.length}
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Total Spent</span>
                  <span className="stat-value">
                    ${userStats.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Cart Items</span>
                  <span className="stat-value">
                    {userStats.cart.reduce(
                      (sum, item) => sum + (item.qty || 0),
                      0
                    )}
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Cart Value</span>
                  <span className="stat-value">
                    ${userStats.cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Orders List */}
              <div className="user-info-section">
                <h4>Orders</h4>
                {userStats.orders.length === 0 ? (
                  <p className="muted-text">No orders placed yet.</p>
                ) : (
                  <div className="orders-list">
                    {userStats.orders.map((order) => (
                      <div className="order-chip" key={order.id}>
                        <div className="order-chip-top">
                          <span className="order-id">
                            #{order.id.toString().slice(-6)}
                          </span>
                          <span className="order-amount">
                            ${order.total.toLocaleString()}
                          </span>
                        </div>
                        <span className="order-date">
                          {order.date || "No date"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart List */}
              <div className="user-info-section">
                <h4>Current Cart</h4>
                {userStats.cart.length === 0 ? (
                  <p className="muted-text">Cart is empty.</p>
                ) : (
                  <ul className="cart-items-list">
                    {userStats.cart.map((item) => (
                      <li key={item.id} className="cart-item-row">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-meta">
                          x{item.qty} · ${item.price.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
