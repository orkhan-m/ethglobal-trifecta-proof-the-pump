import { useState, useEffect } from "react";
import ConnectWallet from "./ConnectWallet";
import CreatePump from "./CreatePump";
import PumpList from "./PumpList";
import GenerateProof from "./GenerateProof";
import VerifyProof from "./VerifyProof";
import { api } from "./services/api";

function Toast({ message, type, onClose }) {
  const bgColor =
    type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#3b82f6";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: bgColor,
        color: "white",
        padding: "16px 24px",
        borderRadius: "8px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 1000,
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div style={{ flex: 1 }}>{message}</div>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          padding: "4px",
          opacity: 0.8,
          transition: "opacity 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.opacity = "1")}
        onMouseOut={(e) => (e.target.style.opacity = "0.8")}
      >
        ✕
      </button>
    </div>
  );
}

function App() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [pumps, setPumps] = useState([]);
  const [selectedPump, setSelectedPump] = useState(null);
  const [currentProof, setCurrentProof] = useState(null);
  const [activeTab, setActiveTab] = useState("participate");
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPumps();
  }, []);

  const loadPumps = async () => {
    try {
      const data = await api.getPumps();
      setPumps(data);
    } catch (error) {
      showToast("Failed to load pumps", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handlePumpCreated = async (newPump) => {
    try {
      const createdPump = await api.createPump({
        name: newPump.name,
        creator: address,
        requiredEth: newPump.requiredEth,
      });
      setPumps((prevPumps) => [...prevPumps, createdPump]);
      showToast(`Pump "${createdPump.name}" created successfully!`, "success");
      setActiveTab("participate");
    } catch (error) {
      showToast("Failed to create pump", "error");
    }
  };

  const handleSelectPump = (pump) => {
    if (pump === null) {
      setActiveTab("create");
    } else {
      setSelectedPump(pump);
      setCurrentProof(null);
    }
  };

  const handleProofGenerated = (pumpId, proofData) => {
    setCurrentProof(proofData);
  };

  const handleProofVerified = async (pumpId) => {
    try {
      const updatedPump = await api.addParticipant(pumpId, address);
      setPumps((prevPumps) =>
        prevPumps.map((pump) => (pump._id === pumpId ? updatedPump : pump))
      );
      showToast("Proof verified successfully!", "success");
    } catch (error) {
      showToast("Failed to verify proof", "error");
    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        color: "#1a1a1a",
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .floating {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>

      <header
        style={{
          textAlign: "center",
          marginBottom: "40px",
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            margin: "0 0 10px 0",
            color: "#1e293b",
            fontWeight: "700",
          }}
        >
          Proof-the-Pump
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#64748b",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Prove your ETH balance eligibility for token pump events using
          zero-knowledge proofs
        </p>
      </header>

      <ConnectWallet
        address={address}
        setAddress={setAddress}
        balance={balance}
        setBalance={setBalance}
        onConnect={() => showToast("Wallet connected successfully!", "success")}
        onDisconnect={() => showToast("Wallet disconnected", "info")}
        onError={(error) => showToast(error, "error")}
      />

      {address && (
        <div>
          <div
            style={{
              display: "flex",
              marginBottom: "30px",
              backgroundColor: "rgba(241, 245, 249, 0.9)",
              padding: "4px",
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              backdropFilter: "blur(10px)",
            }}
          >
            <button
              onClick={() => setActiveTab("participate")}
              style={{
                flex: 1,
                padding: "12px 20px",
                backgroundColor:
                  activeTab === "participate" ? "#ffffff" : "transparent",
                color: activeTab === "participate" ? "#1e293b" : "#64748b",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "all 0.2s ease",
                boxShadow:
                  activeTab === "participate"
                    ? "0 1px 3px rgba(0,0,0,0.1)"
                    : "none",
              }}
            >
              Participate in Pumps
            </button>
            <button
              onClick={() => setActiveTab("create")}
              style={{
                flex: 1,
                padding: "12px 20px",
                backgroundColor:
                  activeTab === "create" ? "#ffffff" : "transparent",
                color: activeTab === "create" ? "#1e293b" : "#64748b",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "all 0.2s ease",
                boxShadow:
                  activeTab === "create" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              Create a Pump
            </button>
          </div>

          {activeTab === "create" ? (
            <CreatePump address={address} onPumpCreated={handlePumpCreated} />
          ) : (
            <>
              <PumpList
                pumps={pumps}
                address={address}
                onSelectPump={handleSelectPump}
                isLoading={isLoading}
              />

              {address && balance && (
                <GenerateProof
                  address={address}
                  balance={balance}
                  selectedPump={selectedPump}
                  onProofGenerated={handleProofGenerated}
                  onError={(error) => showToast(error, "error")}
                />
              )}

              {currentProof && (
                <VerifyProof
                  proof={currentProof.proof}
                  publicInputs={currentProof.publicInputs}
                  selectedPump={selectedPump}
                  onVerified={() => handleProofVerified(selectedPump._id)}
                  onError={(error) => showToast(error, "error")}
                />
              )}
            </>
          )}
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <footer
        style={{
          marginTop: "60px",
          paddingTop: "30px",
          borderTop: "1px solid #e2e8f0",
          textAlign: "center",
          color: "#64748b",
          fontSize: "0.9rem",
          backgroundColor: "rgba(248, 250, 252, 0.9)",
          borderRadius: "12px",
          padding: "20px",
          backdropFilter: "blur(10px)",
        }}
      >
        <p style={{ maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
          This application uses zero-knowledge proofs to verify your ETH balance
          exceeds the required threshold for each pump, without revealing your
          actual balance to anyone. Your privacy is preserved while still
          proving eligibility.
        </p>
      </footer>
    </div>
  );
}

export default App;
