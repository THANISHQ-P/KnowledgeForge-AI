import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function KnowledgeCard({ item, onDelete, toggleFavorite }) {

  const { role } = useAuth();

  return (

    <div className="knowledge-card">

      <div className="knowledge-card-header">

        <h3>{item.title}</h3>

      </div>

      <div className="knowledge-info">

        <p>
          <strong>Machine :</strong> {item.machine_name || "-"}
        </p>

        <p>
          <strong>Expert :</strong> {item.uploaded_by || "-"}
        </p>

        <p>
          <strong>Uploaded At :</strong>{" "}
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : "-"}
        </p>

        <p>
          <strong>Uploaded By :</strong> {item.uploaded_by || "-"}
        </p>

        <p>
          <strong>Status :</strong> {item.status || "Pending"}
        </p>

        <p>
          <strong>Favorite :</strong>{" "}
          {item.is_favorite ? "⭐ Yes" : "☆ No"}
        </p>

      </div>

      <div className="knowledge-actions">

        <Link
          to={`/knowledge/${item.id}`}
          className="view-btn"
        >
          👁 View Details
        </Link>

        <a
          href={item.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="pdf-btn"
        >
          📄 View PDF
        </a>

        <a
          href={item.file_url}
          download={item.file_name}
          className="download-btn"
        >
          ⬇ Download
        </a>

        <button
          className="favorite-btn"
          onClick={() =>
            toggleFavorite(item.id, item.is_favorite)
          }
        >
          {item.is_favorite ? "⭐ Unfavorite" : "☆ Favorite"}
        </button>

        {(role === "Expert" || role === "Admin") && (
          <button
          
            className="delete-btn"
            onClick={() => onDelete(item.id)}
          >
            🗑 Delete
          </button>
        )}

      </div>

    </div>

  );

}

export default KnowledgeCard;