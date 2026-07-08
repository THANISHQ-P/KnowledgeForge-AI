import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../services/supabase";

import "../styles/knowledgeDetails.css";

function KnowledgeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [knowledge, setKnowledge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKnowledge();
  }, []);

  async function loadKnowledge() {
    setLoading(true);

    const { data, error } = await supabase
      .from("knowledge_library")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error loading knowledge:", error);
      setLoading(false);
      return;
    }

    setKnowledge(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="details-page">
          <h2>Loading document...</h2>
        </div>
      </AppLayout>
    );
  }

  if (!knowledge) {
    return (
      <AppLayout>
        <div className="details-page">
          <div className="details-card">
            <h2>Document not found</h2>

            <button
              className="back-btn"
              onClick={() => navigate("/knowledge-library")}
            >
              ← Back to Library
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="details-page">
        <div className="details-card">
          <h1>{knowledge.title}</h1>

          <span className="category-badge">
            {knowledge.category || "General"}
          </span>

          <div className="details-section">
            <h3>Description</h3>

            <p>
              {knowledge.description ||
                "No description available."}
            </p>
          </div>

          <div className="details-grid">
            <div>
              <strong>Uploaded By</strong>

              <p>
                {knowledge.uploaded_by_name ||
                  "Unknown User"}
              </p>
            </div>

            <div>
              <strong>Role</strong>

              <p>{knowledge.role || "Employee"}</p>
            </div>

            <div>
              <strong>Upload Date</strong>

              <p>
                {knowledge.created_at
                  ? new Date(
                      knowledge.created_at
                    ).toLocaleDateString()
                  : "Not Available"}
              </p>
            </div>
          </div>

          <div className="details-buttons">
            {knowledge.file_url && (
              <>
                <a
                  href={knowledge.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-btn"
                >
                  📄 View PDF
                </a>

                <a
                  href={knowledge.file_url}
                  download
                  className="download-btn"
                >
                  ⬇ Download
                </a>
              </>
            )}

            <button
              className="back-btn"
              onClick={() =>
                navigate("/knowledge-library")
              }
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default KnowledgeDetails;