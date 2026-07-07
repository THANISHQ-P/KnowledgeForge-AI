import KnowledgeCard from "../components/KnowledgeCard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

import "../styles/knowledgeLibrary.css";

function KnowledgeLibrary() {
  const { role } = useAuth();

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

    const { data, error } = await supabase
      .from("knowledge_library")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setDocuments(data);
    setFilteredDocuments(data);

    setLoading(false);
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

  async function deleteDocument(id) {
    const answer = window.confirm(
      "Delete this document?"
    );

    if (!answer) return;

    const { error } = await supabase
      .from("knowledge_library")
      .delete()
      .eq("id", id);

    if (!error) {
      loadKnowledge();
    }
  }

  return (
    <AppLayout>

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

          {(role === "Expert" ||
            role === "Manager" ||
            role === "Admin") && (

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

          <div className="knowledge-grid">
                       {filteredDocuments.map((doc) => (
  <KnowledgeCard
    key={doc.id}
    document={doc}
    onDelete={deleteDocument}
  />
))}

          </div>

        )}

      </div>

    </AppLayout>

  );
}

export default KnowledgeLibrary;