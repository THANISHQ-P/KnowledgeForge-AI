import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../services/supabase";

import "../styles/knowledgeDetails.css";

function KnowledgeDetails() {

  const { id } = useParams();

  const [document, setDocument] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocument();
  }, []);

  async function loadDocument() {

    const { data, error } = await supabase
      .from("knowledge_library")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setDocument(data);

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

  if (!document) {

    return (

      <AppLayout>

        <div className="details-page">

          <h2>Document Not Found</h2>

        </div>

      </AppLayout>

    );

  }

  return (

    <AppLayout>

      <div className="details-page">

        <div className="details-card">

          <div className="details-header">

            <div>

              <h1>{document.title}</h1>

              <span className="category-badge">

                {document.category}

              </span>

            </div>
                      </div>

          <div className="details-content">

            <h3>Description</h3>

            <p>
              {document.description}
            </p>

            <div className="details-info">

              <div className="info-card">

                <h4>Uploaded By</h4>

                <p>
                  {document.uploaded_by_name}
                </p>

              </div>

              <div className="info-card">

                <h4>Role</h4>

                <p>
                  {document.role}
                </p>

              </div>

              <div className="info-card">

                <h4>Uploaded On</h4>

                <p>
                  {new Date(
                    document.created_at
                  ).toLocaleDateString()}
                </p>

              </div>

            </div>

            <div className="details-buttons">

              <a
                href={document.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="view-btn"
              >
                📄 View PDF
              </a>

              <a
                href={document.file_url}
                download
                className="download-btn"
              >
                ⬇ Download
              </a>

              <Link
                to="/knowledge-library"
                className="back-btn"
              >
                ← Back
              </Link>

            </div>

          </div>

        </div>

      </div>

    </AppLayout>

  );

}

export default KnowledgeDetails;