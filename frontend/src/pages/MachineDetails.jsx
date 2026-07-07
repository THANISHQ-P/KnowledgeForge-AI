import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/machineDetails.css";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../services/supabase";

function MachineDetails() {
  const { machineId } = useParams();
  const navigate = useNavigate();

  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (machineId) {
      fetchMachine();
    }
  }, [machineId]);

  async function fetchMachine() {
    setLoading(true);

    const { data, error } = await supabase
      .from("machines")
      .select("*")
      .eq("machine_id", machineId)
      .single();

    if (error) {
      console.error(error);
      setMachine(null);
    } else {
      setMachine(data);
    }

    setLoading(false);
  }

  // No machine selected
  if (!machineId) {
    return (
      <AppLayout>
        <div className="machine-details">
          <h1>Machine Details</h1>

          <div className="details-card">
            <p>No machine selected.</p>

            <button
              className="back-btn"
              onClick={() => navigate("/machines")}
            >
              Open Machines
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="machine-details">
          <h2>Loading...</h2>
        </div>
      </AppLayout>
    );
  }

  if (!machine) {
    return (
      <AppLayout>
        <div className="machine-details">
          <h2>Machine not found.</h2>

          <button
            className="back-btn"
            onClick={() => navigate("/machines")}
          >
            Back
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="machine-details">

        <button
          className="back-btn"
          onClick={() => navigate("/machines")}
        >
          ← Back
        </button>

        <h1>{machine.machine_name}</h1>

        <div className="details-card">

          <p><strong>Machine ID:</strong> {machine.machine_id}</p>

          <p><strong>Department:</strong> {machine.department}</p>

          <p><strong>Status:</strong> {machine.status}</p>

          <p><strong>Location:</strong> {machine.location || "Not Available"}</p>

          <p><strong>Manufacturer:</strong> {machine.manufacturer || "Not Available"}</p>

          <p><strong>Model:</strong> {machine.model || "Not Available"}</p>

          <p><strong>Description:</strong></p>

          <p>
            {machine.description || "No description available."}
          </p>

        </div>

      </div>
    </AppLayout>
  );
}

export default MachineDetails;