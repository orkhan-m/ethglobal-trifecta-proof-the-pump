import { useState, useEffect } from "react";
import { ethers } from "ethers";

function ConnectWallet({
  address,
  setAddress,
  balance,
  setBalance,
  onConnect,
  onDisconnect,
  onError,
}) {
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {
      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          setAddress(null);
          setBalance(null);
          onDisconnect();
        } else {
          setAddress(accounts[0]);
          updateBalance(accounts[0]);
          onConnect();
        }
      });

      // Listen for chain changes
      window.ethereum.on("chainChanged", () => {
        if (address) {
          updateBalance(address);
        }
      });
    }
  }, [address]);

  const updateBalance = async (addr) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(addr);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error updating balance:", error);
      onError("Failed to update balance");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      onError("Please install MetaMask to use this application");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
      await updateBalance(accounts[0]);
      onConnect();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      onError("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
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
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "1.5rem",
              color: "#1e293b",
              fontWeight: "600",
            }}
          >
            Wallet Connection
          </h2>
          {address && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#22c55e",
                fontSize: "0.875rem",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#22c55e",
                  borderRadius: "50%",
                }}
              />
              Connected
            </div>
          )}
        </div>
        {!address ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: isConnecting ? "not-allowed" : "pointer",
              fontWeight: "500",
              opacity: isConnecting ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (!isConnecting) {
                e.target.style.backgroundColor = "#2563eb";
              }
            }}
            onMouseOut={(e) => {
              if (!isConnecting) {
                e.target.style.backgroundColor = "#3b82f6";
              }
            }}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "4px",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
              }}
            >
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
            <div
              style={{
                fontSize: "1rem",
                color: "#1e293b",
                fontWeight: "500",
              }}
            >
              {parseFloat(balance).toFixed(4)} ETH
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectWallet;
