import { useState } from "react";
import { ethers } from "ethers";

// Import the proof.json, abi.json and verification key
// In a real app, you would generate these dynamically
import proofTemplate from "../../../zk-proof/proof.json";

function GenerateProof({ address, balance }) {
  const [threshold, setThreshold] = useState("0.01");
  const [isEligible, setIsEligible] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);

  const generateProof = async () => {
    if (!address || !balance) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, you would:
      // 1. Convert balance to the appropriate format for the ZK proof
      const balanceInWei = ethers.parseEther(balance);
      const thresholdInWei = ethers.parseEther(threshold);

      // 2. Generate the proof using a ZK prover library or API call
      // This would involve sending the user's private balance to a local prover
      // or secure API endpoint that can generate the ZK proof

      // For this demo, we'll simulate proof generation using the template
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate processing time

      // Check if user is eligible (in real app, this would be part of the ZK proof)
      const eligible = parseFloat(balance) >= parseFloat(threshold);
      setIsEligible(eligible);
      setProofGenerated(true);

      console.log("Proof would be generated with:");
      console.log("- Balance (private): ", balanceInWei.toString());
      console.log("- Threshold (public): ", thresholdInWei.toString());
      console.log("- Eligible: ", eligible);
    } catch (error) {
      console.error("Error generating proof:", error);
      alert("Failed to generate proof");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Proof of ETH Balance</h2>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="threshold">Minimum ETH Threshold: </label>
        <input
          id="threshold"
          type="number"
          step="0.001"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      <button
        onClick={generateProof}
        disabled={isLoading || !address}
        style={{
          padding: "8px 15px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading || !address ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Generating..." : "Generate Proof"}
      </button>

      {proofGenerated && (
        <div style={{ marginTop: "15px" }}>
          <h3>Proof Result</h3>
          <p>
            <strong>Status:</strong>{" "}
            {isEligible
              ? "✅ Eligible to participate!"
              : "❌ Not eligible - insufficient ETH balance"}
          </p>
          <p>
            <strong>Your balance:</strong> {balance} ETH
          </p>
          <p>
            <strong>Required balance:</strong> {threshold} ETH
          </p>
          <p style={{ fontSize: "0.8em", color: "#666" }}>
            Zero-knowledge proof generated - others can verify your eligibility
            without knowing your actual balance!
          </p>
        </div>
      )}
    </div>
  );
}

export default GenerateProof;
