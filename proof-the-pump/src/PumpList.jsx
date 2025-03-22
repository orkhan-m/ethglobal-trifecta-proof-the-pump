import { useState } from "react";

function PumpList({ pumps, address, onSelectPump }) {
  const [selectedPump, setSelectedPump] = useState(null);

  const handlePumpSelect = (pump) => {
    setSelectedPump(pump);
    onSelectPump(pump);
  };

  if (!pumps || pumps.length === 0) {
    return (
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h2>Available Pumps</h2>
        <p>No pumps have been created yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Available Pumps</h2>
      <p>
        Select a pump to verify your eligibility with a zero-knowledge proof
      </p>

      <div style={{ marginTop: "15px" }}>
        {pumps.map((pump) => (
          <div
            key={pump.id}
            style={{
              padding: "10px",
              marginBottom: "10px",
              border: `1px solid ${
                selectedPump?.id === pump.id ? "#3498db" : "#eee"
              }`,
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor:
                selectedPump?.id === pump.id ? "#f0f8ff" : "white",
            }}
            onClick={() => handlePumpSelect(pump)}
          >
            <h3 style={{ margin: "0 0 5px 0" }}>{pump.name}</h3>
            {pump.description && (
              <p style={{ margin: "0 0 10px 0" }}>{pump.description}</p>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                <strong>Required ETH:</strong> {pump.threshold} ETH
              </span>
              <span style={{ fontSize: "0.8em", color: "#666" }}>
                Created by:{" "}
                {pump.creator === address
                  ? "You"
                  : `${pump.creator.slice(0, 6)}...${pump.creator.slice(-4)}`}
              </span>
            </div>
            <div style={{ marginTop: "5px", fontSize: "0.8em", color: "#666" }}>
              <span>{pump.participants.length} participants</span>
              <span style={{ marginLeft: "10px" }}>
                {new Date(pump.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PumpList;
