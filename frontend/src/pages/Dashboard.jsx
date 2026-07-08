import { useEffect, useState } from "react";
import "../styles/dashboard.css";

import AppLayout from "../components/layout/AppLayout";
import StatCard from "../components/StatCard";

import MachineStatus from "../components/dashboard/MachineStatus";
import RecentAlerts from "../components/dashboard/RecentAlerts";

import { supabase } from "../services/supabase";

function Dashboard() {
  const [stats, setStats] = useState({
    machines: 0,
    knowledge: 0,
    sops: 0,
    employees: 0,
    risk: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      console.log("========== LOADING DASHBOARD ==========");

      // Machines
      const machines = await supabase
        .from("machines")
        .select("*", { count: "exact", head: true });

      console.log("Machines Result:", machines);

      // Knowledge Library
      const knowledge = await supabase
        .from("knowledge_library")
        .select("*", { count: "exact", head: true });

      console.log("Knowledge Result:", knowledge);

      // SOP Count
      const sops = await supabase
        .from("knowledge_library")
        .select("*", { count: "exact", head: true })
        .eq("category", "SOP");

      console.log("SOP Result:", sops);

      // Employees
      const employees = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true });

      console.log("Employees Result:", employees);

      // Print any errors
      if (machines.error) console.error("Machines Error:", machines.error);
      if (knowledge.error) console.error("Knowledge Error:", knowledge.error);
      if (sops.error) console.error("SOP Error:", sops.error);
      if (employees.error) console.error("Employees Error:", employees.error);

      const machineCount = machines.count ?? 0;
      const knowledgeCount = knowledge.count ?? 0;
      const sopCount = sops.count ?? 0;
      const employeeCount = employees.count ?? 0;

      let risk = 0;

      if (employeeCount > 0) {
        risk = Math.round(
          ((employeeCount - knowledgeCount) / employeeCount) * 100
        );

        if (risk < 0) risk = 0;
      }

      console.log("========== DASHBOARD COUNTS ==========");
      console.log("Machines:", machineCount);
      console.log("Knowledge:", knowledgeCount);
      console.log("SOPs:", sopCount);
      console.log("Employees:", employeeCount);
      console.log("Risk:", risk);

      setStats({
        machines: machineCount,
        knowledge: knowledgeCount,
        sops: sopCount,
        employees: employeeCount,
        risk,
      });
    } catch (err) {
      console.error("========== DASHBOARD CRASH ==========");
      console.error(err);
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
            value={stats.machines}
            icon="🏭"
          />

          <StatCard
            title="Knowledge Articles"
            value={stats.knowledge}
            icon="📚"
          />

          <StatCard
            title="SOPs"
            value={stats.sops}
            icon="📄"
          />

          <StatCard
            title="Employees"
            value={stats.employees}
            icon="👥"
          />

          <StatCard
            title="Risk Score"
            value={`${stats.risk}%`}
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