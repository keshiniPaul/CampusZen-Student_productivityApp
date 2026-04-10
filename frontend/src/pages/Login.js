import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Login.css";
import campusLogo from "../images/campus_logo.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const roleFromPath = location.pathname.includes("/admin") ? "admin" : "student";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState(roleFromPath);
  
  const [toast, setToast] = useState({ visible: false, message: "" });

  const validate = (values) => {
    const nextErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const nextErrors = validate({ ...formData, [name]: value });
    setErrors((prev) => ({
      ...prev,
      [name]: nextErrors[name] || "",
    }));
  };

  const showToast = (message) => {
    setToast({ visible: true, message });
    
    // Auto hide after 1.5 seconds and navigate
    setTimeout(() => {
      setToast({ visible: false, message: "" });
      navigate("/dashboard");
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const endpoint = role === "admin" ? "login/admin" : "login/student";
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        showToast(role === "admin" ? "Admin Login Successful" : "Student Login Successful");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
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
            <Link className="btn btn--ghost" to="/register">
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* Login Section */}
      <main className="login">
        <div className="container login__container">
          <div className="login__image-wrapper">
             <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200" alt="CampusZone Showcase" className="login__image" />
          </div>
          <div className="login__card">
            <h2>Welcome Back</h2>
            <p className="login__subtitle">
              Login as {role === "admin" ? "Admin" : "Student"} to continue to CampusZone.
            </p>

            <div className="login__roleToggle">
              <button
                type="button"
                className={`btn btn--ghost login__roleBtn ${role === "student" ? "is-active" : ""}`.trim()}
                onClick={() => setRole("student")}
              >
                Student Login
              </button>
              <button
                type="button"
                className={`btn btn--ghost login__roleBtn ${role === "admin" ? "is-active" : ""}`.trim()}
                onClick={() => setRole("admin")}
              >
                Admin Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="login__form">
              <input
                type="email"
                name="email"
                placeholder="University Email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.email}
              />
              {errors.email && <p className="form__error">{errors.email}</p>}

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.password}
              />
              {errors.password && <p className="form__error">{errors.password}</p>}

              <button type="submit" className="btn btn--primary btn--lg">
                Login
              </button>
            </form>

            <p className="login__register">
              Do not have an account?{" "}
              <Link to={role === "admin" ? "/admin/register" : "/student/register"}>Register</Link>
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

      {/* Toast Notification */}
      <div className={`toast ${toast.visible ? "is-visible" : ""}`}>
        {toast.message}
      </div>
    </>
  );
}

export default Login;