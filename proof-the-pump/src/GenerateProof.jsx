import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Import the proof.json, abi.json and verification key
// In a real app, you would generate these dynamically
// import proofTemplate from "./proof.json";
// import abiTemplate from "../../zk-proof/abi.json";
// import verificationKey from "../../zk-proof/verification.key";

const proofTemplate = {
  scheme: "g16",
  curve: "bn128",
  proof: {
    a: [
      "0x2413dbd15890055ed8049f692e484734116170bcccf71550db4f618df5d59039",
      "0x2eac44dfff1be40dd9a0e872d7c3eeeed5561070da4e32fa324b6a8c57f65bcc",
    ],
    b: [
      [
        "0x16a50e9bcc344091d0d065d0a48527229da66ee36a0157005445b2de0c1d94da",
        "0x20fcca8d89113abff50caf50dcb28ff319b30ba575906f5cba34c598e7ada580",
      ],
      [
        "0x0ba408d2944e6850a04220b96548c0caeeba6d1332fabfee60e1ff1b55df7923",
        "0x1ca689f206beb74a1fc06b50922b17bf7e35a54e37246f9fee1570c9ed30d392",
      ],
    ],
    c: [
      "0x292c7b2d17c8b3af4b31b500584ebdd87a8768b74712a85e46112d97f5b6c83d",
      "0x03b2cdedd68f70c7c085a088a9d4f13773947afb1f582812a37fe4a4cfe698f7",
    ],
  },
  inputs: [
    "0x000000000000000000000000000000000000000000000000000000000001bba1",
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  ],
};

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

      console.log("proofTemplate", proofTemplate);
      const generatedProof = JSON.parse(JSON.stringify(proofTemplate));
      console.log("generatedProof", generatedProof);

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
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 20px",
            backgroundColor: "#f1f5f9",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>
        <h2
          style={{
            fontSize: "1.5rem",
            color: "#1e293b",
            margin: "0 0 10px 0",
            fontWeight: "600",
          }}
        >
          Generate Proof
        </h2>
        <p
          style={{
            color: "#64748b",
            fontSize: "1rem",
            maxWidth: "400px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Select a pump from the list above to generate your zero-knowledge
          proof
        </p>
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
          Generate Zero-Knowledge Proof
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
          {selectedPump.name}
        </div>
      </div>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginBottom: "4px",
              }}
            >
              Required ETH
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                color: "#1e293b",
                fontWeight: "600",
              }}
            >
              {selectedPump.threshold} ETH
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginBottom: "4px",
              }}
            >
              Your Balance
            </div>
            <div
              style={{
                fontSize: "1.25rem",
                color: "#1e293b",
                fontWeight: "600",
              }}
            >
              {parseFloat(balance).toFixed(4)} ETH
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={generateProof}
        disabled={isLoading || !address || proofGenerated}
        style={{
          padding: "12px 24px",
          backgroundColor:
            isLoading || !address || proofGenerated ? "#94a3b8" : "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor:
            isLoading || !address || proofGenerated ? "not-allowed" : "pointer",
          width: "100%",
          fontSize: "1rem",
          fontWeight: "500",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onMouseOver={(e) => {
          if (!isLoading && address && !proofGenerated) {
            e.currentTarget.style.backgroundColor = "#2563eb";
          }
        }}
        onMouseOut={(e) => {
          if (!isLoading && address && !proofGenerated) {
            e.currentTarget.style.backgroundColor = "#3b82f6";
          }
        }}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Generating Proof...
          </>
        ) : proofGenerated ? (
          <>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Proof Generated
          </>
        ) : (
          <>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
            Generate Proof
          </>
        )}
      </button>

      {proofGenerated && (
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            backgroundColor: isEligible ? "#f0fdf4" : "#fef2f2",
            borderRadius: "8px",
            border: `1px solid ${isEligible ? "#dcfce7" : "#fee2e2"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            {isEligible ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            )}
            <h3
              style={{
                margin: 0,
                fontSize: "1.1rem",
                color: isEligible ? "#166534" : "#991b1b",
                fontWeight: "600",
              }}
            >
              {isEligible
                ? "✅ Eligible to participate!"
                : "❌ Not eligible - insufficient ETH balance"}
            </h3>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: isEligible ? "#166534" : "#991b1b",
              lineHeight: "1.5",
            }}
          >
            Zero-knowledge proof generated - others can verify your eligibility
            without knowing your actual balance!
          </p>
        </div>
      )}
    </div>
  );
}

export default GenerateProof;
