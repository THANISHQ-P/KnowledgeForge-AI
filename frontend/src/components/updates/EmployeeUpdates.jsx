import { useEffect, useState } from "react";
import "../../styles/Updates.css";
import { supabase } from "../../services/supabase";

function EmployeeUpdates({ userProfile }) {
  const [announcements, setAnnouncements] = useState([]);
  const [sops, setSops] = useState([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEmployeeUpdates() {
      setLoading(true);
      setError(null);

      try {
        const [announcementsResponse, sopsResponse, maintenanceResponse] = await Promise.all([
          supabase
            .from("company_announcements")
            .select("id, title, summary, published_at")
            .order("published_at", { ascending: false })
            .limit(6),
          supabase
            .from("sops")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(6),
          supabase
            .from("maintenance_tasks")
            .select("id, machine_name, status, due_date, description")
            .eq("employee_id", userProfile?.id)
            .order("due_date", { ascending: true })
            .limit(8),
        ]);

        if (announcementsResponse.error) throw announcementsResponse.error;
        if (sopsResponse.error) throw sopsResponse.error;
        if (maintenanceResponse.error) throw maintenanceResponse.error;

        setAnnouncements(announcementsResponse.data ?? []);
        setSops(sopsResponse.data ?? []);
        setMaintenanceTasks(maintenanceResponse.data ?? []);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load updates.");
      } finally {
        setLoading(false);
      }
    }

    if (userProfile?.id) {
      loadEmployeeUpdates();
    }
  }, [userProfile]);

  const formatDate = (value) => {
    try {
      return new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="updates-page">
      <div className="updates-header">
        <div>
          <h1>👨‍🔧 Employee</h1>
          <p>Company announcements, new SOPs, and machine maintenance notifications.</p>
        </div>
        <span className="updates-role-badge">EMPLOYEE</span>
      </div>

      {loading ? (
        <div className="updates-loading-card">
          <span className="loading-dot"></span>
          <p>Loading employee updates...</p>
        </div>
      ) : error ? (
        <div className="updates-error-card">
          <h3>Error loading updates</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className="updates-grid">
          <section className="updates-section-card">
            <div className="section-head">
              <div>
                <h2>Company Announcements</h2>
                <p>Latest news that impacts your day-to-day operations.</p>
              </div>
              <span className="section-count">{announcements.length}</span>
            </div>

            {announcements.length === 0 ? (
              <div className="updates-empty-state">
                <p>No announcements found. Check back later for company updates.</p>
              </div>
            ) : (
              <div className="updates-list">
                {announcements.map((announcement) => (
                  <article key={announcement.id} className="updates-list-item">
                    <div>
                      <h3>{announcement.title}</h3>
                      <p>{announcement.summary}</p>
                    </div>
                    <time>{formatDate(announcement.published_at)}</time>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="updates-section-card">
            <div className="section-head">
              <div>
                <h2>New SOPs</h2>
                <p>Recent standard operating procedures published for your team.</p>
              </div>
              <span className="section-count">{sops.length}</span>
            </div>

            {sops.length === 0 ? (
              <div className="updates-empty-state">
                <p>No SOPs published yet. Your manager may add new procedures soon.</p>
              </div>
            ) : (
              <div className="updates-list">
                {sops.map((sop) => (
                  <article key={sop.id} className="updates-list-item">
                    <div>
                      <h3>{sop.title}</h3>
                      <p>{sop.summary || sop.description || "No description available."}</p>
                    </div>
                    <time>{formatDate(sop.created_at)}</time>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="updates-section-card full-width">
            <div className="section-head">
              <div>
                <h2>Machine Maintenance Notifications</h2>
                <p>Tasks assigned to you for the next maintenance cycle.</p>
              </div>
              <span className="section-count">{maintenanceTasks.length}</span>
            </div>

            {maintenanceTasks.length === 0 ? (
              <div className="updates-empty-state">
                <p>You have no assigned maintenance tasks at this time.</p>
              </div>
            ) : (
              <div className="updates-table-wrapper">
                <table className="updates-table">
                  <thead>
                    <tr>
                      <th>Machine</th>
                      <th>Description</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceTasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.machine_name || "Unknown Machine"}</td>
                        <td>{task.description || "No description provided."}</td>
                        <td>{formatDate(task.due_date)}</td>
                        <td>{task.status || "Pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default EmployeeUpdates;
