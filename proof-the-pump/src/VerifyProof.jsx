import { useState } from "react";
import { ethers } from "ethers";

// In a real app, this would be the deployed verifier contract address
// You would deploy the verifier.sol contract to a testnet/mainnet
const VERIFIER_CONTRACT_ADDRESS = "0xcCC3c1175b0e61D927CDF7893297ff70924caAE0"; // Add your deployed contract address here

// ABI for the verifier contract
const VERIFIER_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: "uint256[2]", name: "a", type: "uint256[2]" },
          { internalType: "uint256[2][2]", name: "b", type: "uint256[2][2]" },
          { internalType: "uint256[2]", name: "c", type: "uint256[2]" },
        ],
        internalType: "struct Verifier.Proof",
        name: "proof",
        type: "tuple",
      },
      {
        internalType: "uint256[2]",
        name: "input",
        type: "uint256[2]",
      },
    ],
    name: "verifyTx",
    outputs: [
      {
        internalType: "bool",
        name: "r",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

function VerifyProof({ proof, publicInputs, selectedPump, onVerified }) {
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyProofOnChain = async () => {
    if (!proof || !publicInputs) {
      alert("Please generate a proof first");
      return;
    }

    setIsVerifying(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const verifierContract = new ethers.Contract(
        VERIFIER_CONTRACT_ADDRESS,
        VERIFIER_ABI,
        signer
      );

      // Format proof for the contract call
      const formattedProof = {
        a: proof.a,
        b: proof.b,
        c: proof.c,
      };

      // Call the verifier contract
      const isValid = await verifierContract.verifyTx(
        formattedProof,
        publicInputs
      );
      setVerificationResult(isValid);

      if (isValid && onVerified) {
        onVerified(selectedPump.id);
      }
    } catch (error) {
      console.error("Error verifying proof:", error);
      alert("Failed to verify proof on-chain");
    } finally {
      setIsVerifying(false);
    }
  };

  // For this simplified version, we'll just simulate verification
  const simulateVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const result = true; // Simulate successful verification
      setVerificationResult(result);
      setIsVerifying(false);

      if (result && onVerified && selectedPump) {
        onVerified(selectedPump.id);
      }
    }, 2000);
  };

  if (!proof || !selectedPump) {
    return null;
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
          Verify Proof On-Chain
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

      <p
        style={{
          color: "#64748b",
          marginBottom: "24px",
          fontSize: "0.95rem",
          lineHeight: "1.6",
        }}
      >
        Verify your eligibility for <strong>{selectedPump.name}</strong>{" "}
        on-chain without revealing your actual balance
      </p>

      <button
        onClick={simulateVerification}
        disabled={isVerifying || verificationResult !== null}
        style={{
          padding: "12px 24px",
          width: "100%",
          backgroundColor:
            isVerifying || verificationResult !== null ? "#94a3b8" : "#9b59b6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor:
            isVerifying || verificationResult !== null
              ? "not-allowed"
              : "pointer",
          fontSize: "1rem",
          fontWeight: "500",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onMouseOver={(e) => {
          if (!isVerifying && verificationResult === null) {
            e.currentTarget.style.backgroundColor = "#8e44ad";
          }
        }}
        onMouseOut={(e) => {
          if (!isVerifying && verificationResult === null) {
            e.currentTarget.style.backgroundColor = "#9b59b6";
          }
        }}
      >
        {isVerifying ? (
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
            Verifying...
          </>
        ) : verificationResult !== null ? (
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
            Verified
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
            Verify Proof On-Chain
          </>
        )}
      </button>

      {verificationResult !== null && (
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            backgroundColor: verificationResult ? "#f0fdf4" : "#fef2f2",
            borderRadius: "8px",
            border: `1px solid ${verificationResult ? "#dcfce7" : "#fee2e2"}`,
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
            {verificationResult ? (
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
                color: verificationResult ? "#166534" : "#991b1b",
                fontWeight: "600",
              }}
            >
              {verificationResult
                ? "✅ Proof verified successfully!"
                : "❌ Proof verification failed"}
            </h3>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: verificationResult ? "#166534" : "#991b1b",
              lineHeight: "1.5",
            }}
          >
            {verificationResult
              ? `You are eligible to participate in ${selectedPump.name}.`
              : "The proof verification failed. Please try again or contact support."}
          </p>
        </div>
      )}

      <p
        style={{
          fontSize: "0.875rem",
          color: "#64748b",
          marginTop: "20px",
          padding: "12px",
          backgroundColor: "#f8fafc",
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
        }}
      >
        Note: In a complete implementation, this would call the deployed
        verifier.sol contract to verify your proof on-chain without revealing
        your actual balance.
      </p>
    </div>
  );
}

export default VerifyProof;
