import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/sidebar.css";

function Sidebar() {
  const { role } = useAuth();

  return (
    <aside className="sidebar">

      <h2 className="sidebar-title">
        KnowForge AI
      </h2>

      <nav>

        <NavLink
          to="/dashboard"
          className="nav-link"
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/knowledge-library"
          className="nav-link"
        >
          📚 Knowledge Library
        </NavLink>

        <NavLink
          to="/machines"
          className="nav-link"
        >
          🏭 Machines
        </NavLink>

        <NavLink
          to="/ai-chat"
          className="nav-link"
        >
          🤖 AI Chat
        </NavLink>

        <NavLink
          to="/updates"
          className="nav-link"
        >
          🔔 Updates
        </NavLink>

      </nav>

      <div className="sidebar-footer">

        <small>Logged in as</small>

        <h4>{role}</h4>

      </div>

    </aside>
  );
}

export default Sidebar;