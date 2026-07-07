import { supabase } from "./supabase";

export async function fetchSops(limit = 8) {
  return supabase
    .from("sops")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
}

export async function fetchKnowledgeTransferRequestsByExpert(expertId) {
  return supabase
    .from("knowledge_transfer_requests")
    .select("*")
    .eq("expert_id", expertId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });
}

export async function fetchResignationRequestsByExpert(expertId) {
  return supabase
    .from("resignation_requests")
    .select("*")
    .eq("expert_id", expertId)
    .eq("status", "pending")
    .order("submitted_at", { ascending: false });
}

export async function uploadSopFile(file) {
  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from("sops").upload(fileName, file);

  if (error) return { error };

  const { data: publicUrlData, error: publicUrlError } = supabase.storage
    .from("sops")
    .getPublicUrl(fileName);

  if (publicUrlError) return { error: publicUrlError };

  return { publicUrl: publicUrlData.publicUrl };
}

export async function insertSop(payload) {
  return supabase.from("sops").insert(payload).select();
}

export async function createKnowledgeArticle(payload) {
  return supabase.from("knowledge_articles").insert(payload).select();
}

export async function fetchEmployees() {
  return supabase
    .from("user_profiles")
    .select("id, full_name, email")
    .eq("role", "employee")
    .order("full_name", { ascending: true });
}

export async function fetchMachines() {
  return supabase.from("maintenance_tasks").select("machine_id, machine_name, id").limit(100);
}

export async function insertMaintenanceTask(payload) {
  return supabase.from("maintenance_tasks").insert(payload).select();
}

export async function fetchRoleCounts() {
  const roles = ["employee", "expert", "manager"];
  const counts = {};

  for (const role of roles) {
    const { count, error } = await supabase
      .from("user_profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", role);

    if (error) {
      return { error };
    }

    counts[`${role}s`] = count ?? 0;
  }

  return { data: counts };
}

export async function fetchPendingResignationRequests() {
  return supabase
    .from("resignation_requests")
    .select("id, expert_name, expert_email, reason, submitted_at")
    .eq("status", "pending")
    .order("submitted_at", { ascending: false });
}

export async function updateResignationRequestStatus(requestId, status) {
  return supabase
    .from("resignation_requests")
    .update({ status })
    .eq("id", requestId)
    .select();
}
