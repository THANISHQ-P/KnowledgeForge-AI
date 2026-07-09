import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  FaBook,
  FaIndustry,
  FaBuilding,
  FaCalendarAlt,
  FaUserTie,
  FaCheckCircle,
  FaClock,
  FaHeart,
  FaRegHeart,
  FaEye,
  FaDownload,
  FaFilePdf,
  FaTrash,
} from "react-icons/fa";

function KnowledgeCard({
  item,
  onDelete,
  toggleFavorite,
}) {
  const { role } = useAuth();

  const status =
    item.status || "Pending";

  const category =
    item.category || "Document";

  return (
    <div className="knowledge-card">

      {/* Category */}

      <div className="knowledge-card-top">

        <span className="category-badge">
          {category}
        </span>

        <button
          className="favorite-icon"
          onClick={() =>
            toggleFavorite(
              item.id,
              item.is_favorite
            )
          }
        >
          {item.is_favorite ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
        </button>

      </div>

      {/* Title */}

      <h2 className="knowledge-title">
        {item.title}
      </h2>

      {/* Information */}

      <div className="knowledge-info">

        <div className="info-row">

          <FaIndustry />

          <span>
            {item.machine_name ||
              "No Machine"}
          </span>

        </div>

        <div className="info-row">

          <FaBuilding />

          <span>
            {item.department ||
              "General"}
          </span>

        </div>

        <div className="info-row">

          <FaUserTie />

          <span>
            {item.uploaded_by ||
              "Unknown"}
          </span>

        </div>

        <div className="info-row">

          <FaCalendarAlt />

          <span>

            {item.created_at
              ? new Date(
                  item.created_at
                ).toLocaleDateString()
              : "-"}

          </span>

        </div>

      </div>

      {/* Description */}

      <p className="knowledge-description">

        {item.description
          ? item.description.substring(
              0,
              120
            ) + "..."
          : "No description available."}

      </p>

      {/* Footer */}

      <div className="knowledge-footer">

        <div
          className={`status-pill ${status.toLowerCase()}`}
        >
          {status === "Approved" ? (
            <FaCheckCircle />
          ) : (
            <FaClock />
          )}

          {status}

        </div>

      </div>

      {/* Actions */}

      <div className="knowledge-actions">

        <Link
          to={`/knowledge/${item.id}`}
          className="action-btn primary"
        >
          <FaEye />

          View

        </Link>

        <a
          href={item.file_url}
          target="_blank"
          rel="noreferrer"
          className="action-btn secondary"
        >
          <FaFilePdf />

          PDF

        </a>

        <a
          href={item.file_url}
          download={item.file_name}
          className="action-btn success"
        >
          <FaDownload />

          Download

        </a>

        {(role === "Admin" ||
          role === "Expert") && (

          <button
            className="action-btn danger"
            onClick={() =>
              onDelete(item.id)
            }
          >
            <FaTrash />

            Delete

          </button>

        )}

      </div>

    </div>
  );
}

export default KnowledgeCard;