import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client not initialized.");
      setLoading(false);
      return;
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth State Changed:", event);
      console.log("Session:", session);

      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;

      console.log("Current User:", user);

      setUser(user || null);
    } catch (err) {
      console.error("Check User Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    if (!supabase) {
      return {
        success: false,
        error: "Supabase not configured.",
      };
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Attempting Login...");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login Error:", error);
        throw error;
      }

      console.log("Login Successful");
      console.log("User:", data.user);

      setUser(data.user);

      return {
        success: true,
        user: data.user,
      };
    } catch (err) {
      console.error("========== LOGIN ERROR ==========");
      console.log(err);
      console.log("Name:", err?.name);
      console.log("Message:", err?.message);
      console.log("Status:", err?.status);
      console.log("Code:", err?.code);

      setError(err?.message || "Unknown error");

      return {
        success: false,
        error: err?.message || "Unknown error",
      };
    } finally {
      setLoading(false);
    }
  }

  async function signup(email, password, userData) {
    if (!supabase) {
      return {
        success: false,
        error: "Supabase not configured.",
      };
    }

    setLoading(true);
    setError(null);

    try {
      const role = userData?.role || "Employee";

      console.log("========== STARTING SIGNUP ==========");
      console.log("Email:", email);
      console.log("Role:", role);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
          },
        },
      });

      if (error) {
        console.error("Supabase Signup Error:", error);
        throw error;
      }

      console.log("========== SIGNUP SUCCESS ==========");
      console.log("User:", data.user);
      console.log("Session:", data.session);

      return {
        success: true,
        user: data.user,
      };
    } catch (err) {
      console.error("========== SIGNUP ERROR ==========");
      console.log("Full Error:", err);
      console.log("Name:", err?.name);
      console.log("Message:", err?.message);
      console.log("Status:", err?.status);
      console.log("Code:", err?.code);
      console.log("Stack:", err?.stack);

      setError(err?.message || "Unknown error");

      return {
        success: false,
        error: err?.message || "Unknown error",
      };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (!supabase) {
      return {
        success: false,
        error: "Supabase not configured.",
      };
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      console.log("Logout Successful");

      setUser(null);

      return {
        success: true,
      };
    } catch (err) {
      console.error("Logout Error:", err);

      setError(err?.message || "Unknown error");

      return {
        success: false,
        error: err?.message || "Unknown error",
      };
    } finally {
      setLoading(false);
    }
  }

  const role =
    user?.user_metadata?.role ||
    user?.app_metadata?.role ||
    "Employee";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        error,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}