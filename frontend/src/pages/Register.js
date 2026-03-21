import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import "./Register.css";
import campusLogo from "../images/campus_logo.png";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const roleFromPath = location.pathname.includes("/admin") ? "admin" : "student";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
  });
  const [role, setRole] = useState(roleFromPath);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const endpoint = role === "admin" ? "register/admin" : "register/student";
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          adminKey: formData.adminKey,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(role === "admin" ? "Admin Registration Successful" : "Student Registration Successful");
        navigate(role === "admin" ? "/admin/login" : "/student/login");
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
          <Link className="brand" to="/">
            <img
              className="brand__logo--img"
              src={campusLogo}
              alt="CampusZone Logo"
            />
          </Link>

          <div className="nav__cta">
            <Link className="btn btn--ghost" to={role === "admin" ? "/admin/login" : "/student/login"}>
              Login
            </Link>
          </div>
        </nav>
      </header>

      {/* Register Section */}
      <main className="register">
        <div className="container register__container">
          <div className="register__card">
            <h2>Create Your Account</h2>
            <p className="register__subtitle">
              Register as {role === "admin" ? "Admin" : "Student"} and get started with CampusZone.
            </p>

            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setRole("student")}
              >
                Student Register
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setRole("admin")}
              >
                Admin Register
              </button>
            </div>

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

              {role === "admin" && (
                <input
                  type="password"
                  name="adminKey"
                  placeholder="Admin Registration Key"
                  required
                  onChange={handleChange}
                />
              )}

              <button type="submit" className="btn btn--primary btn--lg">
                Register
              </button>
            </form>

            <p className="register__login">
              Already have an account? <Link to={role === "admin" ? "/admin/login" : "/student/login"}>Login</Link>
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