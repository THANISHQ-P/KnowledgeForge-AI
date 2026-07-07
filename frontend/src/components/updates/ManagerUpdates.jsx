import { useEffect, useState } from "react";
import "../../styles/Updates.css";
import {
  fetchEmployees,
  fetchMachines,
  fetchSops,
  insertMaintenanceTask,
  insertSop,
} from "../../services/updatesService";

function ManagerUpdates({ userProfile }) {
  const [employees, setEmployees] = useState([]);
  const [machines, setMachines] = useState([]);
  const [sops, setSops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignForm, setAssignForm] = useState({ employeeId: "", machineName: "", dueDate: "", description: "" });
  const [sopForm, setSopForm] = useState({ title: "", summary: "", file: null });
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadManagerUpdates() {
      setLoading(true);
      setError(null);

      try {
        const [employeesResponse, machinesResponse, sopsResponse] = await Promise.all([
          fetchEmployees(),
          fetchMachines(),
          fetchSops(6),
        ]);

        if (employeesResponse.error) throw new Error(employeesResponse.error.message || employeesResponse.error);
        if (machinesResponse.error) throw new Error(machinesResponse.error.message || machinesResponse.error);
        if (sopsResponse.error) throw new Error(sopsResponse.error.message || sopsResponse.error);

        setEmployees(employeesResponse.data ?? []);
        setMachines(machinesResponse.data ?? []);
        setSops(sopsResponse.data ?? []);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load manager updates.");
      } finally {
        setLoading(false);
      }
    }

    loadManagerUpdates();
  }, []);

  const handleAssignSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage("");

    try {
      if (!assignForm.employeeId || !assignForm.machineName || !assignForm.dueDate) {
        throw new Error("Please select employee, machine and due date.");
      }

      const taskResult = await insertMaintenanceTask({
        employee_id: assignForm.employeeId,
        machine_name: assignForm.machineName,
        due_date: assignForm.dueDate,
        description: assignForm.description,
        status: "assigned",
      });

      if (taskResult.error) throw new Error(taskResult.error.message || taskResult.error);

      setSuccessMessage("Maintenance task assigned successfully.");
      setAssignForm({ employeeId: "", machineName: "", dueDate: "", description: "" });
    } catch (submitError) {
      setError(submitError.message || "Unable to assign maintenance task.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSopSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage("");

    try {
      if (!sopForm.title || !sopForm.summary || !sopForm.file) {
        throw new Error("Please provide a title, summary, and document.");
      }

      const uploadResult = await insertSop({
        title: sopForm.title,
        summary: sopForm.summary,
        document_url: sopForm.file,
        created_by: userProfile.id,
        is_manager_created: true,
      });

      if (uploadResult.error) throw new Error(uploadResult.error.message || uploadResult.error);

      setSuccessMessage("New SOP created successfully.");
      setSopForm({ title: "", summary: "", file: null });
      if (uploadResult.data?.length) setSops((prev) => [uploadResult.data[0], ...prev]);
    } catch (submitError) {
      setError(submitError.message || "Unable to create SOP.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="updates-page">
      <div className="updates-header">
        <div>
          <h1>👨‍💼 Manager</h1>
          <p>Assigning machine maintenance and new SOP creation for your teams.</p>
        </div>
        <span className="updates-role-badge">MANAGER</span>
      </div>

      {loading ? (
        <div className="updates-loading-card">
          <span className="loading-dot"></span>
          <p>Loading manager updates...</p>
        </div>
      ) : error ? (
        <div className="updates-error-card">
          <h3>Error loading manager updates</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className="updates-grid">
          <section className="updates-section-card">
            <div className="section-head">
              <div>
                <h2>Assigning machine maintenance</h2>
                <p>Allocate tasks to employees and track upcoming maintenance.</p>
              </div>
              <span className="section-count">Manage</span>
            </div>

            <form className="updates-form" onSubmit={handleAssignSubmit}>
              <label>
                Employee
                <select
                  value={assignForm.employeeId}
                  onChange={(event) => setAssignForm({ ...assignForm, employeeId: event.target.value })}
                >
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.full_name || employee.email}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Machine
                <select
                  value={assignForm.machineName}
                  onChange={(event) => setAssignForm({ ...assignForm, machineName: event.target.value })}
                >
                  <option value="">Select machine</option>
                  {machines.map((machine) => (
                    <option key={machine.id} value={machine.name || machine.machine_name || machine.id}>
                      {machine.name || machine.machine_name || `Machine ${machine.id}`}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Due Date
                <input
                  type="date"
                  value={assignForm.dueDate}
                  onChange={(event) => setAssignForm({ ...assignForm, dueDate: event.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  value={assignForm.description}
                  onChange={(event) => setAssignForm({ ...assignForm, description: event.target.value })}
                  placeholder="Describe the maintenance requirement"
                />
              </label>
              <button type="submit" className="primary-button" disabled={submitting}>
                {submitting ? "Assigning..." : "Assign Task"}
              </button>
            </form>
          </section>

          <section className="updates-section-card full-width">
            <div className="section-head">
              <div>
                <h2>New SOP</h2>
                <p>Publish a new standard operating procedure for the team.</p>
              </div>
              <span className="section-count">{sops.length}</span>
            </div>

            <form className="updates-form" onSubmit={handleSopSubmit}>
              <label>
                Title
                <input
                  type="text"
                  value={sopForm.title}
                  onChange={(event) => setSopForm({ ...sopForm, title: event.target.value })}
                  placeholder="Enter SOP title"
                />
              </label>
              <label>
                Summary
                <textarea
                  value={sopForm.summary}
                  onChange={(event) => setSopForm({ ...sopForm, summary: event.target.value })}
                  placeholder="Enter a short summary"
                />
              </label>
              <label>
                Document URL
                <input
                  type="text"
                  value={sopForm.file ?? ""}
                  onChange={(event) => setSopForm({ ...sopForm, file: event.target.value })}
                  placeholder="Paste document URL or storage path"
                />
              </label>
              <button type="submit" className="primary-button" disabled={submitting}>
                {submitting ? "Creating..." : "Create SOP"}
              </button>
            </form>
          </section>

          {successMessage && <div className="updates-success-card">{successMessage}</div>}
        </div>
      )}
    </div>
  );
}

export default ManagerUpdates;
