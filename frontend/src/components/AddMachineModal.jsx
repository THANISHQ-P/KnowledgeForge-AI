import { useState } from "react";
import {
  FaTimes,
  FaCog,
  FaIndustry,
  FaMapMarkerAlt,
  FaBuilding,
  FaAlignLeft,
} from "react-icons/fa";

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

          <div className="modal-title">

            <div className="modal-icon">
              <FaCog />
            </div>

            <div>

              <h2>Add New Machine</h2>

              <p>
                Register a new industrial asset
              </p>

            </div>

          </div>

          <button
            className="close-btn"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>

        <form onSubmit={saveMachine}>

          <div className="modal-body">

            <div className="form-grid">

              <div className="input-group">

                <label>Machine ID</label>

                <div className="input-box">

                  <FaCog />

                  <input
                    type="text"
                    placeholder="MC-001"
                    value={machineId}
                    onChange={(e) =>
                      setMachineId(e.target.value)
                    }
                  />

                </div>

              </div>

              <div className="input-group">

                <label>Machine Name</label>

                <div className="input-box">

                  <FaIndustry />

                  <input
                    type="text"
                    placeholder="CNC Machine"
                    value={machineName}
                    onChange={(e) =>
                      setMachineName(e.target.value)
                    }
                  />

                </div>

              </div>

              <div className="input-group">

                <label>Department</label>

                <div className="input-box">

                  <FaBuilding />

                  <input
                    type="text"
                    placeholder="Production"
                    value={department}
                    onChange={(e) =>
                      setDepartment(e.target.value)
                    }
                  />

                </div>

              </div>

              <div className="input-group">

                <label>Location</label>

                <div className="input-box">

                  <FaMapMarkerAlt />

                  <input
                    type="text"
                    placeholder="Block A"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                  />

                </div>

              </div>

              <div className="input-group full-width">

                <label>Status</label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option>Running</option>
                  <option>Maintenance</option>
                  <option>Stopped</option>
                </select>

              </div>

              <div className="input-group full-width">

                <label>Description</label>

                <div className="textarea-box">

                  <FaAlignLeft />

                  <textarea
                    rows="4"
                    placeholder="Machine Description..."
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                  />

                </div>

              </div>

            </div>

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