# Proof-the-Pump: Zero-Knowledge ETH Balance Verification

A decentralized application that uses zero-knowledge proofs to verify user eligibility for token pump events based on ETH balance thresholds without revealing the actual balance.

## Key Features

- **Privacy-Preserving**: Verify ETH balance thresholds without revealing the actual balance
- **ZK Proof Generation**: Create zero-knowledge proofs of your ETH balance
- **On-Chain Verification**: Verify proofs using the deployed Verifier contract
- **User-Friendly Interface**: Simple UI for connecting wallets and generating proofs

## Technical Implementation

This project uses:

1. **ZoKrates**: For generating the ZK circuit and proofs
2. **Solidity**: For the on-chain Verifier contract
3. **React + Vite**: For the frontend application
4. **ethers.js**: For interacting with Ethereum wallets and contracts

## Project Structure

- `/zk-proof/`: Contains the ZoKrates circuit and verification key
- `/src/`: React application source code
- `verifier.sol`: Solidity contract for on-chain proof verification

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Connect your wallet and generate a proof!

## How ZK Proofs Work in This Project

1. User connects their wallet
2. Frontend captures the ETH balance
3. User specifies a threshold to prove their balance exceeds
4. A zero-knowledge proof is generated (proving ETH balance ≥ threshold)
5. The proof can be verified on-chain without revealing the user's actual balance

## Future Enhancements

- Integrate with actual token pump events
- Add support for multiple tokens and networks
- Implement witness generation directly in the browser
- Add proof persistence in a database
