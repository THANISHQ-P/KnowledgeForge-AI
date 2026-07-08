import "./UpdateCard.css";

function UpdateCard({ update, role }) {
  return (
    <div className="update-card">

      <div className="update-top">

        <span className="update-role">
          {role}
        </span>

        <span className="update-date">
          {new Date(update.created_at).toLocaleDateString()}
        </span>

      </div>

      <h2>
        {update.title || "Untitled"}
      </h2>

      <p className="update-description">
        {update.description ||
          update.reason ||
          "No description available."}
      </p>

      {update.status && (

        <div className="status-box">

          Status :
          <span className="status-text">

            {" "}
            {update.status}

          </span>

        </div>

      )}

    </div>
  );
}

export default UpdateCard;