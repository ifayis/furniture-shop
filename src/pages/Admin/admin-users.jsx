import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/Admin-Side//admin-users.css";

import {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
} from "@/api/usersApi";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();

        const filtered = data.filter((u) => u.role !== "Admin");
        setUsers(filtered);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    loadUsers();
  }, []);

  const handleBlockToggle = async (user) => {
    try {
      if (user.isBlocked) {
        await unblockUser(user.id);
      } else {
        await blockUser(user.id);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
    } catch (err) {
      console.error("Block/Unblock failed", err);
    }
  };

  const handleViewInfo = async (user) => {
    try {
      const data = await getUserById(user.id);

      setSelectedUser(user);

      setUserStats({
        orders: data?.orders ?? [],
        cart: data?.cart ?? [],
        totalSpent: data?.totalSpent ?? 0,
        cartTotal: data?.cartTotal ?? 0,
      });
    } catch (err) {
      console.error("Failed to load user details", err);
    }
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
                    </td>
                    <td
                      className={`status-cell ${user.isBlocked ? "blocked" : "active"
                        }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </td>
                    <td className="action-cell">
                      <button
                        className="action-btn info-btn"
                        onClick={() => handleViewInfo(user)}
                      >
                        ℹ Info
                      </button>

                      <button
                        className={`action-btn ${user.isBlocked ? "unblock-btn" : "block-btn"
                          }`}
                        onClick={() => handleBlockToggle(user)}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
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
                      (sum, item) => sum + (item.quantity || 0),
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
