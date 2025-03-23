import { useState } from "react";

function PumpList({ pumps, address, onSelectPump, isLoading }) {
  const [selectedPump, setSelectedPump] = useState(null);

  const handlePumpSelect = (pump) => {
    setSelectedPump(pump);
    onSelectPump(pump);
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: "24px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            color: "#64748b",
          }}
        >
          Loading pumps...
        </div>
      </div>
    );
  }

  if (pumps.length === 0) {
    return (
      <div
        style={{
          padding: "24px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#64748b",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              marginBottom: "16px",
              color: "#1e293b",
            }}
          >
            No Pumps Available
          </div>
          <p style={{ marginBottom: "24px" }}>
            Be the first to create a pump event!
          </p>
          <button
            onClick={() => onSelectPump(null)}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Create a Pump
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.5rem",
            color: "#1e293b",
            fontWeight: "600",
          }}
        >
          Available Pumps
        </h2>
        <div
          style={{
            padding: "6px 12px",
            backgroundColor: "#f1f5f9",
            borderRadius: "20px",
            fontSize: "0.9rem",
            color: "#64748b",
          }}
        >
          {pumps.length} pump{pumps.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {pumps.map((pump) => (
          <div
            key={pump._id}
            onClick={() => handlePumpSelect(pump)}
            style={{
              padding: "20px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#3b82f6";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                fontSize: "1.25rem",
                color: "#1e293b",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              {pump.name}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              <span>Required ETH:</span>
              <span>{pump.requiredEth} ETH</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              <span>Participants:</span>
              <span>{pump.participants.length}</span>
            </div>
            <div
              style={{
                marginTop: "12px",
                fontSize: "0.75rem",
                color: "#94a3b8",
              }}
            >
              Created by: {pump.creator.slice(0, 6)}...{pump.creator.slice(-4)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PumpList;
