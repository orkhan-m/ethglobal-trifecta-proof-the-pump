import { ethers } from "ethers";
import { useEffect, useState } from "react";

function ConnectWallet() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);

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
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);

        // Fetch Sepolia ETH balance
        const sepBalance = await provider.getBalance(userAddress);
        console.log();
        setBalance(ethers.formatEther(sepBalance));
      } catch (err) {
        console.error("User rejected connection: ", err);
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  return (
    <div>
      <p>Connect Wallet</p>
      {!address ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {address}</p>
          <p>Balance: {balance} ETH</p>
          <p>Balance: {parseFloat(balance).toFixed(4)} ETH</p>
        </>
      )}
    </div>
  );
}

export default ConnectWallet;
