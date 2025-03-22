import { useState, useEffect } from "react";
import ConnectWallet from "./ConnectWallet";
import CreatePump from "./CreatePump";
import PumpList from "./PumpList";
import GenerateProof from "./GenerateProof";
import VerifyProof from "./VerifyProof";

function App() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [pumps, setPumps] = useState([]);
  const [selectedPump, setSelectedPump] = useState(null);
  const [currentProof, setCurrentProof] = useState(null);
  const [activeTab, setActiveTab] = useState("participate"); // "participate" or "create"

  // Load pumps from local storage on initial load
  useEffect(() => {
    const savedPumps = localStorage.getItem("pumps");
    if (savedPumps) {
      setPumps(JSON.parse(savedPumps));
    }
  }, []);

  // Save pumps to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("pumps", JSON.stringify(pumps));
  }, [pumps]);

  const handlePumpCreated = (newPump) => {
    setPumps((prevPumps) => [...prevPumps, newPump]);
    alert(`Pump "${newPump.name}" created successfully!`);
    setActiveTab("participate");
  };

  const handleSelectPump = (pump) => {
    setSelectedPump(pump);
    setCurrentProof(null);
  };

  const handleProofGenerated = (pumpId, proofData) => {
    setCurrentProof(proofData);
  };

  const handleProofVerified = (pumpId) => {
    // Add user to pump participants
    setPumps((prevPumps) =>
      prevPumps.map((pump) =>
        pump.id === pumpId
          ? {
              ...pump,
              participants: pump.participants.includes(address)
                ? pump.participants
                : [...pump.participants, address],
            }
          : pump
      )
    );
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Proof-the-Pump: Zero-Knowledge Eligibility Verification</h1>

      <p>
        Prove you have enough ETH to participate in token pump events without
        revealing your exact balance!
      </p>

      <ConnectWallet
        address={address}
        setAddress={setAddress}
        balance={balance}
        setBalance={setBalance}
      />

      {address && (
        <div>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <button
              onClick={() => setActiveTab("participate")}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor:
                  activeTab === "participate" ? "#3498db" : "#f8f9fa",
                color: activeTab === "participate" ? "white" : "#333",
                border: "1px solid #dee2e6",
                borderRadius: "5px 0 0 5px",
                cursor: "pointer",
              }}
            >
              Participate in Pumps
            </button>
            <button
              onClick={() => setActiveTab("create")}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: activeTab === "create" ? "#3498db" : "#f8f9fa",
                color: activeTab === "create" ? "white" : "#333",
                border: "1px solid #dee2e6",
                borderRadius: "0 5px 5px 0",
                borderLeft: "none",
                cursor: "pointer",
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
              />

              {address && balance && (
                <GenerateProof
                  address={address}
                  balance={balance}
                  selectedPump={selectedPump}
                  onProofGenerated={handleProofGenerated}
                />
              )}

              {currentProof && (
                <VerifyProof
                  proof={currentProof.proof}
                  publicInputs={currentProof.publicInputs}
                  selectedPump={selectedPump}
                  onVerified={handleProofVerified}
                />
              )}
            </>
          )}
        </div>
      )}

      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #eee",
          paddingTop: "20px",
          fontSize: "0.8em",
          color: "#666",
        }}
      >
        <p>
          This application uses zero-knowledge proofs to verify your ETH balance
          exceeds the required threshold for each pump, without revealing your
          actual balance to anyone. Your privacy is preserved while still
          proving eligibility.
        </p>
      </div>
    </div>
  );
}

export default App;
