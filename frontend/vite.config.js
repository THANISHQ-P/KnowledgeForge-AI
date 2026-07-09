import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig({
  plugins: [react()],

    
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_OLLAMA_URL': JSON.stringify(env.VITE_OLLAMA_URL),
      'import.meta.env.VITE_OLLAMA_MODEL': JSON.stringify(env.VITE_OLLAMA_MODEL),
    },
    envDir: path.resolve(__dirname, "..")
  })
