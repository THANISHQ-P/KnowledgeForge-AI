import { useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";

import "../../styles/addMachineModal.css";

function AddMachineModal({ onClose }) {
  const { user, role } = useAuth();

  const [machineName, setMachineName] = useState("");
  const [machineId, setMachineId] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Running");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);

  async function saveMachine(e) {
    e.preventDefault();

    if (!machineName || !machineId || !department) {
      alert("Please fill all required fields.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("machines")
      .insert([
        {
          machine_id: machineId,
          machine_name: machineName,
          department,
          location,
          status,
          description,
          created_by: user?.id,
        },
      ]);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Machine added successfully.");

    onClose();
  }

  if (
    role !== "Expert" &&
    role !== "Manager" &&
    role !== "Admin"
  ) {
    return null;
  }

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <div className="modal-header">

          <h2>Add Machine</h2>

          <button
            type="button"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <form onSubmit={saveMachine}>

          <div className="modal-body">

            <input
              type="text"
              placeholder="Machine Name"
              value={machineName}
              onChange={(e) =>
                setMachineName(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Machine ID (Example: MC-001)"
              value={machineId}
              onChange={(e) =>
                setMachineId(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="Running">
                Running
              </option>

              <option value="Maintenance">
                Maintenance
              </option>

              <option value="Stopped">
                Stopped
              </option>

            </select>

            <textarea
              rows="4"
              placeholder="Machine Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>

          <div className="modal-footer">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Machine"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddMachineModal;