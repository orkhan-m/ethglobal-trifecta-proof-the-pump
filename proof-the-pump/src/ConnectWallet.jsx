import { ethers } from "ethers";
import { useEffect } from "react";

function ConnectWallet({ address, setAddress, balance, setBalance }) {
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        setAddress(null);
        setBalance(null);
        alert("Account changed! Please reconnect wallet.");
      });

      window.ethereum.on("chainChanged", () => {
        setAddress(null);
        setBalance(null);
        alert("Network changed! Please reconnect wallet.");
      });
    }
  }, [setAddress, setBalance]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);

        // Fetch ETH balance
        const ethBalance = await provider.getBalance(userAddress);
        setBalance(ethers.formatEther(ethBalance));
      } catch (err) {
        console.error("User rejected connection: ", err);
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h2>Connect Your Wallet</h2>
      {!address ? (
        <button
          onClick={connectWallet}
          style={{
            padding: "8px 15px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>
            <strong>Connected:</strong> {address.slice(0, 6)}...
            {address.slice(-4)}
          </p>
          <p>
            <strong>Balance:</strong> {parseFloat(balance).toFixed(4)} ETH
          </p>
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;
