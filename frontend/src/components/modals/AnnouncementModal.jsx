import { useState } from "react";
import { supabase } from "../../services/supabase";

import "../../styles/AddMachineModal.css";

function AnnouncementModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("Normal");

  const [saving, setSaving] = useState(false);

  async function saveAnnouncement(e) {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Please fill all fields.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("company_announcements")
      .insert([
        {
          title: title.trim(),
          message: message.trim(),
          priority: priority,
        },
      ]);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Announcement published successfully.");

    if (onSuccess) {
      onSuccess();
    }

    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <div className="modal-header">
          <h2>New Announcement</h2>

          <button
            type="button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={saveAnnouncement}>

          <div className="modal-body">

            <input
              type="text"
              placeholder="Announcement Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              rows="6"
              placeholder="Announcement Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
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
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving ? "Publishing..." : "Publish"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AnnouncementModal;