import React from "react";
import { useNavigate } from "react-router-dom";
import "@/css/Admin-Side//adminpage.css";
import { toast } from "react-toastify";

import { logout } from "@/api/authApi";
import { clearTokens } from "@/utils/tokenService";

function AdminPage() {
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await logout();
  } catch (err) {
    console.warn("Logout API failed, clearing tokens anyway");
  } finally {
    clearTokens();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  }
};
  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-card">
          {/* Header */}
          <div className="admin-header">
              <h2 className="admin-title">Admin Dashboard</h2>
              <p className="admin-subtitle">
                Manage products, users and oversee your LuxeLiving store.
              </p>
          </div>

          <div className="admin-divider" />

          {/* Main actions */}
          <div className="admin-actions">
            <button
              className="admin-btn"
              onClick={() => navigate("/admin-products")}
            >
              <span className="icon-circle">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 10H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="btn-text">
                <span className="btn-title">Manage Products</span>
                <span className="btn-subtitle">
                  Add, edit and hide items in catalog
                </span>
              </div>
            </button>

            <button
              className="admin-btn"
              onClick={() => navigate("/admin-users")}
            >
              <span className="icon-circle">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="btn-text">
                <span className="btn-title">Manage Users</span>
                <span className="btn-subtitle">
                  View activity, block and remove users
                </span>
              </div>
            </button>
          </div>

          {/* Footer logout button */}
          <div className="admin-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <span>Logout</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
