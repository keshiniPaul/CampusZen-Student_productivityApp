import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import campusLogo from "../images/campus_logo.png";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ===============================
  UPDATED HANDLE SUBMIT ONLY
  ================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful!");
        navigate("/login");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="topbar">
        <nav className="nav container">
          <a className="brand" href="/">
            <img
              className="brand__logo--img"
              src={campusLogo}
              alt="CampusZone Logo"
            />
          </a>

          <div className="nav__cta">
            <a className="btn btn--ghost" href="/login">
              Login
            </a>
          </div>
        </nav>
      </header>

      {/* Register Section */}
      <main className="register">
        <div className="container register__container">
          <div className="register__card">
            <h2>Create Your Account</h2>
            <p className="register__subtitle">
              Join CampusZone and start managing your student life smarter.
            </p>

            <form onSubmit={handleSubmit} className="register__form">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                onChange={handleChange}
              />

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

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                onChange={handleChange}
              />

              <button type="submit" className="btn btn--primary btn--lg">
                Register
              </button>
            </form>

            <p className="register__login">
              Already have an account? <a href="/login">Login</a>
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

export default Register;