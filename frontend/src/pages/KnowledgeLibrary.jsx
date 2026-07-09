import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaBookOpen,
  FaFileAlt,
  FaTools,
  FaStar,
  FaUpload,
} from "react-icons/fa";

import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

import KnowledgeCard from "../components/KnowledgeCard";

import "../styles/knowledgeLibrary.css";

function KnowledgeLibrary() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const canUpload = [
    "admin",
    "manager",
    "expert",
  ].includes(role?.toLowerCase());

  useEffect(() => {
    loadKnowledge();
  }, []);

  useEffect(() => {
    filterKnowledge();
  }, [
    search,
    selectedCategory,
    documents,
  ]);

  async function loadKnowledge() {
    setLoading(true);

    try {
      const res = await api.get("/knowledge");

      setDocuments(res.data || []);
      setFilteredDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  function filterKnowledge() {
    let data = [...documents];

    if (selectedCategory !== "All") {
      data = data.filter(
        (doc) =>
          doc.category === selectedCategory
      );
    }

    if (search.trim()) {
      const text = search.toLowerCase();

      data = data.filter(
        (doc) =>
          doc.title
            ?.toLowerCase()
            .includes(text) ||
          doc.machine_name
            ?.toLowerCase()
            .includes(text) ||
          doc.department
            ?.toLowerCase()
            .includes(text) ||
          doc.category
            ?.toLowerCase()
            .includes(text)
      );
    }

    setFilteredDocuments(data);
  }

  async function toggleFavorite(
    id,
    current
  ) {
    await api.patch(
      `/knowledge/${id}/favorite`,
      {
        favorite: !current,
      }
    );

    loadKnowledge();
  }

  async function deleteDocument(id) {
    const ok = window.confirm(
      "Delete this document?"
    );

    if (!ok) return;

    await api.delete(`/knowledge/${id}`);

    loadKnowledge();
  }

  const totalDocuments = documents.length;

  const totalFavorites =
    documents.filter(
      (d) => d.is_favorite
    ).length;

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        documents
          .map((d) => d.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...unique];
  }, [documents]);

  const totalCategories =
    categories.length - 1;
      return (
        
    <div className="knowledge-page">

      
      {/* ================= HERO ================= */}

      <section className="knowledge-hero">

        <div>

          <div className="library-top">

    <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
    >
        <FaArrowLeft />
        Dashboard
    </button>

</div>
          <span className="hero-tag">
            Enterprise Knowledge Hub
          </span>

          <h1>Knowledge Library</h1>

          <p>
            Store, organize and access SOPs, Manuals,
            Work Instructions, Machine Guides and
            Technical Documents from one centralized
            industrial knowledge repository.
          </p>

        </div>

        {canUpload && (

          <Link
            to="/upload-knowledge"
            className="upload-button"
          >
            <FaUpload />

            Upload Knowledge

          </Link>

        )}

      </section>

      {/* ================= STATS ================= */}

      <section className="knowledge-stats">

        <div className="knowledge-stat-card">

          <div className="stat-icon blue">

            <FaBookOpen />

          </div>

          <div>

            <h2>{totalDocuments}</h2>

            <p>Total Documents</p>

          </div>

        </div>

        <div className="knowledge-stat-card">

          <div className="stat-icon purple">

            <FaFileAlt />

          </div>

          <div>

            <h2>{totalCategories}</h2>

            <p>Categories</p>

          </div>

        </div>

        <div className="knowledge-stat-card">

          <div className="stat-icon green">

            <FaTools />

          </div>

          <div>

            <h2>

              {
                documents.filter(
                  (doc) => doc.status === "Approved"
                ).length
              }

            </h2>

            <p>Approved Files</p>

          </div>

        </div>

        <div className="knowledge-stat-card">

          <div className="stat-icon orange">

            <FaStar />

          </div>

          <div>

            <h2>{totalFavorites}</h2>

            <p>Favorites</p>

          </div>

        </div>

      </section>

      {/* ================= SEARCH ================= */}

      <section className="knowledge-toolbar">

        <div className="search-box">

          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search knowledge, manuals, SOPs, machine guides..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </section>

      {/* ================= CATEGORY FILTER ================= */}

      <section className="category-filter">

        {categories.map((cat) => (

          <button
            key={cat}
            className={
              selectedCategory === cat
                ? "category-chip active"
                : "category-chip"
            }
            onClick={() =>
              setSelectedCategory(cat)
            }
          >
            {cat}
          </button>

        ))}

      </section>
            {/* ================= CONTENT ================= */}

      {loading ? (

        <div className="loading-box">
          Loading Knowledge Library...
        </div>

      ) : filteredDocuments.length === 0 ? (

        <div className="empty-box">

          <FaBookOpen
            style={{
              fontSize: "60px",
              color: "#3B82F6",
              marginBottom: "20px",
            }}
          />

          <h2>No Knowledge Found</h2>

          <p>
            No documents match your search or filter.
            Upload SOPs, manuals and technical documents
            to start building your industrial knowledge base.
          </p>

          {canUpload && (

            <Link
              to="/upload-knowledge"
              className="upload-button"
              style={{
                width: "fit-content",
                margin: "30px auto 0",
              }}
            >
              <FaUpload />
              Upload First Document
            </Link>

          )}

        </div>

      ) : (

        <section className="knowledge-grid">

          {filteredDocuments.map((doc) => (

            <KnowledgeCard
              key={doc.id}
              item={doc}
              onDelete={deleteDocument}
              toggleFavorite={toggleFavorite}
            />

          ))}

        </section>

      )}

    </div>
  );
}

export default KnowledgeLibrary;