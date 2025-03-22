# Proof-the-Pump: Zero-Knowledge ETH Balance Verification

A decentralized application that uses zero-knowledge proofs to verify user eligibility for token pump events based on ETH balance thresholds without revealing the actual balance.

## Key Features

- **Privacy-Preserving**: Verify ETH balance thresholds without revealing the actual balance
- **Create Pumps**: Any user can create token pump events with customizable ETH thresholds
- **ZK Proof Generation**: Create zero-knowledge proofs of your ETH balance
- **On-Chain Verification**: Verify proofs using the deployed Verifier contract
- **User-Friendly Interface**: Simple UI for connecting wallets, creating pumps, and generating proofs

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
4. Connect your wallet, create or join a pump, and generate proofs!

## How It Works

### Creating a Pump

1. Connect your wallet
2. Navigate to the "Create a Pump" tab
3. Specify a name, description, and ETH threshold
4. Create the pump - it will become available to all users

### Participating in a Pump

1. Connect your wallet
2. Browse available pumps in the "Participate in Pumps" tab
3. Select a pump you want to join
4. Generate a zero-knowledge proof of your ETH balance
5. Verify the proof on-chain without revealing your actual balance
6. Once verified, you're added to the pump participants list

## How ZK Proofs Work in This Project

1. User connects their wallet
2. Frontend captures the ETH balance
3. User selects a pump with a specific threshold
4. A zero-knowledge proof is generated (proving ETH balance ≥ threshold)
5. The proof can be verified on-chain without revealing the user's actual balance

## Future Enhancements

- Integrate with actual token distribution mechanisms
- Add support for multiple tokens and networks
- Implement witness generation directly in the browser
- Add proof persistence in a database
- Support token gating features based on proof verification
