import { useEffect, useState } from "react";
import "../styles/dashboard.css";

import AppLayout from "../components/layout/AppLayout";
import StatCard from "../components/StatCard";

import MachineStatus from "../components/dashboard/MachineStatus";
import RecentAlerts from "../components/dashboard/RecentAlerts";

import { supabase } from "../services/supabase";

function Dashboard() {
  const [machineCount, setMachineCount] = useState(0);

  useEffect(() => {
    fetchMachineCount();
  }, []);

  async function fetchMachineCount() {
    const { count, error } = await supabase
      .from("machines")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error(error);
    } else {
      setMachineCount(count || 0);
    }
  }

  return (
    <AppLayout>
      <div className="dashboard">

        <h1>Dashboard</h1>

        <p>Welcome to KnowForge AI</p>

        <div className="stats-grid">

          <StatCard
            title="Total Machines"
            value={machineCount}
            icon="🏭"
          />

          <StatCard
            title="Knowledge Articles"
            value="0"
            icon="📚"
          />

          <StatCard
            title="SOPs"
            value="0"
            icon="📄"
          />

          <StatCard
            title="Employees"
            value="0"
            icon="👥"
          />

          <StatCard
            title="Risk Score"
            value="0%"
            icon="⚠️"
          />

        </div>

        <MachineStatus />

        <RecentAlerts />

      </div>
    </AppLayout>
  );
}

export default Dashboard;