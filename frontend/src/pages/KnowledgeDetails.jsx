import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/knowledgeDetails.css";

function KnowledgeDetails() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResource();
  }, []);

  async function loadResource() {
    try {
      const res = await api.get(`/knowledge/${id}`);
      setItem(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="details-page">
        <h2>Loading Resource...</h2>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="details-page">
        <h2>Resource Not Found</h2>
      </div>
    );
  }

  return (
    <div className="details-page">

      <Link to="/knowledge-library" className="back-btn">
        ← Back to Knowledge Library
      </Link>

      <div className="details-container">

        <div className="details-card">

        <h1>{item.title}</h1>

        <span className="status approved">
          {item.status}
        </span>

        <hr />

        <h2>📄 Resource Information</h2>

        <div className="info-grid">

          <p><strong>Machine :</strong> {item.machine_name || "-"}</p>

          <p><strong>Department :</strong> {item.department || "-"}</p>

          <p><strong>Category :</strong> {item.category || "-"}</p>

          <p><strong>Uploaded By :</strong> {item.uploaded_by || "-"}</p>

          <p><strong>Role :</strong> {item.uploaded_by_role || "-"}</p>

          <p>
            <strong>Uploaded At :</strong>{" "}
            {new Date(item.created_at).toLocaleDateString()}
          </p>

          <p><strong>Status :</strong> {item.status}</p>

          <p>
            <strong>Favorite :</strong>{" "}
            {item.is_favorite ? "⭐ Yes" : "☆ No"}
          </p>

        </div>

      </div>
        <hr />

        <h2>🤖 AI Summary</h2>

        <p>{item.summary || "No Summary Available."}</p>

        <hr />

        <h2>🏷 Keywords</h2>

        <div className="keyword-box">
          {(item.keywords || "")
            .split(",")
            .filter(Boolean)
            .map((key, index) => (
              <span key={index} className="keyword">
                {key.trim()}
              </span>
            ))}
        </div>

        <hr />

        <h2>📘 Standard Operating Procedure</h2>

        <p>{item.sop || "Not Available"}</p>

        <hr />

        <h2>🔧 Repair Steps</h2>

        <p>{item.repair_steps || "Not Available"}</p>

        <hr />

        <h2>🦺 Safety Checklist</h2>

        <p>{item.safety_checklist || "Not Available"}</p>

        <hr />

        <h2>🛠 Required Tools</h2>

        <p>{item.required_tools || "Not Available"}</p>

        <hr />

        <h2>⏱ Estimated Time</h2>

        <p>{item.estimated_time || "Not Available"}</p>

        <hr />

        <div className="action-buttons">

          <a
            href={item.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-btn"
          >
            📄 Open PDF
          </a>

          <a
            href={item.file_url}
            download
            className="download-btn"
          >
            ⬇ Download
          </a>

        </div>

      </div>

    </div>
  );
}

export default KnowledgeDetails;