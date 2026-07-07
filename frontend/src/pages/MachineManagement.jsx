import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/machineManagement.css";
import AppLayout from "../components/layout/AppLayout";
import AddMachineModal from "../components/modals/AddMachineModal";
import { supabase } from "../services/supabase";

function MachineManagement() {
  const navigate = useNavigate();

  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMachines();
  }, []);

  async function fetchMachines() {
    setLoading(true);

    const { data, error } = await supabase
      .from("machines")
      .select("*")
      .order("machine_id", { ascending: true });

    if (error) {
      console.error("Error fetching machines:", error);
    } else {
      setMachines(data || []);
    }

    setLoading(false);
  }

  const filteredMachines = machines.filter((machine) => {
    const text = search.toLowerCase();

    return (
      machine.machine_id?.toLowerCase().includes(text) ||
      machine.machine_name?.toLowerCase().includes(text) ||
      machine.department?.toLowerCase().includes(text)
    );
  });

  return (
    <AppLayout>
      <div className="machine-page">

        <div className="page-header">
          <h1>Machine Management</h1>

          <button
            className="add-machine-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Machine
          </button>
        </div>

        <input
          className="machine-search"
          placeholder="Search Machine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="machine-table">

          <thead>
            <tr>
              <th>Machine ID</th>
              <th>Machine Name</th>
              <th>Department</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : filteredMachines.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No machines found.
                </td>
              </tr>
            ) : (
              filteredMachines.map((machine) => (
                <tr key={machine.id}>
                  <td>{machine.machine_id}</td>
                  <td>{machine.machine_name}</td>
                  <td>{machine.department}</td>
                  <td>{machine.status}</td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/machines/${machine.machine_id}`)
                      }
                    >
                      View
                    </button>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {showModal && (
        <AddMachineModal
          onClose={() => {
            setShowModal(false);
            fetchMachines();
          }}
        />
      )}

    </AppLayout>
  );
}

export default MachineManagement;