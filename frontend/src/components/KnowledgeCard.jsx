import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function KnowledgeCard({ document, onDelete }) {
  const { role } = useAuth();

  return (
    <div className="knowledge-card">

      <div className="knowledge-top">

        <span className="knowledge-category">
          {document.category || "General"}
        </span>

      </div>

      <h2>{document.title}</h2>

      <p className="knowledge-description">
        {document.description}
      </p>

      <div className="knowledge-meta">

        <span>
          👤 {document.uploaded_by_name || "Unknown"}
        </span>

        <span>
          📅{" "}
          {new Date(document.created_at).toLocaleDateString()}
        </span>

      </div>

      <div className="knowledge-actions">

        <a
          href={document.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="view-button"
        >
          View PDF
        </a>

        <Link
          to={`/knowledge/${document.id}`}
          className="details-button"
        >
          Details
        </Link>

        {(role === "Admin" ||
          role === "Manager") && (
          <button
            className="delete-button"
            onClick={() => onDelete(document.id)}
          >
            Delete
          </button>
        )}

      </div>

    </div>
  );
}

export default KnowledgeCard;