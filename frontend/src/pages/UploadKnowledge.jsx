import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const api = axios.create({ baseURL: API_BASE });
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

rows="1"

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