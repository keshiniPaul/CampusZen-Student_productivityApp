import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";
import campusLogo from "../images/campus_logo.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔵 Later connect to backend
    console.log(formData);

    /*
    await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    */

    // Example redirect after login
    navigate("/dashboard");
  };

  return (
    <>
      {/* Header */}
      <header className="topbar">
        <nav className="nav container">
          <Link className="brand" to="/">
            <img
              className="brand__logo--img"
              src={campusLogo}
              alt="CampusZone Logo"
            />
          </Link>

          <div className="nav__cta">
            <Link className="btn btn--ghost" to="/register">
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* Login Section */}
      <main className="login">
        <div className="container login__container">
          <div className="login__card">
            <h2>Welcome Back</h2>
            <p className="login__subtitle">
              Login to continue to CampusZone.
            </p>

            <form onSubmit={handleSubmit} className="login__form">
              <input
                type="email"
                name="email"
                placeholder="University Email"
                required
                onChange={handleChange}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
              />

              <button type="submit" className="btn btn--primary btn--lg">
                Login
              </button>
            </form>

            <p className="login__register">
              Don’t have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <div className="footer__name">CampusZone</div>
            <div className="footer__small">
              Student Productivity Platform
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Login;