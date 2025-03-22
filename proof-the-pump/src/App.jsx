import { useState } from "react";
import ConnectWallet from "./ConnectWallet";
import GenerateProof from "./GenerateProof";

function App() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Proof-the-Pump: Zero-Knowledge Eligibility Verification</h1>

      <p>
        Prove you have enough ETH to participate in token pump events without
        revealing your exact balance!
      </p>

      <ConnectWallet
        address={address}
        setAddress={setAddress}
        balance={balance}
        setBalance={setBalance}
      />

      {address && balance && (
        <GenerateProof address={address} balance={balance} />
      )}

      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #eee",
          paddingTop: "20px",
          fontSize: "0.8em",
          color: "#666",
        }}
      >
        <p>
          This application uses zero-knowledge proofs to verify your ETH balance
          exceeds the required threshold, without revealing your actual balance
          to anyone. Your privacy is preserved while still proving eligibility.
        </p>
      </div>
    </div>
  );
}

export default App;
