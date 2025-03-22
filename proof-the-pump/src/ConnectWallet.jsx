import { ethers } from "ethers";
import { useState } from "react";

function ConnectWallet() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAddress(await signer.getAddress());

        // Fetch Sepolia ETH balance
        const sepBalance = await provider.getBalance(address);
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
        <p>Connected: {address}</p>
      )}
    </div>
  );
}

export default ConnectWallet;
