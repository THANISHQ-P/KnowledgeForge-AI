import KnowledgeCard from "../components/KnowledgeCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../styles/knowledgeLibrary.css";

function KnowledgeLibrary() {
  
  const { user, role } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKnowledge();
  }, []);

  useEffect(() => {
    searchKnowledge();
  }, [search, documents]);

  async function loadKnowledge() {

  setLoading(true);

  try {

    const res = await api.get("/knowledge");

    setDocuments(res.data || []);
    setFilteredDocuments(res.data || []);

  } catch (err) {

    console.error("Failed to load knowledge:", err);

  } finally {

    setLoading(false);

  }

}

  function searchKnowledge() {
    if (search.trim() === "") {
      setFilteredDocuments(documents);
      return;
    }

    const result = documents.filter((doc) => {
      return (
        doc.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        doc.category
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        doc.description
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        doc.uploaded_by_name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });

    setFilteredDocuments(result);
  }

  async function toggleFavorite(id, currentStatus) {

  await api.patch(`/knowledge/${id}/favorite`, {
    favorite: !currentStatus,
  });

  loadKnowledge();

}

  async function deleteDocument(id) {
    const answer = window.confirm(
      "Delete this document?"
    );

    if (!answer) return;

    const { error } = await api.delete(`/knowledge/${id}`);

    if (!error) {
      loadKnowledge();
    }
  }

  const canUpload = ["admin", "manager", "expert"].includes(
  role?.toLowerCase()
);
  return (

      <div className="knowledge-page">

        <div className="knowledge-header">

          <div>

            <h1>
              Knowledge Library
            </h1>

            <p>
              SOPs, Manuals, Work Instructions,
              Machine Guides and Technical Documents
            </p>

          </div>

         

       {canUpload && (
  <Link
    to="/upload-knowledge"
    className="upload-button"
  >
    + Upload Knowledge
  </Link>
)}

          

        </div>

        <div className="knowledge-search">

          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {loading ? (

          <div className="loading-box">

            Loading Knowledge Library...

          </div>

        ) : filteredDocuments.length === 0 ? (

          <div className="empty-box">

            <h2>No Documents Found</h2>

            <p>

              Experts haven't uploaded any
              knowledge yet.

            </p>

          </div>

        ) : (

          <div className="knowledge-grid-container">
            <div className="knowledge-grid">
              {filteredDocuments.map((doc) => (
                <KnowledgeCard
                  key={doc.id}
                  item={doc}
                  onDelete={deleteDocument}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>

        )}

      </div>


  );
}

export default KnowledgeLibrary;