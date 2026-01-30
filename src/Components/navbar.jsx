import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./css/navbar.css";

import { getUserFromToken } from "../utils/jwtService";
import { clearTokens } from "../utils/tokenService";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const user = getUserFromToken();

  const handleLogout = () => {
    clearTokens();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 className="logo">LUXELIVING</h2>

        {/* Hamburger */}
        <div
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-links-container ${isOpen ? "active" : ""}`}>
          {user ? (
            <div className="nav-links">

              <Link
                to="/"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/cart"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Cart
              </Link>

              <Link
                to="/orders"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Orders
              </Link>

              {user.role === "Admin" && (
                <Link
                  to="/admin"
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link
                to="/register"
                className="auth-link register"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>

              <Link
                to="/login"
                className="auth-link login"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
