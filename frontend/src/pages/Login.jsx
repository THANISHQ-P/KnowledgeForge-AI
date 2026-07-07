import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const getErrorMessage = (error, fallback) => {
    if (!error) return fallback;

    if (typeof error === "string") {
      return error === "{}" ? fallback : error;
    }

    if (typeof error === "object") {
      if (error.message) return error.message;
      if (error.error) return getErrorMessage(error.error, fallback);
      if (error.details) return String(error.details);
    }

    return fallback;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage("Please fill all required fields.");
      setIsLoading(false);
      return;
    }

    if (isSignup && !fullName) {
      setErrorMessage("Please enter your full name.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignup) {
        const result = await signup(email, password, {
          full_name: fullName,
          role: role,
        });

        if (result.success) {
          navigate("/dashboard");
        } else {
          setErrorMessage(
            getErrorMessage(result.error, "Unable to create account.")
          );
        }
      } else {
        const result = await login(email, password);

        if (result.success) {
          navigate("/dashboard");
        } else {
          setErrorMessage(
            getErrorMessage(result.error, "Unable to login.")
          );
        }
      }
    } catch (err) {
      setErrorMessage(
        getErrorMessage(err, "An unexpected error occurred.")
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="header">
          <h1 className="logo">KnowForge AI</h1>

          <p className="subtitle">
            AI-Powered Industrial Knowledge Loss Prevention System
          </p>
        </div>

        <h2 className="login-title">
          {isSignup ? "Create Account" : "Employee Login"}
        </h2>

        {errorMessage && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#d8000c",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          >
            {errorMessage}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>

          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          {/* Password */}

          <div className="password-wrapper">

            <input
              className="password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>

          {isSignup && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
            >
              <option value="employee">Employee</option>
              <option value="expert">Expert</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Secure Login"}
          </button>

        </form>

        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
          }}
        >
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setErrorMessage("");
              setFullName("");
              setEmail("");
              setPassword("");
              setRole("employee");
              setShowPassword(false);
            }}
            style={{
              marginLeft: "8px",
              border: "none",
              background: "transparent",
              color: "#3B82F6",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>

        <p className="company-name">
          KnowForge AI
        </p>

      </div>
    </div>
  );
}

export default Login;