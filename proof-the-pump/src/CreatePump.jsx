import { useState } from "react";
import { ethers } from "ethers";

function CreatePump({ address, onPumpCreated }) {
  const [pumpName, setPumpName] = useState("");
  const [description, setDescription] = useState("");
  const [requiredEth, setRequiredEth] = useState("0.01");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!pumpName.trim()) {
      alert("Please enter a name for your pump");
      return;
    }

    setIsCreating(true);
    try {
      // Convert requiredEth to wei for storage
      const requiredEthInWei = ethers.parseEther(requiredEth);

      // Create a new pump object
      const newPump = {
        name: pumpName,
        description: description,
        requiredEth: parseFloat(requiredEth),
        requiredEthWei: requiredEthInWei.toString(),
        creator: address,
      };

      // In a real implementation, this would be stored in a smart contract
      // For this demo, we'll pass it to the parent component
      onPumpCreated(newPump);

      // Reset the form
      setPumpName("");
      setDescription("");
      setRequiredEth("0.01");
    } catch (error) {
      console.error("Error creating pump:", error);
      alert("Failed to create pump");
    } finally {
      setIsCreating(false);
    }
  };

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
      <h2
        style={{
          margin: "0 0 16px 0",
          fontSize: "1.5rem",
          color: "#1e293b",
          fontWeight: "600",
        }}
      >
        Create a New Pump
      </h2>
      <p
        style={{
          color: "#64748b",
          marginBottom: "24px",
        }}
      >
        Set up a new token pump event with an ETH balance requirement
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="pumpName"
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#1e293b",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Pump Name
          </label>
          <input
            id="pumpName"
            type="text"
            value={pumpName}
            onChange={(e) => setPumpName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              fontSize: "0.875rem",
              color: "#1e293b",
            }}
            placeholder="e.g., MyToken Launch"
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="description"
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#1e293b",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              fontSize: "0.875rem",
              color: "#1e293b",
              minHeight: "80px",
              resize: "vertical",
            }}
            placeholder="Describe your token pump event..."
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="requiredEth"
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#1e293b",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Required ETH
          </label>
          <input
            id="requiredEth"
            type="number"
            step="0.001"
            value={requiredEth}
            onChange={(e) => setRequiredEth(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              fontSize: "0.875rem",
              color: "#1e293b",
            }}
            min="0.001"
            required
          />
          <small
            style={{
              display: "block",
              marginTop: "6px",
              color: "#64748b",
              fontSize: "0.75rem",
            }}
          >
            Users must prove they have at least this much ETH to participate
          </small>
        </div>

        <button
          type="submit"
          disabled={isCreating || !address}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: isCreating || !address ? "#94a3b8" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isCreating || !address ? "not-allowed" : "pointer",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => {
            if (!isCreating && address) {
              e.target.style.backgroundColor = "#2563eb";
            }
          }}
          onMouseOut={(e) => {
            if (!isCreating && address) {
              e.target.style.backgroundColor = "#3b82f6";
            }
          }}
        >
          {isCreating ? "Creating..." : "Create Pump"}
        </button>
      </form>
    </div>
  );
}

export default CreatePump;
