import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

import UpdateCard from "../components/UpdateCard";

import AnnouncementModal from "../components/modals/AnnouncementModal";
import MaintenanceModal from "../components/modals/MaintenanceModal";
import KnowledgeTransferModal from "../components/modals/KnowledgeTransferModal";

import "../styles/updates.css";

function Updates() {

  const { role } = useAuth();

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAnnouncementModal, setShowAnnouncementModal] =
    useState(false);

  const [showMaintenanceModal, setShowMaintenanceModal] =
    useState(false);

  const [showKnowledgeModal, setShowKnowledgeModal] =
    useState(false);

  useEffect(() => {
    loadUpdates();
  }, [role]);

  async function loadUpdates() {

    setLoading(true);

    let table = "";

    switch (role) {

      case "Employee":
        table = "company_announcements";
        break;

      case "Expert":
        table = "knowledge_transfer_requests";
        break;

      case "Manager":
        table = "maintenance_tasks";
        break;

      case "Admin":
        table = "company_announcements";
        break;

      default:
        table = "company_announcements";

    }

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {

      console.error(error);

    } else {

      setUpdates(data || []);

    }

    setLoading(false);

  }

  return (

    <AppLayout>

      <div className="updates-page">

        <div className="updates-header">

          <div>

            <h1>Updates</h1>

            <p>

              {role === "Employee" &&
                "Company announcements, SOP updates and maintenance notifications."}

              {role === "Expert" &&
                "Knowledge transfer requests assigned to experts."}

              {role === "Manager" &&
                "Machine maintenance tasks."}

              {role === "Admin" &&
                "Company announcements and employee management."}

            </p>

          </div>

          <div style={{ display: "flex", gap: "10px" }}>

            {role === "Admin" && (

              <button
                className="action-btn"
                onClick={() =>
                  setShowAnnouncementModal(true)
                }
              >
                + New Announcement
              </button>

            )}

            {role === "Manager" && (

              <button
                className="action-btn"
                onClick={() =>
                  setShowMaintenanceModal(true)
                }
              >
                + Assign Maintenance
              </button>

            )}

            {role === "Expert" && (

              <button
                className="action-btn"
                onClick={() =>
                  setShowKnowledgeModal(true)
                }
              >
                + Knowledge Transfer
              </button>

            )}

          </div>

        </div>

        {loading ? (

          <div className="loading-box">

            <h2>Loading...</h2>

          </div>

        ) : updates.length === 0 ? (

          <div className="empty-box">

            <h2>No Updates Available</h2>

            <p>

              There are currently no updates for your role.

            </p>

          </div>

        ) : (

          <div className="updates-grid">

            {updates.map((item) => (

              <UpdateCard
                key={item.id}
                update={item}
                role={role}
              />

            ))}

          </div>

        )}

      </div>

      {showAnnouncementModal && (

        <AnnouncementModal
          onClose={() =>
            setShowAnnouncementModal(false)
          }
          onSuccess={loadUpdates}
        />

      )}

      {showMaintenanceModal && (

        <MaintenanceModal
          onClose={() =>
            setShowMaintenanceModal(false)
          }
          onSuccess={loadUpdates}
        />

      )}

      {showKnowledgeModal && (

        <KnowledgeTransferModal
          onClose={() =>
            setShowKnowledgeModal(false)
          }
          onSuccess={loadUpdates}
        />

      )}

    </AppLayout>

  );

}

export default Updates;