# Project Structure

## 📁 Folder Structure

```
cti-blockchain-platform/
├── 📄 README.md                    # Main project documentation
├── 📄 package.json                 # Backend dependencies and scripts
├── 📄 hardhat.config.js           # Hardhat configuration
├── 📄 .env.example                # Environment variables template
├── 📄 .gitignore                  # Git ignore rules
├── 📄 setup.js                    # Automated setup script
├── 📄 DEPLOYMENT.md               # Deployment guide
├── 📄 API.md                      # API documentation
├── 📄 PROJECT_STRUCTURE.md        # This file
│
├── 📁 contracts/                   # Smart contracts
│   └── 📄 CTIRegistry.sol         # Main CTI registry contract
│
├── 📁 scripts/                     # Deployment and utility scripts
│   ├── 📄 deploy.js               # Contract deployment script
│   └── 📄 verify-deployment.js    # Deployment verification
│
├── 📁 test/                        # Smart contract tests
│   └── 📄 CTIRegistry.test.js     # Comprehensive contract tests
│
└── 📁 frontend/                    # React frontend application
    ├── 📄 package.json            # Frontend dependencies
    ├── 📄 .env.example            # Frontend environment template
    │
    ├── 📁 public/                 # Static assets
    │   ├── 📄 index.html
    │   └── 📄 favicon.ico
    │
    └── 📁 src/                    # Source code
        ├── 📄 App.js              # Main application component
        ├── 📄 App.css             # Application styles
        ├── 📄 index.js            # Application entry point
        ├── 📄 config.js           # Configuration constants
        │
        ├── 📁 components/         # React components
        │   ├── 📄 Header.js       # Application header
        │   ├── 📄 WalletConnection.js  # Wallet connection UI
        │   ├── 📄 CTISubmission.js     # CTI submission form
        │   ├── 📄 CTIFeed.js           # CTI feed display
        │   └── 📄 CTIItem.test.js      # Component tests
        │
        └── 📁 utils/              # Utility functions
            ├── 📄 web3.js         # Web3/Ethereum utilities
            └── 📄 ipfs.js         # IPFS utilities
```

## 📋 File Descriptions

### Root Files

| File | Description |
|------|-------------|
| `README.md` | Main project documentation with setup instructions |
| `package.json` | Backend dependencies, scripts, and project metadata |
| `hardhat.config.js` | Hardhat framework configuration for Ethereum development |
| `.env.example` | Template for environment variables |
| `setup.js` | Automated setup script for easy project initialization |
| `DEPLOYMENT.md` | Comprehensive deployment guide for different environments |
| `API.md` | Complete API documentation for smart contracts and utilities |

### Smart Contracts (`contracts/`)

| File | Description |
|------|-------------|
| `CTIRegistry.sol` | Main smart contract for CTI management with voting system |

**Key Features:**
- CTI submission with IPFS integration
- Decentralized voting mechanism
- Pagination support for large datasets
- Comprehensive validation and security measures

### Scripts (`scripts/`)

| File | Description |
|------|-------------|
| `deploy.js` | Smart contract deployment with network detection and verification |
| `verify-deployment.js` | Post-deployment verification and testing |

### Tests (`test/`)

| File | Description |
|------|-------------|
| `CTIRegistry.test.js` | Comprehensive test suite covering all contract functionality |

**Test Coverage:**
- Contract deployment
- CTI submission validation
- Voting mechanisms
- Access control
- Edge cases and error handling

### Frontend (`frontend/`)

#### Core Files

| File | Description |
|------|-------------|
| `App.js` | Main React application with routing and state management |
| `App.css` | Comprehensive styling with responsive design |
| `config.js` | Configuration constants and contract ABI |

#### Components (`frontend/src/components/`)

| Component | Description |
|-----------|-------------|
| `Header.js` | Application header with wallet connection status |
| `WalletConnection.js` | MetaMask connection interface with network detection |
| `CTISubmission.js` | Comprehensive CTI submission form with file upload |
| `CTIFeed.js` | CTI feed with filtering, sorting, and voting functionality |

#### Utilities (`frontend/src/utils/`)

| File | Description |
|------|-------------|
| `web3.js` | Web3 utilities for blockchain interaction |
| `ipfs.js` | IPFS utilities for decentralized storage |

## 🔧 Key Technologies

### Backend
- **Hardhat**: Ethereum development framework
- **Solidity**: Smart contract programming language
- **ethers.js**: Ethereum library for JavaScript
- **Mocha/Chai**: Testing framework

### Frontend
- **React.js**: Frontend framework
- **ethers.js**: Ethereum integration
- **Web3.Storage**: IPFS storage service
- **CSS3**: Modern styling with responsive design

### Blockchain
- **Ethereum**: Blockchain platform (Sepolia testnet)
- **IPFS**: Decentralized file storage
- **MetaMask**: Wallet integration

## 🚀 Quick Start Commands

```bash
# Complete setup
npm run setup

# Deploy contract
npm run deploy

# Start frontend
npm run frontend

# Run tests
npm test

# Verify deployment
npx hardhat run scripts/verify-deployment.js --network sepolia
```

## 📊 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Ethereum       │    │      IPFS       │
│                 │    │  Smart Contract │    │   File Storage  │
│  - CTI Submission│◄──►│                 │    │                 │
│  - Voting UI    │    │  - CTI Registry │◄──►│  - Metadata     │
│  - Feed Display │    │  - Validation   │    │  - Files        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    MetaMask     │    │   Sepolia       │    │  Web3.Storage   │
│   Wallet        │    │   Testnet       │    │    Gateway      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔒 Security Features

- Input validation on all smart contract functions
- Access control for voting (no self-voting, no double-voting)
- File type and size validation for uploads
- Immutable storage on blockchain and IPFS
- Network validation and error handling

## 📈 Scalability Considerations

- Pagination for large datasets
- Event-based updates for real-time functionality
- Modular component architecture
- Optimized gas usage in smart contracts
- IPFS for efficient file storage

## 🧪 Testing Strategy

- Unit tests for all smart contract functions
- Integration tests for frontend components
- End-to-end testing scenarios
- Gas optimization testing
- Security vulnerability testing

## 📝 Development Workflow

1. **Setup**: Run `npm run setup` for initial configuration
2. **Development**: Use local Hardhat network for testing
3. **Testing**: Run comprehensive test suite
4. **Deployment**: Deploy to Sepolia testnet
5. **Verification**: Verify contract and test functionality
6. **Frontend**: Update configuration and test UI
7. **Production**: Deploy frontend to hosting platform