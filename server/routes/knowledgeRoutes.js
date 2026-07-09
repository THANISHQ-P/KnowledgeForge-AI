import express from "express";
import multer from "multer";
import fs from "fs";
import { processKnowledge } from "../services/aiService.js";
import supabase from "../config/supabase.js";
import { extractPDF } from "../services/pdfService.js";

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.get("/upload", (req, res) => {
  return res.status(405).json({
    message: "GET not supported on this endpoint. Use POST /api/upload with multipart/form-data to upload knowledge files."
  });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Upload Request Received");

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const {
      title,
      machine,
      department,
      category,
      description,
      author,
    } = req.body;

    let extractedText = "";
    let aiResult = {
      title,
      summary: "",
      keywords: [],
      sop: "",
      repair_steps: "",
      safety_checklist: "",
      required_tools: "",
      estimated_time: "",
    };

    try {
      extractedText = await extractPDF(file.path);
      console.log("PDF extracted successfully.");
    } catch (err) {
      console.error("PDF extraction failed:", err);
      return res.status(500).json({ message: "Failed to extract text from PDF." });
    }

    try {
      aiResult = await processKnowledge(extractedText);
      console.log("AI processing completed.");
    } catch (err) {
      console.warn("AI processing failed, continuing with uploaded metadata:", err.message);
    }

    let buffer;
    try {
      buffer = fs.readFileSync(file.path);
    } catch (err) {
      console.error("Failed to read uploaded file:", err);
      return res.status(500).json({ message: "Failed to read uploaded file." });
    }

    const fileName = Date.now() + "_" + file.originalname;
    const { error: uploadError } = await supabase.storage
      .from("knowledge-files")
      .upload(fileName, buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return res.status(500).json({ message: uploadError.message || "Failed to upload file." });
    }

    const { data } = supabase.storage.from("knowledge-files").getPublicUrl(fileName);
    if (!data?.publicUrl) {
      console.error("Failed to create public URL for file.");
      return res.status(500).json({ message: "Failed to create file URL." });
    }

    const { data: dbData, error: dbError } = await supabase.from("knowledge").insert({
      title: aiResult.title || title,
      machine_name: machine,
      department,
      category,
      description,
      uploaded_by: author,
      file_name: file.originalname,
      file_url: data.publicUrl,
      extracted_text: extractedText,
      summary: aiResult.summary,
      keywords: Array.isArray(aiResult.keywords) ? aiResult.keywords.join(",") : "",
      sop: aiResult.sop,
      repair_steps: aiResult.repair_steps,
      safety_checklist: aiResult.safety_checklist,
      required_tools: aiResult.required_tools,
      estimated_time: aiResult.estimated_time,
      status: "Approved",
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return res.status(500).json({ message: dbError.message || "Failed to save knowledge metadata." });
    }

    return res.json({ success: true, fileUrl: data.publicUrl, record: dbData });
  } catch (err) {
    console.error("Upload route failed:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});
router.get("/knowledge/:id", async (req, res) => {

    const { data, error } = await supabase
        .from("knowledge")
        .select("*")
        .eq("id", req.params.id)
        .single();

    if (error) {
        return res.status(404).json(error);
    }

    res.json(data);

});
router.get("/knowledge", async (req, res) => {

    const { data, error } = await supabase
        .from("knowledge")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        return res.status(500).json(error);

    }

    res.json(data);

});
router.delete("/knowledge/:id", async (req, res) => {

    const id = req.params.id;

    const { data } = await supabase
        .from("knowledge")
        .select("*")
        .eq("id", id)
        .single();

    if (!data) {

        return res.status(404).json({
            message: "Not Found"
        });

    }

    await supabase.storage
        .from("knowledge-files")
        .remove([data.file_name]);

    await supabase
        .from("knowledge")
        .delete()
        .eq("id", id);

    res.json({
        message: "Deleted Successfully"
    });

});

router.patch("/knowledge/:id/favorite", async (req, res) => {

    const id=req.params.id;

    const {favorite}=req.body;

    await supabase

    .from("knowledge")

    .update({

        is_favorite:favorite

    })

    .eq("id",id);

    res.json({

        success:true

    });

});
export default router;