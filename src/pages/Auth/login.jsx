import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "@/css/Auth-Side/login.css";

import { signIn } from "@/api/authApi";
import { setTokens } from "@/utils/tokenService";
import { getUserRole, getUserId } from "@/utils/tokenService";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.info("Fill all the fields first.");
      return;
    }

    try {
      const data = await signIn(form.email, form.password);
      setTokens(data.accessToken, data.refreshToken);

      const role = getUserRole();
      if (role === "Admin") {
        navigate("/adminpage", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      toast.success("Login successful");

      console.log("User Role:", getUserRole());
      console.log("User ID:", getUserId());

    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
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
          <div className="form-group">
            <label className="field-label">Email</label>
            <input
              type="email"
              className="login-input"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="field-label">Password</label>
            <input
              type="password"
              className="login-input"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
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
        </div>
      </div>
    </div>
  );
}

export default Login;

function BackgroundOrbs() {
  return (
    <>
      <motion.div className="bg-orb orb1" />
      <motion.div className="bg-orb orb2" />
      <motion.div className="bg-orb orb3" />
    </>
  );
}
