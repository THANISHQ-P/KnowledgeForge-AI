import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import "../../styles/addMachineModal.css";

function MaintenanceModal({ onClose, onSuccess }) {

  const [machines, setMachines] = useState([]);

  const [machineId, setMachineId] = useState("");

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState("Medium");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMachines();
  }, []);

  async function loadMachines() {

    const { data } = await supabase
      .from("machines")
      .select("*")
      .order("machine_name");

    setMachines(data || []);

  }

  async function saveTask(e) {

    e.preventDefault();

    if (
      !machineId ||
      !title ||
      !description
    ) {
      alert("Please fill all fields.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("maintenance_tasks")
      .insert([
        {
          machine_id: machineId,
          title,
          description,
          priority,
          status: "Pending",
        },
      ]);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Maintenance Task Created");

    onSuccess();

    onClose();

  }

  return (

    <div className="modal-overlay">

      <div className="modal-card">

        <div className="modal-header">

          <h2>Assign Maintenance</h2>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        <form onSubmit={saveTask}>

          <div className="modal-body">

            <select
              value={machineId}
              onChange={(e)=>
                setMachineId(e.target.value)
              }
            >

              <option value="">
                Select Machine
              </option>

              {machines.map((machine)=>(

                <option
                  key={machine.id}
                  value={machine.machine_id}
                >

                  {machine.machine_name}

                </option>

              ))}

            </select>

            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e)=>
                setTitle(e.target.value)
              }
            />

            <textarea
              rows="5"
              placeholder="Task Description..."
              value={description}
              onChange={(e)=>
                setDescription(e.target.value)
              }
            />

            <select
              value={priority}
              onChange={(e)=>
                setPriority(e.target.value)
              }
            >

              <option>Low</option>

              <option>Medium</option>

              <option>High</option>

            </select>

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
              className="save-btn"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Assign Task"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default MaintenanceModal;