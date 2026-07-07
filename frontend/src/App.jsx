import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import KnowledgeLibrary from "./pages/KnowledgeLibrary";
import AIChat from "./pages/AIChat";
import MachineManagement from "./pages/MachineManagement";
import MachineDetails from "./pages/MachineDetails";
import Updates from "./pages/Updates";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Login */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Default */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Knowledge Library */}
          <Route
            path="/knowledge-library"
            element={
              <ProtectedRoute>
                <KnowledgeLibrary />
              </ProtectedRoute>
            }
          />

          {/* AI Chat */}
          <Route
            path="/ai-chat"
            element={
              <ProtectedRoute>
                <AIChat />
              </ProtectedRoute>
            }
          />

          {/* Machines */}
          <Route
            path="/machines"
            element={
              <ProtectedRoute>
                <MachineManagement />
              </ProtectedRoute>
            }
          />

          {/* Machine Details */}
          <Route
            path="/machines/:machineId"
            element={
              <ProtectedRoute>
                <MachineDetails />
              </ProtectedRoute>
            }
          />

          {/* Updates */}
          <Route
            path="/updates"
            element={
              <ProtectedRoute>
                <Updates />
              </ProtectedRoute>
            }
          />

          {/* Invalid Routes */}
          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;