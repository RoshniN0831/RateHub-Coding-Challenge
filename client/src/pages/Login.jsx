import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));

const role = response.data.user.role;

if (role === "ADMIN") {
  window.location.href = "/admin";
} else if (role === "STORE_OWNER") {
  window.location.href = "/owner";
} else {
  window.location.href = "/dashboard";
}
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log in. Please check your credentials."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="brand-mark">R</span>
          <span>RateHub</span>
        </div>

        <div className="auth-intro">
          <span className="eyebrow">
            <span className="eyebrow-line"></span>
            WELCOME BACK
          </span>

          <h1>
            Your ratings.
            <span> Your choices.</span>
          </h1>

          <p>
            Sign in to discover stores, manage your ratings, and make
            decisions with confidence.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="login-card">
          <div className="login-heading">
            <span className="eyebrow">ACCOUNT ACCESS</span>

            <h2>Sign in to RateHub</h2>

            <p>
              Enter your account details to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit">
              Sign in
              <span>→</span>
            </button>
          </form>

          <div className="auth-footer">
            <span>Don't have an account?</span>
            <button type="button">Create account</button>
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

export default Login;