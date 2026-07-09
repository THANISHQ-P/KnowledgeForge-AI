import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const api = axios.create({ baseURL: API_BASE });

// import "../styles/uploadKnowledge.css";

// function UploadKnowledge() {
//   const navigate = useNavigate();

//   const { user, role } = useAuth();

//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   async function uploadKnowledge(e) {
//     e.preventDefault();

//     if (!title || !category || !description || !file) {
//       alert("Please fill all fields.");
//       return;
//     }

//     if (!supabase) {
//       alert("Supabase is not configured.");
//       return;
//     }

//     try {
//       setUploading(true);

//       // Create unique filename
//       const fileName = `${Date.now()}-${file.name}`;

//       // Upload PDF to Storage
//       const { error: storageError } = await supabase.storage
//         .from("knowledge-files")
//         .upload(fileName, file);

//       console.log("Storage Error:", storageError);

//       if (storageError) {
//         throw storageError;
//       }

//       // Get Public URL
//       const {
//         data: { publicUrl },
//       } = supabase.storage
//         .from("knowledge-files")
//         .getPublicUrl(fileName);

//       console.log("Public URL:", publicUrl);

//       // Save metadata to database
//       const { data, error } = await supabase
//         .from("knowledge_library")
//         .insert([
//           {
//             title,
//             category,
//             description,
//             file_url: publicUrl,
//             uploaded_by: user?.id,
//             uploaded_by_name: user?.email,
//             role: role,
//           },
//         ])
//         .select();

//       console.log("Insert Data:", data);
//       console.log("Insert Error:", error);

//       if (error) {
//         throw error;
//       }

//       alert("Knowledge uploaded successfully!");

//       navigate("/knowledge-library");
//     } catch (err) {
//       console.error("========== UPLOAD ERROR ==========");
//       console.log(err);

//       alert(err.message || "Upload failed.");
//     } finally {
//       setUploading(false);
//     }
//   }

//   return (
//     <AppLayout>
//       <div className="upload-page">
//         <div className="upload-container">

//           <h1>Upload Knowledge</h1>

//           <p>
//             Upload SOPs, Manuals, Machine Guides and Technical Documents.
//           </p>

//           <form onSubmit={uploadKnowledge}>

//             <label>Document Title</label>

//             <input
//               type="text"
//               placeholder="Enter document title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />

//             <label>Category</label>

//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               <option value="">Select Category</option>
//               <option value="SOP">SOP</option>
//               <option value="Machine Manual">Machine Manual</option>
//               <option value="Safety Guide">Safety Guide</option>
//               <option value="Maintenance">Maintenance</option>
//               <option value="Training">Training</option>
//               <option value="General">General</option>
//             </select>

//             <label>Description</label>

//             <textarea
//               rows="5"
//               placeholder="Enter description..."
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />

//             <label>Select PDF</label>

//             <input
//               type="file"
//               accept=".pdf"
//               onChange={(e) => setFile(e.target.files[0])}
//             />

//             <button
//               type="submit"
//               disabled={uploading}
//             >
//               {uploading ? "Uploading..." : "Upload Knowledge"}
//             </button>

//           </form>

//         </div>
//       </div>
//     </AppLayout>
//   );
// }

// export default UploadKnowledge;

import "./upload.css";

function UploadKnowledge() {

const [title,setTitle]=useState("");
const [machine,setMachine]=useState("");
const [department,setDepartment]=useState("");
const [category,setCategory]=useState("");
const [description,setDescription]=useState("");
const [author,setAuthor]=useState("");
const [file,setFile]=useState(null);

const upload=async()=>{
  if(!file){
    alert("Please select a file.");
    return;
  }

  const formData=new FormData();
  formData.append("title",title);
  formData.append("machine",machine);
  formData.append("department",department);
  formData.append("category",category);
  formData.append("description",description);
  formData.append("author",author);
  formData.append("file",file);

  try{
    await api.post("/upload", formData);

    alert("Knowledge uploaded successfully.");
  } catch(err){
    console.error("Upload failed:", err);
    alert("Upload failed. Check backend status or API URL.");
  }
}

return(

<div className="container">

<h1>📚 Upload Knowledge</h1>

<input
placeholder="Title"
onChange={(e)=>setTitle(e.target.value)}
/>

<input
placeholder="Machine Name"
onChange={(e)=>setMachine(e.target.value)}
/>

<select
onChange={(e)=>setDepartment(e.target.value)}
>

<option>Select Department</option>

<option>Maintenance</option>

<option>Production</option>

<option>Safety</option>

<option>Quality Control</option>

<option>IT</option>

</select>

<select
onChange={(e)=>setCategory(e.target.value)}
>

<option>Select Category</option>

<option>SOP</option>

<option>Manual</option>

<option>Repair Guide</option>

<option>Training</option>

<option>Checklist</option>

</select>

<textarea

placeholder="Description"

rows="5"

onChange={(e)=>setDescription(e.target.value)}

/>

<input

placeholder="Expert Engineer"

onChange={(e)=>setAuthor(e.target.value)}

/>

<div className="upload-box">

<input

type="file"

onChange={(e)=>setFile(e.target.files[0])}

/>

{

file &&

<p>

📄 {file.name}

</p>

}

</div>

<button

className="upload-btn"

onClick={upload}

>

🚀 Upload Knowledge

</button>

</div>

)

}

export default UploadKnowledge;