import "../../styles/machineStatus.css";

function MachineStatus() {
  return (
    <div className="machine-status">

      <h2>Machine Status</h2>

      <div
        style={{
          padding: "30px",
          textAlign: "center",
          color: "#bdbdbd",
          fontSize: "18px"
        }}
      >
        No machine status available.
      </div>

    </div>
  );
}

export default MachineStatus;