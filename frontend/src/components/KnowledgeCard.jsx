import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function KnowledgeCard({ document, onDelete }) {

  const { role } = useAuth();

  return (

    <div className="knowledge-card">

      <div className="knowledge-card-header">

        <h3>{document.title}</h3>

        <span className="category-tag">
          {document.category}
        </span>

      </div>

      <p className="knowledge-description">
        {document.description}
      </p>

      <div className="knowledge-meta">

        <div>

          <strong>Uploaded By</strong>

          <p>{document.uploaded_by_name}</p>

        </div>

        <div>

          <strong>Date</strong>

          <p>
            {document.created_at
              ? new Date(document.created_at).toLocaleDateString()
              : "-"}
          </p>

        </div>

      </div>

      <div className="knowledge-actions">

        <Link
          to={`/knowledge/${document.id}`}
          className="view-btn"
        >
          👁 View Details
        </Link>

        <a
          href={document.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="download-btn"
        >
          📄 Open PDF
        </a>

        {(role === "Expert" || role === "Admin") && (

          <button
            className="delete-btn"
            onClick={() => onDelete(document.id)}
          >
            🗑 Delete
          </button>

        )}

      </div>

    </div>

  );
}

export default KnowledgeCard;