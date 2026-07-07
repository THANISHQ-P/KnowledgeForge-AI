import "../styles/navbar.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      navigate("/login");
    }
  };

  const role =
    user?.user_metadata?.role ||
    user?.app_metadata?.role ||
    "Employee";

  return (
    <header className="navbar">

      <div className="navbar-left">

        <h2 className="navbar-logo">
          KnowForge AI
        </h2>

        <span className="company-title">
          Industrial Knowledge Loss Prevention System
        </span>

      </div>

      <div className="navbar-right">

        <div
          className="user-profile"
          onClick={() => setShowDropdown(!showDropdown)}
        >

          <span className="user-avatar">
            👤
          </span>

          <span className="user-name">
            <strong>{role}</strong> | {user?.email}
          </span>

          <span className="dropdown-arrow">
            ▼
          </span>

          {showDropdown && (
            <div className="dropdown-menu">

              <div className="dropdown-email">
                <strong>{role}</strong>
                <br />
                {user?.email}
              </div>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;