# Decentralized Cyber Threat Intelligence Sharing Platform

A blockchain-based platform for secure, decentralized sharing and validation of cyber threat intelligence using Ethereum smart contracts and IPFS storage.

## Features

- Submit cyber threat intelligence (CTI) data securely and immutably
- Decentralized validation of CTI via voting by registered validators
- Store CTI metadata on Ethereum blockchain and bulk data on IPFS
- React frontend with MetaMask wallet integration
- Voting system for CTI validation

## Tech Stack

- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity with Hardhat
- **Frontend**: React.js with ethers.js
- **Storage**: IPFS (via web3.storage)
- **Wallet**: MetaMask integration

## Quick Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   cd frontend && npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Alchemy API key and private key
   ```

3. **Deploy smart contract:**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Start frontend:**
   ```bash
   cd frontend && npm start
   ```

## Detailed Setup Instructions

### Prerequisites
- Node.js (v16+)
- MetaMask browser extension
- Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- Alchemy account for RPC endpoint
- Web3.Storage account for IPFS

### Backend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with:
   - `SEPOLIA_RPC_URL`: Your Alchemy Sepolia endpoint
   - `PRIVATE_KEY`: Your wallet private key (for deployment)

3. Compile contracts:
   ```bash
   npx hardhat compile
   ```

4. Deploy to Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

5. Copy the deployed contract address to `frontend/src/config.js`

### Frontend Setup

1. Navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure contract address in `src/config.js`

4. Start development server:
   ```bash
   npm start
   ```

## Testing

Run smart contract tests:
```bash
npx hardhat test
```

Run frontend tests:
```bash
cd frontend && npm test
```

## Usage

1. Connect MetaMask to Sepolia testnet
2. Submit CTI reports through the web interface
3. Vote on existing CTI submissions
4. View all CTI records and their validation status

## Security Notes

- Never commit private keys to version control
- Use environment variables for sensitive data
- This is a prototype - enhance security for production use
- Validate all inputs on both frontend and smart contract level

## Deployment

- Frontend: Deploy to Vercel or Netlify
- Smart Contracts: Already deployed to Sepolia testnet
- For mainnet: Update network configuration and ensure thorough testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request