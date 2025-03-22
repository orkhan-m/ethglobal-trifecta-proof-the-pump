import { useState } from "react";
import { ethers } from "ethers";

function CreatePump({ address, onPumpCreated }) {
  const [pumpName, setPumpName] = useState("");
  const [description, setDescription] = useState("");
  const [threshold, setThreshold] = useState("0.01");
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
      // Convert threshold to wei for storage
      const thresholdInWei = ethers.parseEther(threshold);

      // Create a new pump object
      const newPump = {
        id: Date.now().toString(),
        name: pumpName,
        description: description,
        threshold: threshold,
        thresholdWei: thresholdInWei.toString(),
        creator: address,
        participants: [],
        createdAt: new Date().toISOString(),
      };

      // In a real implementation, this would be stored in a smart contract
      // For this demo, we'll pass it to the parent component
      onPumpCreated(newPump);

      // Reset the form
      setPumpName("");
      setDescription("");
      setThreshold("0.01");
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
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Create a New Pump</h2>
      <p>Set up a new token pump event with an ETH balance requirement</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="pumpName">Pump Name: </label>
          <input
            id="pumpName"
            type="text"
            value={pumpName}
            onChange={(e) => setPumpName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            placeholder="e.g., MyToken Launch"
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="description">Description: </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              minHeight: "60px",
            }}
            placeholder="Describe your token pump event..."
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="threshold">Required ETH Threshold: </label>
          <input
            id="threshold"
            type="number"
            step="0.001"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            min="0.001"
            required
          />
          <small style={{ color: "#666" }}>
            Users must prove they have at least this much ETH to participate
          </small>
        </div>

        <button
          type="submit"
          disabled={isCreating || !address}
          style={{
            padding: "8px 15px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isCreating || !address ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          {isCreating ? "Creating..." : "Create Pump"}
        </button>
      </form>
    </div>
  );
}

export default CreatePump;
