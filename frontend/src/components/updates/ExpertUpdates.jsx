import { useEffect, useState } from "react";
import "../../styles/Updates.css";
import {
  fetchSops,
  fetchKnowledgeTransferRequestsByExpert,
  fetchResignationRequestsByExpert,
  uploadSopFile,
  insertSop,
  createKnowledgeArticle,
} from "../../services/updatesService";

function ExpertUpdates({ userProfile }) {
  const [requests, setRequests] = useState([]);
  const [sops, setSops] = useState([]);
  const [resignationRequests, setResignationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [newSop, setNewSop] = useState({
    title: "",
    summary: "",
    file: null,
  });

  const [knowledgeArticle, setKnowledgeArticle] = useState({
    resignationRequestId: "",
    title: "",
    summary: "",
    content: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const [
          sopResponse,
          requestResponse,
          resignationResponse,
        ] = await Promise.all([
          fetchSops(6),
          fetchKnowledgeTransferRequestsByExpert(userProfile?.id),
          fetchResignationRequestsByExpert(userProfile?.id),
        ]);

        if (sopResponse.error)
          throw new Error(sopResponse.error.message);

        if (requestResponse.error)
          throw new Error(requestResponse.error.message);

        if (resignationResponse.error)
          throw new Error(resignationResponse.error.message);

        setSops(sopResponse.data || []);
        setRequests(requestResponse.data || []);
        setResignationRequests(resignationResponse.data || []);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    }

    if (userProfile?.id) loadData();
  }, [userProfile]);

  async function handleSopSubmit(e) {
    e.preventDefault();

    setUploading(true);
    setError(null);

    try {
      if (!newSop.title || !newSop.summary || !newSop.file)
        throw new Error("Fill all SOP fields.");

      const upload = await uploadSopFile(newSop.file);

      if (upload.error)
        throw new Error(upload.error.message);

      const result = await insertSop({
        title: newSop.title,
        summary: newSop.summary,
        document_url: upload.publicUrl,
        created_by: userProfile.id,
      });

      if (result.error)
        throw new Error(result.error.message);

      setSuccessMessage("SOP uploaded successfully.");

      setNewSop({
        title: "",
        summary: "",
        file: null,
      });

      if (result.data?.length)
        setSops((prev) => [result.data[0], ...prev]);

    } catch (err) {
      setError(err.message);
    }

    setUploading(false);
  }

  async function handleKnowledgeArticleSubmit(e) {
    e.preventDefault();

    setUploading(true);

    try {

      const result = await createKnowledgeArticle({
        resignation_request_id:
          knowledgeArticle.resignationRequestId,
        expert_id: userProfile.id,
        title: knowledgeArticle.title,
        summary: knowledgeArticle.summary,
        content: knowledgeArticle.content,
      });

      if (result.error)
        throw new Error(result.error.message);

      setSuccessMessage("Knowledge article created.");

      setKnowledgeArticle({
        resignationRequestId: "",
        title: "",
        summary: "",
        content: "",
      });

    } catch (err) {
      setError(err.message);
    }

    setUploading(false);
  }

  if (loading) {
    return (
      <div className="updates-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="updates-page">

      <div className="updates-header">

        <div>
          <h1>👨‍💼 Expert</h1>

          <p>
            Knowledge transfer requests,
            SOP creation,
            upload SOP
            and resignation knowledge capture.
          </p>

        </div>

        <span className="updates-role-badge">
          EXPERT
        </span>

      </div>

      {error && (
        <div className="updates-error-card">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="updates-success-card">
          {successMessage}
        </div>
      )}

      <div className="updates-grid">

        {/* CARD 1 */}

        <section className="updates-section-card">

          <div className="section-head">

            <div>

              <h2>Knowledge Transfer</h2>

              <p>
                Pending requests assigned to you.
              </p>

            </div>

            <span className="section-count">
              {requests.length}
            </span>

          </div>

          <div className="updates-list">

            {requests.length === 0 ? (

              <div className="updates-empty-state">
                No pending requests.
              </div>

            ) : (

              requests.map((item) => (
                <article
                  key={item.id}
                  className="updates-list-item"
                >
                  <h3>
                    {item.title ||
                      "Knowledge Transfer"}
                  </h3>

                  <p>
                    {item.description ||
                      "No description"}
                  </p>

                  <small>
                    {new Date(
                      item.created_at
                    ).toLocaleDateString()}
                  </small>

                </article>
              ))

            )}

          </div>

        </section>
                {/* CARD 2 */}

        <section className="updates-section-card">

          <div className="section-head">

            <div>

              <h2>Latest SOPs</h2>

              <p>
                Recently published SOPs.
              </p>

            </div>

            <span className="section-count">
              {sops.length}
            </span>

          </div>

          <div className="updates-list">

            {sops.length === 0 ? (

              <div className="updates-empty-state">
                No SOPs available.
              </div>

            ) : (

              sops.map((sop) => (

                <article
                  key={sop.id}
                  className="updates-list-item"
                >

                  <h3>{sop.title}</h3>

                  <p>
                    {sop.summary ||
                      "No summary available"}
                  </p>

                  <small>
                    {new Date(
                      sop.created_at
                    ).toLocaleDateString()}
                  </small>

                </article>

              ))

            )}

          </div>

        </section>

        {/* CARD 3 */}

        <section className="updates-section-card">

          <div className="section-head">

            <div>

              <h2>Upload SOP</h2>

              <p>
                Publish a new SOP for your team.
              </p>

            </div>

          </div>

          <form
            className="updates-form"
            onSubmit={handleSopSubmit}
          >

            <input
              type="text"
              placeholder="SOP Title"
              value={newSop.title}
              onChange={(e)=>
                setNewSop({
                  ...newSop,
                  title:e.target.value
                })
              }
            />

            <textarea
              placeholder="Summary"
              value={newSop.summary}
              onChange={(e)=>
                setNewSop({
                  ...newSop,
                  summary:e.target.value
                })
              }
            />

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e)=>
                setNewSop({
                  ...newSop,
                  file:e.target.files[0]
                })
              }
            />

            <button
              className="primary-button"
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : "Upload SOP"}
            </button>

          </form>

        </section>

        {/* CARD 4 */}

        <section className="updates-section-card">

          <div className="section-head">

            <div>

              <h2>
                Knowledge Capture
              </h2>

              <p>
                Create resignation knowledge article.
              </p>

            </div>

            <span className="section-count">
              {resignationRequests.length}
            </span>

          </div>

          <form
            className="updates-form"
            onSubmit={handleKnowledgeArticleSubmit}
          >

            <select
              value={
                knowledgeArticle.resignationRequestId
              }
              onChange={(e)=>
                setKnowledgeArticle({
                  ...knowledgeArticle,
                  resignationRequestId:e.target.value
                })
              }
            >

              <option value="">
                Select Request
              </option>

              {resignationRequests.map(req=>(
                <option
                  key={req.id}
                  value={req.id}
                >
                  {req.reason ||
                    `Request ${req.id}`}
                </option>
              ))}

            </select>

            <input
              type="text"
              placeholder="Article Title"
              value={knowledgeArticle.title}
              onChange={(e)=>
                setKnowledgeArticle({
                  ...knowledgeArticle,
                  title:e.target.value
                })
              }
            />

            <textarea
              placeholder="Summary"
              value={knowledgeArticle.summary}
              onChange={(e)=>
                setKnowledgeArticle({
                  ...knowledgeArticle,
                  summary:e.target.value
                })
              }
            />

            <textarea
              rows="6"
              placeholder="Knowledge Content"
              value={knowledgeArticle.content}
              onChange={(e)=>
                setKnowledgeArticle({
                  ...knowledgeArticle,
                  content:e.target.value
                })
              }
            />

            <button
              className="primary-button"
              disabled={uploading}
            >
              {uploading
                ? "Submitting..."
                : "Submit Article"}
            </button>

          </form>

        </section>

      </div>

    </div>

  );

}

export default ExpertUpdates;