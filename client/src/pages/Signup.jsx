import { useState } from "react";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );

      setSuccess(
        response.data.message || "Account created successfully."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <div className="signup-brand">
          <span className="brand-mark">R</span>
          <span>RateHub</span>
        </div>

        <div className="signup-intro">
          <span className="eyebrow">
            <span className="eyebrow-line"></span>
            JOIN RATEHUB
          </span>

          <h1>
            Discover more.
            <span> Rate better.</span>
          </h1>

          <p>
            Create your account and start discovering stores,
            comparing experiences, and sharing your own ratings.
          </p>

          <div className="signup-points">
            <div>
              <strong>01</strong>
              <span>Explore stores</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Compare ratings</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Share experiences</span>
            </div>
          </div>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-card">
          <div className="signup-heading">
            <span className="eyebrow">CREATE ACCOUNT</span>

            <h2>Join RateHub</h2>

            <p>
              Create your account to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">
                Address <span>(optional)</span>
              </label>

              <input
                id="address"
                name="address"
                type="text"
                placeholder="Your address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-success">
                {success}
              </div>
            )}

            <button type="submit" className="auth-submit">
              Create account
              <span>→</span>
            </button>
          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>

            <button
              type="button"
              onClick={() => (window.location.href = "/login")}
            >
              Sign in
            </button>
          </div>

          <button
            type="button"
            className="back-link"
            onClick={() => (window.location.href = "/")}
          >
            ← Back to RateHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;