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
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Verify Proof On-Chain</h2>
      <p>
        Verify your eligibility for <strong>{selectedPump.name}</strong>{" "}
        on-chain without revealing your actual balance
      </p>

      <button
        onClick={simulateVerification}
        disabled={isVerifying || verificationResult !== null}
        style={{
          padding: "8px 15px",
          width: "100%",
          backgroundColor: "#9b59b6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor:
            isVerifying || verificationResult !== null
              ? "not-allowed"
              : "pointer",
        }}
      >
        {isVerifying
          ? "Verifying..."
          : verificationResult !== null
          ? "Verified"
          : "Verify Proof On-Chain"}
      </button>

      {verificationResult !== null && (
        <div style={{ marginTop: "15px" }}>
          <h3>Verification Result</h3>
          {verificationResult ? (
            <p style={{ color: "green" }}>
              ✅ Proof verified successfully! You are eligible to participate in{" "}
              {selectedPump.name}.
            </p>
          ) : (
            <p style={{ color: "red" }}>
              ❌ Proof verification failed. Not eligible.
            </p>
          )}
        </div>
      )}

      <p style={{ fontSize: "0.8em", color: "#666", marginTop: "15px" }}>
        Note: In a complete implementation, this would call the deployed
        verifier.sol contract to verify your proof on-chain without revealing
        your actual balance.
      </p>
    </div>
  );
}

export default VerifyProof;
