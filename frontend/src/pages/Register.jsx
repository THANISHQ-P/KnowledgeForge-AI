import "../styles/register.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    employee_id: "",
    department: "",
    role: "Employee",
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.full_name ||
      !formData.employee_id ||
      !formData.department ||
      !formData.email ||
      !formData.password
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const normalizedRole = formData.role.toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          employee_id: formData.employee_id,
          department: formData.department,
          role: normalizedRole,
        },
      },
    });

    if (error) {
      console.error(error);
      const normalizedError =
        error?.message ||
        error?.error?.message ||
        (typeof error === "string" ? error : null) ||
        (typeof error === "object" && Object.keys(error).length > 0
          ? JSON.stringify(error)
          : null);

      alert(normalizedError || "Registration failed.");
      setLoading(false);
      return;
    }

    alert("Registration Successful!");

    navigate("/login");

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h1>KnowForge AI</h1>

        <p>Create Employee Account</p>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            value={formData.employee_id}
            onChange={handleChange}
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option>Employee</option>
            <option>Expert</option>
            <option>Manager</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <div className="bottom-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;