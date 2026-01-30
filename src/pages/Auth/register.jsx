import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "@/css/Auth-Side/register.css";

import { signUp } from "@/api/authApi";


function Register() {
  const [form, setForm] = useState({
    FullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.FullName || !form.email || !form.password) {
      toast.info("Fill all the fields first.");
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.warning("Enter a valid Gmail address");
      return;
    }

    try {
      await signUp({
        FullName: form.FullName,
        email: form.email,
        password: form.password,
      });

      toast.success("Registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed");
    }
  };

  return (
    <div className="register-bg-wrapper">
      <BackgroundOrbs />

      <div className="register-card">
        <div className="register-brand-panel">
          <div className="brand-badge">LUXLIVING</div>
          <h2 className="brand-title">Design your space with ease.</h2>
          <p className="brand-text">
            Create your account to explore premium furniture.
          </p>
        </div>

        <div className="register-wrapper">
          <div className="register-header">
            <p className="pill-label">Welcome</p>
            <h1 className="register-title">Create your account</h1>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="field-label">Full name</label>
              <input
                className="register-input"
                type="text"
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="field-label">Gmail address</label>
              <input
                className="register-input"
                type="email"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="field-label">Password</label>
              <input
                className="register-input"
                type="password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <button className="register-button" type="submit">
              Create account
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;


function BackgroundOrbs() {
  return (
    <>
      <motion.div className="bg-orb orb1" />
      <motion.div className="bg-orb orb2" />
      <motion.div className="bg-orb orb3" />
    </>
  );
}
