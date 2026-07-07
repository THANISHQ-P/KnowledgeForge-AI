import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

import "../styles/uploadKnowledge.css";

function UploadKnowledge() {

  const navigate = useNavigate();

  const { user, role } = useAuth();

  const [title, setTitle] = useState("");

  const [category, setCategory] = useState("");

  const [description, setDescription] = useState("");

  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  async function uploadKnowledge(e) {

    e.preventDefault();

    if (!title || !category || !description || !file) {

      alert("Please fill all fields.");

      return;

    }

    setUploading(true);

    const fileName =
      Date.now() + "-" + file.name;

    const { error: uploadError } =
      await supabase.storage
        .from("knowledge-files")
        .upload(fileName, file);

    if (uploadError) {

      alert(uploadError.message);

      setUploading(false);

      return;

    }

    const { data } = supabase.storage

      .from("knowledge-files")

      .getPublicUrl(fileName);

    const fileUrl = data.publicUrl;
        const { error } = await supabase
      .from("knowledge_library")
      .insert([
        {
          title,
          category,
          description,
          file_url: fileUrl,
          uploaded_by: user.id,
          uploaded_by_name:
            user.email || "Unknown User",
          role,
        },
      ]);

    setUploading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Knowledge uploaded successfully.");

    navigate("/knowledge-library");
  }

  return (
    <AppLayout>

      <div className="upload-page">

        <div className="upload-container">

          <h1>Upload Knowledge</h1>

          <p>
            Upload SOPs, Manuals, Machine Guides
            and Technical Documents.
          </p>

          <form onSubmit={uploadKnowledge}>

            <label>
              Document Title
            </label>

            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="">
                Select Category
              </option>

              <option>
                SOP
              </option>

              <option>
                Machine Manual
              </option>

              <option>
                Safety Guide
              </option>

              <option>
                Maintenance
              </option>

              <option>
                Training
              </option>

              <option>
                General
              </option>

            </select>

            <label>
              Description
            </label>

            <textarea
              rows="5"
              placeholder="Enter description..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <label>
              Select PDF
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />

            <button
              type="submit"
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : "Upload Knowledge"}
            </button>

          </form>

        </div>

      </div>

    </AppLayout>
  );
}

export default UploadKnowledge;