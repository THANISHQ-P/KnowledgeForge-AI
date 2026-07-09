import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaIndustry,
  FaBuilding,
  FaFolderOpen,
  FaUserTie,
  FaCalendarAlt,
  FaCheckCircle,
  FaRobot,
  FaClipboardList,
  FaTools,
  FaShieldAlt,
  FaClock,
  FaFilePdf,
  FaDownload,
  FaTags,
} from "react-icons/fa";

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

      <div className="details-loading">

        <h2>Loading Knowledge Resource...</h2>

      </div>

    );

  }

  if (!item) {

    return (

      <div className="details-loading">

        <h2>Knowledge Resource Not Found</h2>

      </div>

    );

  }

  const keywords =
    (item.keywords || "")
      .split(",")
      .filter(Boolean);

  const approved =
    item.status === "Approved";
      return (

    <div className="knowledge-details-page">

      {/* ===========================
          BACK BUTTON
      ============================ */}

      <div className="details-top">

        <Link
          to="/knowledge-library"
          className="back-btn"
        >
          <FaArrowLeft />
          Back to Knowledge Library
        </Link>

      </div>

      {/* ===========================
          HERO
      ============================ */}

      <section className="details-hero">

        <div>

          <h1>{item.title}</h1>

          <p>
            AI-powered industrial knowledge resource for maintenance,
            troubleshooting, SOPs and expert guidance.
          </p>

        </div>

        <span
          className={`status-badge ${
            approved ? "approved" : "pending"
          }`}
        >
          <FaCheckCircle />
          {item.status}
        </span>

      </section>

      {/* ===========================
          RESOURCE INFORMATION
      ============================ */}

      <section className="details-card">

        <div className="card-title">

          <FaIndustry />

          <h2>Resource Information</h2>

        </div>

        <div className="resource-grid">

          <div className="resource-item">

            <FaIndustry />

            <div>

              <span>Machine</span>

              <strong>{item.machine_name || "-"}</strong>

            </div>

          </div>

          <div className="resource-item">

            <FaBuilding />

            <div>

              <span>Department</span>

              <strong>{item.department || "-"}</strong>

            </div>

          </div>

          <div className="resource-item">

            <FaFolderOpen />

            <div>

              <span>Category</span>

              <strong>{item.category || "-"}</strong>

            </div>

          </div>

          <div className="resource-item">

            <FaUserTie />

            <div>

              <span>Uploaded By</span>

              <strong>{item.uploaded_by || "-"}</strong>

            </div>

          </div>

          

          <div className="resource-item">

            <FaCalendarAlt />

            <div>

              <span>Uploaded On</span>

              <strong>
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString()
                  : "-"}
              </strong>

            </div>

          </div>

        </div>

      </section>

      {/* ===========================
          AI SUMMARY
      ============================ */}

      <section className="details-card">

        <div className="card-title">

          <FaRobot />

          <h2>AI Summary</h2>

        </div>

        <p className="summary-text">

          {item.summary ||
            "No AI summary available for this document."}

        </p>

      </section>

      {/* ===========================
          KEYWORDS
      ============================ */}

      <section className="details-card">

        <div className="card-title">

          <FaTags />

          <h2>Keywords</h2>

        </div>

        <div className="keyword-box">

          {keywords.length === 0 ? (

            <p>No Keywords Available</p>

          ) : (

            keywords.map((key, index) => (

              <span
                key={index}
                className="keyword"
              >
                {key.trim()}
              </span>

            ))

          )}

        </div>

      </section>

      {/* ===========================
          SOP
      ============================ */}

      <section className="details-card">

        <div className="card-title">

          <FaClipboardList />

          <h2>Standard Operating Procedure</h2>

        </div>

        <p>

          {item.sop || "Not Available"}

        </p>

      </section>

      {/* ===========================
          REPAIR STEPS
      ============================ */}

      <section className="details-card">

        <div className="card-title">

          <FaTools />

          <h2>Repair Steps</h2>

        </div>

        <p>

          {item.repair_steps || "Not Available"}

        </p>

      </section>

      {/* ===========================
          SAFETY
      ============================ */}

      <section className="details-card">

        <div className="card-title">

          <FaShieldAlt />

          <h2>Safety Checklist</h2>

        </div>

        <p>

          {item.safety_checklist || "Not Available"}

        </p>

      </section>

      {/* ===========================
          TOOLS
      ============================ */}

      <section className="details-card">

        <div className="card-title">

          <FaTools />

          <h2>Required Tools</h2>

        </div>

        <p>

          {item.required_tools || "Not Available"}

        </p>

      </section>

      {/* ===========================
          ESTIMATED TIME
      ============================ */}

      <section className="details-card">

        <div className="card-title">

          <FaClock />

          <h2>Estimated Time</h2>

        </div>

        <p>

          {item.estimated_time || "Not Available"}

        </p>

      </section>

      {/* ===========================
          ACTION BUTTONS
      ============================ */}

      <div className="details-actions">

        <a
          href={item.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="pdf-btn"
        >
          <FaFilePdf />
          Open PDF
        </a>

        <a
          href={item.file_url}
          download
          className="download-btn"
        >
          <FaDownload />
          Download
        </a>

      </div>

    </div>

  );

}

export default KnowledgeDetails;
