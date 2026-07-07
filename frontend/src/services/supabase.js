import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

// Log environment variables for debugging
console.log("🔍 Checking Supabase credentials...");
console.log("URL:", supabaseUrl ? "✅ Found" : "❌ Missing");
console.log("Key:", supabaseAnonKey ? "✅ Found" : "❌ Missing");

if (supabaseUrl && supabaseAnonKey && supabaseUrl.includes("supabase")) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✅ Supabase connected successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Supabase:", error.message);
    supabase = null;
  }
} else {
  console.warn(
    "⚠️ Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local"
  );
}

export { supabase };
