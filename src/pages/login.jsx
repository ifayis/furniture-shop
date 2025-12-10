import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "../css/login.css";

function BackgroundOrbs() {
  return (
    <>
      <motion.div
        className="bg-orb orb1"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.45 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <motion.div
        className="bg-orb orb2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.15 }}
      />

      <motion.div
        className="bg-orb orb3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
      />
    </>
  );
}

function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.info("Fill all the fields first.");
      return;
    }

    try {
      const res = await fetch(
        `https://furniture-shop-asjh.onrender.com/users?email=${form.email}&password=${form.password}&role=${form.role}`
      );
      const data = await res.json();

      if (data.length > 0) {
        localStorage.setItem("user", JSON.stringify(data[0]));
        if (data[0].role === "admin") {
          navigate("/adminpage");
        } else {
          navigate("/");
        }
      } else {
        toast.warning("Wrong credentials. Please register first.");
        navigate("/register");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="login-bg-wrapper">
      <BackgroundOrbs />

      <div className="login-card">
        <div className="login-header">
          <p className="pill-label">Welcome back</p>
          <h2 className="login-title">Sign in to your account</h2>
          <p className="login-subtitle">
            Access your LuxeLiving dashboard and continue shopping.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Role */}
          <div className="form-group">
            <label className="field-label" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="login-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="youremail@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="Enter your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>
            New to Furniture Store?
            <Link to="/register" className="auth-link">
              Create account
            </Link>
          </p>
          <button type="button" className="forgot-pass" disabled>
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
