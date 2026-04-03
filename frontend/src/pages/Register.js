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
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState(roleFromPath);

  const validate = (values, currentRole = role) => {
    const nextErrors = {};

    if (!values.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    } else if (values.fullName.trim().length < 3) {
      nextErrors.fullName = "Full name must be at least 3 characters.";
    }

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

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (values.password !== values.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (currentRole === "admin" && !values.adminKey.trim()) {
      nextErrors.adminKey = "Admin registration key is required.";
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

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setErrors({});
    setFormData((prev) => ({
      ...prev,
      adminKey: nextRole === "admin" ? prev.adminKey : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(formData, role);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
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

            <div className="register__roleToggle">
              <button
                type="button"
                className={`btn btn--ghost register__roleBtn ${role === "student" ? "is-active" : ""}`.trim()}
                onClick={() => handleRoleChange("student")}
              >
                Student Register
              </button>
              <button
                type="button"
                className={`btn btn--ghost register__roleBtn ${role === "admin" ? "is-active" : ""}`.trim()}
                onClick={() => handleRoleChange("admin")}
              >
                Admin Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="register__form">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.fullName}
              />
              {errors.fullName && <p className="form__error">{errors.fullName}</p>}

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

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.confirmPassword}
              />
              {errors.confirmPassword && <p className="form__error">{errors.confirmPassword}</p>}

              {role === "admin" && (
                <input
                  type="password"
                  name="adminKey"
                  placeholder="Admin Registration Key"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData.adminKey}
                />
              )}
              {errors.adminKey && <p className="form__error">{errors.adminKey}</p>}

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