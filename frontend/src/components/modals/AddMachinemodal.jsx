import { useState } from "react";
import "../../styles/AddMachineModal.css";
import { supabase } from "../../services/supabase";

function AddMachineModal({ onClose }) {
  const [machineId, setMachineId] = useState("");
  const [machineName, setMachineName] = useState("");
  const [department, setDepartment] = useState(""); 
  const [location, setLocation] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState("Running");

  const handleSaveMachine = async () => {
    console.log("========== SAVE BUTTON CLICKED ==========");

    console.log({
      machineId,
      machineName,
      department,
      location,
      manufacturer,
      model,
      status,
    });

    const { data, error } = await supabase
      .from("machines")
      .insert([
        {
          machine_id: machineId,
          machine_name: machineName,
          department,
          location,
          manufacturer,
          model,
          status,
        },
      ])
      .select();

    console.log("Returned Data:", data);
    console.log("Returned Error:", error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Machine Added Successfully!");

    window.location.reload();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Add Machine</h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <input
            placeholder="Machine ID"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
          />

          <input
            placeholder="Machine Name"
            value={machineName}
            onChange={(e) => setMachineName(e.target.value)}
          />

          <input
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            placeholder="Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />

          <input
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Running</option>
            <option>Maintenance</option>
            <option>Offline</option>
            <option>Idle</option>
          </select>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={handleSaveMachine}
          >
            Save Machine
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMachineModal;