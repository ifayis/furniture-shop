import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "../css/register.css";

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

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      toast.info("Fill all the fields first.");
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.warning("Enter a valid Gmail address (e.g., example@gmail.com)");
      return;
    }

    try {
      const res = await fetch(
        "https://furniture-shop-asjh.onrender.com/users",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        toast.success("Registered successfully!");
        navigate("/login");
      } else {
        toast.error("Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="register-bg-wrapper">
      <BackgroundOrbs />

      <div className="register-card">
        {/* Left brand column */}
        <div className="register-brand-panel">
          <div className="brand-badge">LUXLIVING</div>
          <h2 className="brand-title">Design your space with ease.</h2>
          <p className="brand-text">
            Create your account to explore premium furniture, curated
            collections, and a seamless shopping experience.
          </p>
          <ul className="brand-list">
            <li>• Personalized recommendations</li>
            <li>• Track your orders & wishlist</li>
            <li>• Member-only offers & previews</li>
          </ul>
        </div>

        {/* Right form column */}
        <div className="register-wrapper">
          <div className="register-header">
            <p className="pill-label">Welcome</p>
            <h1 className="register-title">Create your account</h1>
            <p className="register-subtitle">
              Join our furniture community in just a few seconds.
            </p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="field-label" htmlFor="username">
                Full name
              </label>
              <input
                id="username"
                className="register-input"
                type="text"
                placeholder="Enter your name"
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="email">
                Gmail address
              </label>
              <input
                id="email"
                className="register-input"
                type="email"
                placeholder="youremail@gmail.com"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
              <p className="field-hint">We currently accept Gmail accounts.</p>
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="register-input"
                type="password"
                placeholder="Create a strong password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
              <p className="password-hint">
                Use at least 8 characters — mix letters, numbers & symbols.
              </p>
            </div>

            <button className="register-button" type="submit">
              <span>Create account</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
            <p>
              Admin user?
              <button
                type="button"
                className="auth-link auth-link-button"
                onClick={() => navigate("/login")}
              >
                Go to admin portal
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
