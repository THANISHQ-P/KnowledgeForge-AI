import "../../styles/appLayout.css";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

function AppLayout({ children }) {
  return (
    <div className="app-layout">

      {/* Fixed Navbar */}
      <Navbar />

      {/* Sidebar + Content */}
      <div className="layout-body">

        <Sidebar />

        <main className="page-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AppLayout;