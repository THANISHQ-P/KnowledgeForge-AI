import "../../styles/Updates.css";
import "../StatCard";

import StatCard from "../StatCard";

function AdminUpdates() {
  // Temporary values
  // Later these will come from Supabase
  const employeeCount = 0;
  const expertCount = 0;
  const managerCount = 0;
  const approvalCount = 0;

  return (
    <div className="dashboard">

      <div className="updates-header">
        <h1>👑 Admin</h1>

        <p>
          Monitor employees, experts, managers and resignation approvals.
        </p>
      </div>

      {/* Dashboard Style Cards */}

      <div className="stats-grid">

        <StatCard
          title="Employees"
          value={employeeCount}
          icon="👥"
        />

        <StatCard
          title="Experts"
          value={expertCount}
          icon="🎓"
        />

        <StatCard
          title="Managers"
          value={managerCount}
          icon="👨‍💼"
        />

        <StatCard
          title="Pending Approvals"
          value={approvalCount}
          icon="📋"
        />

      </div>

      {/* Pending Requests */}

      <div className="update-card">

        <h2>Pending Resignation Requests</h2>

        <p>
          Review expert resignation requests and approve or reject them.
        </p>

        <div className="empty-state">
          No resignation requests available.
        </div>

      </div>

    </div>
  );
}

export default AdminUpdates;