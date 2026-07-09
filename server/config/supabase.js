import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "https://ychiytjciyxmjveytthf.supabase.co";
const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljaGl5dGpjaXl4bWp2ZXl0dGhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA2ODE2OCwiZXhwIjoyMDk4NjQ0MTY4fQ.-n2Mu22FC9j4Qj85DrzkjDksiyGOjBmmriYDGQDeN9s";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false
    }
});

export default supabase;
