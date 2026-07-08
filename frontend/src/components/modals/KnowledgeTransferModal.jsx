import { useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";

import "../../styles/addMachineModal.css";

function KnowledgeTransferModal({ onClose, onSuccess }) {

  const { user } = useAuth();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState("Medium");

  const [saving, setSaving] = useState(false);

  async function submitRequest(e) {

    e.preventDefault();

    if (!title || !description) {
      alert("Please fill all fields.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("knowledge_transfer_requests")
      .insert([
        {
          title,
          description,
          priority,
          expert_id: user.id,
          status: "Pending",
        },
      ]);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Knowledge Transfer Request Submitted");

    onSuccess();

    onClose();

  }

  return (

    <div className="modal-overlay">

      <div className="modal-card">

        <div className="modal-header">

          <h2>Knowledge Transfer Request</h2>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        <form onSubmit={submitRequest}>

          <div className="modal-body">

            <input
              type="text"
              placeholder="Request Title"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />

            <textarea
              rows="6"
              placeholder="Describe the knowledge that needs to be transferred..."
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e)=>setPriority(e.target.value)}
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
                ? "Submitting..."
                : "Submit Request"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default KnowledgeTransferModal;