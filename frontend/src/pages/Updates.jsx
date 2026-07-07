import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../contexts/AuthContext";

import EmployeeUpdates from "../components/updates/EmployeeUpdates";
import ExpertUpdates from "../components/updates/ExpertUpdates";
import ManagerUpdates from "../components/updates/ManagerUpdates";
import AdminUpdates from "../components/updates/AdminUpdates";

function Updates() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <AppLayout>
        <h2 style={{ color: "white", padding: "30px" }}>
          Loading...
        </h2>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <h2 style={{ color: "white", padding: "30px" }}>
          No Profile Found
        </h2>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      {profile.role === "employee" && (
        <EmployeeUpdates userProfile={profile} />
      )}

      {profile.role === "expert" && (
        <ExpertUpdates userProfile={profile} />
      )}

      {profile.role === "manager" && (
        <ManagerUpdates userProfile={profile} />
      )}

      {profile.role === "admin" && (
        <AdminUpdates userProfile={profile} />
      )}

    </AppLayout>
  );
}

export default Updates;