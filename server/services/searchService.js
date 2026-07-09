import supabase from "../config/supabase.js";

export async function searchKnowledge(question) {
  const { data, error } = await supabase.from("knowledge").select("*");

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const words = question
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const ranked = data.map((doc) => {
    const text = `
      ${doc.title || ""}
      ${doc.machine_name || ""}
      ${doc.department || ""}
      ${doc.category || ""}
      ${doc.description || ""}
      ${doc.summary || ""}
      ${doc.keywords || ""}
      ${doc.sop || ""}
      ${doc.repair_steps || ""}
      ${doc.safety_checklist || ""}
      ${doc.required_tools || ""}
      ${doc.extracted_text || ""}
    `.toLowerCase();

    let score = 0;

    words.forEach((word) => {
      if (doc.title?.toLowerCase().includes(word)) score += 10;
      if (doc.machine_name?.toLowerCase().includes(word)) score += 8;
      if (doc.category?.toLowerCase().includes(word)) score += 5;
      if (doc.department?.toLowerCase().includes(word)) score += 3;
      if (text.includes(word)) score += 1;
    });

    return { score, document: doc };
  });

  ranked.sort((a, b) => b.score - a.score);

  if (ranked.length === 0 || ranked[0].score === 0) return null;

  return ranked[0].document;
}