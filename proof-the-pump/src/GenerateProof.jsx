import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Import the proof.json, abi.json and verification key
// In a real app, you would generate these dynamically
import proofTemplate from "../../zk-proof/proof.json";
import abiTemplate from "../../zk-proof/abi.json";
import verificationKey from "../../zk-proof/verification.key";

function GenerateProof({ address, balance, selectedPump, onProofGenerated }) {
  const [isEligible, setIsEligible] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);
  const [proof, setProof] = useState(null);
  const [publicInputs, setPublicInputs] = useState(null);

  useEffect(() => {
    // Reset proof state when selected pump changes
    setProofGenerated(false);
    setIsEligible(null);
    setProof(null);
    setPublicInputs(null);
  }, [selectedPump]);

  const generateProof = async () => {
    if (!address || !balance) {
      alert("Please connect your wallet first");
      return;
    }

    if (!selectedPump) {
      alert("Please select a pump first");
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, you would:
      // 1. Convert balance to the appropriate format for the ZK proof
      const balanceInWei = ethers.parseEther(balance);
      const thresholdInWei = ethers.parseEther(selectedPump.threshold);

      // 2. Generate the proof using a ZK prover library or API call
      // This would involve sending the user's private balance to a local prover
      // or secure API endpoint that can generate the ZK proof

      // For this demo, we'll simulate proof generation using the template
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate processing time

      // Check if user is eligible (in real app, this would be part of the ZK proof)
      const eligible =
        parseFloat(balance) >= parseFloat(selectedPump.threshold);
      setIsEligible(eligible);

      // Create a copy of the proof template and modify the inputs
      const generatedProof = JSON.parse(JSON.stringify(proofTemplate));

      // In a real app, this would be the actual generated proof
      setProof(generatedProof.proof);

      // The threshold would be the public input
      setPublicInputs(generatedProof.inputs);

      setProofGenerated(true);

      if (eligible && onProofGenerated) {
        onProofGenerated(selectedPump.id, {
          proof: generatedProof.proof,
          publicInputs: generatedProof.inputs,
          timestamp: new Date().toISOString(),
        });
      }

      console.log("Proof generated with:");
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

  if (!selectedPump) {
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
        <p>Select a pump from the list above to generate a proof</p>
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
      <h2>Proof of ETH Balance</h2>
      <div style={{ marginBottom: "15px" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>{selectedPump.name}</h3>
        {selectedPump.description && <p>{selectedPump.description}</p>}
        <p>
          <strong>Required ETH threshold:</strong> {selectedPump.threshold} ETH
        </p>
        <p>
          <strong>Your balance:</strong> {parseFloat(balance).toFixed(4)} ETH
        </p>
      </div>

      <button
        onClick={generateProof}
        disabled={isLoading || !address || proofGenerated}
        style={{
          padding: "8px 15px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor:
            isLoading || !address || proofGenerated ? "not-allowed" : "pointer",
          width: "100%",
        }}
      >
        {isLoading
          ? "Generating..."
          : proofGenerated
          ? "Proof Generated"
          : "Generate Proof"}
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
