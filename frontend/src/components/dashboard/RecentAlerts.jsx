import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

import "../../styles/recentAlerts.css";

function RecentAlerts() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    setLoading(true);

    const { data, error } = await supabase
      .from("company_announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error) {
      setAnnouncements(data || []);
    }

    setLoading(false);
  }

  return (
    <div className="recent-alerts">

      <h2>Recent Updates</h2>

      {loading ? (

        <div className="recent-empty">
          Loading updates...
        </div>

      ) : announcements.length === 0 ? (

        <div className="recent-empty">
          No updates available.
        </div>

      ) : (

        <div className="recent-list">

          {announcements.map((item) => (

            <div
              key={item.id}
              className="recent-item"
            >

              <div className="recent-top">

                <h3>{item.title}</h3>

                <span className={`priority ${item.priority?.toLowerCase()}`}>
                  {item.priority}
                </span>

              </div>

              <p>{item.message}</p>

              <small>
                {new Date(item.created_at).toLocaleDateString()}
              </small>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default RecentAlerts;