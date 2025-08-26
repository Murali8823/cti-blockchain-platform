# Complete Deployment & Operations Guide
## CTI Blockchain Platform - Step-by-Step Implementation

This comprehensive guide will walk you through every step needed to deploy and operate your CTI blockchain platform, from initial setup to production deployment.

---

## 📋 Table of Contents

1. [Prerequisites & System Requirements](#prerequisites--system-requirements)
2. [Initial Project Setup](#initial-project-setup)
3. [Environment Configuration](#environment-configuration)
4. [Local Development Setup](#local-development-setup)
5. [Smart Contract Deployment](#smart-contract-deployment)
6. [Frontend Configuration & Deployment](#frontend-configuration--deployment)
7. [Testing & Verification](#testing--verification)
8. [Production Deployment](#production-deployment)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Advanced Operations](#advanced-operations)

---

## 🔧 Prerequisites & System Requirements

### Required Software
```bash
# Check your versions
node --version    # Should be v16.0.0 or higher
npm --version     # Should be v8.0.0 or higher
git --version     # Any recent version
```

### Required Accounts & Services

#### 1. Alchemy Account (Ethereum RPC Provider)
- Go to [https://www.alchemy.com/](https://www.alchemy.com/)
- Sign up for free account
- Create new app for "Sepolia" testnet
- Copy your API key

#### 2. Web3.Storage Account (IPFS Storage)
- Go to [https://web3.storage/](https://web3.storage/)
- Sign up with GitHub/email
- Create API token
- Copy your token

#### 3. MetaMask Wallet
- Install MetaMask browser extension
- Create new wallet or import existing
- Add Sepolia testnet to MetaMask
- Get test ETH from faucet

#### 4. GitHub Account (for deployment)
- Ensure you have a GitHub account
- Create new repository for your project

---

## 🚀 Initial Project Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone your repository
git clone https://github.com/your-username/cti-blockchain-platform.git
cd cti-blockchain-platform

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Verify Installation

```bash
# Check if Hardhat is working
npx hardhat --version

# Check if all dependencies are installed
npm list --depth=0
```

---

## ⚙️ Environment Configuration

### Step 1: Create Backend Environment File

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` file with your actual values:

```bash
# .env file content
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY_HERE
PRIVATE_KEY=your_ethereum_wallet_private_key_here_without_0x_prefix

# Optional: For contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**⚠️ SECURITY WARNING**: Never commit your `.env` file to Git!

### Step 2: Get Your Private Key from MetaMask

1. Open MetaMask
2. Click on account menu (three dots)
3. Select "Account Details"
4. Click "Export Private Key"
5. Enter your password
6. Copy the private key (without the 0x prefix)

### Step 3: Create Frontend Environment File

```bash
# Create frontend environment file
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```bash
# frontend/.env file content
REACT_APP_WEB3_STORAGE_TOKEN=your_web3_storage_token_here
REACT_APP_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

**Note**: We'll update the contract address after deployment.

---

## 🏠 Local Development Setup

### Step 1: Start Local Blockchain

Open a new terminal and run:

```bash
# Start local Hardhat network
npx hardhat node
```

Keep this terminal running. You should see output like:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Step 2: Deploy to Local Network

In a new terminal:

```bash
# Deploy smart contract to local network
npx hardhat run scripts/deploy.js --network localhost
```

You should see output like:
```
Deploying CTIRegistry contract...
CTIRegistry deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Network: localhost
Deployment info saved to deployment.json
```

### Step 3: Configure MetaMask for Local Network

1. Open MetaMask
2. Click network dropdown
3. Select "Add Network"
4. Add custom network:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH

### Step 4: Import Local Account to MetaMask

1. In MetaMask, click "Import Account"
2. Paste the private key from Step 1 (the first account)
3. You should now have 10000 ETH for testing

### Step 5: Update Frontend Configuration

Update `frontend/.env` with the deployed contract address:

```bash
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 6: Start Frontend Development Server

```bash
cd frontend
npm start
```

Your application should open at `http://localhost:3000`

---

## 🌐 Smart Contract Deployment

### Step 1: Get Sepolia Test ETH

Visit these faucets to get test ETH:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Chainlink Faucet](https://faucets.chain.link/)

You need at least 0.01 ETH for deployment.

### Step 2: Add Sepolia Network to MetaMask

1. Open MetaMask
2. Click network dropdown
3. Select "Add Network"
4. Add Sepolia testnet:
   - **Network Name**: Sepolia Test Network
   - **RPC URL**: https://sepolia.infura.io/v3/
   - **Chain ID**: 11155111
   - **Currency Symbol**: ETH
   - **Block Explorer**: https://sepolia.etherscan.io

### Step 3: Deploy to Sepolia Testnet

```bash
# Compile contracts first
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

Expected output:
```
Deploying CTIRegistry contract...
CTIRegistry deployed to: 0x742d35Cc6634C0532925a3b8D404d1f8b4C0d3c7
Network: sepolia
Deployment info saved to deployment.json
Waiting for block confirmations...
Verifying contract on Etherscan...
Contract verified successfully
```

### Step 4: Verify Deployment

Check your contract on Sepolia Etherscan:
1. Go to [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)
2. Search for your contract address
3. Verify it shows as verified and deployed

### Step 5: Update Frontend Configuration

Update `frontend/.env` with the Sepolia contract address:

```bash
REACT_APP_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b8D404d1f8b4C0d3c7
```

---

## 🎨 Frontend Configuration & Deployment

### Step 1: Test Frontend Locally

```bash
cd frontend
npm start
```

1. Open `http://localhost:3000`
2. Connect MetaMask (ensure you're on Sepolia network)
3. Try submitting a test CTI report
4. Verify voting functionality works

### Step 2: Build for Production

```bash
cd frontend
npm run build
```

This creates a `build` folder with optimized production files.

### Step 3: Deploy to Vercel (Recommended)

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: cti-blockchain-platform
# - Directory: ./
# - Override settings? No
```

#### Option B: Vercel Dashboard
1. Go to [https://vercel.com/](https://vercel.com/)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Set root directory to `frontend`
6. Add environment variables:
   - `REACT_APP_WEB3_STORAGE_TOKEN`: Your Web3.Storage token
   - `REACT_APP_CONTRACT_ADDRESS`: Your deployed contract address
7. Click "Deploy"

### Step 4: Deploy to Netlify (Alternative)

1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```

2. Go to [https://netlify.com/](https://netlify.com/)
3. Drag and drop the `build` folder
4. Go to Site Settings > Environment Variables
5. Add your environment variables
6. Redeploy

---

## 🧪 Testing & Verification

### Step 1: Run Smart Contract Tests

```bash
# Run all tests
npx hardhat test

# Run tests with gas reporting
npx hardhat test --reporter gas

# Run specific test file
npx hardhat test test/CTIRegistry.test.js
```

Expected output:
```
  CTIRegistry
    Deployment
      ✓ Should set the initial CTI counter to 0
      ✓ Should have zero active CTIs initially
    CTI Submission
      ✓ Should submit a new CTI successfully
      ✓ Should reject empty IPFS hash
      ...
  19 passing (2s)
```

### Step 2: Test Frontend Components

```bash
cd frontend
npm test
```

### Step 3: End-to-End Testing

Create a test script `scripts/e2e-test.js`:

```javascript
const { ethers } = require("hardhat");

async function main() {
    console.log("Running E2E tests...");
    
    // Get contract instance
    const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
    const CTIRegistry = await ethers.getContractFactory("CTIRegistry");
    const contract = CTIRegistry.attach(contractAddress);
    
    // Test 1: Submit CTI
    console.log("Test 1: Submitting CTI...");
    const tx1 = await contract.submitCTI(
        "QmTestHash123",
        "Malware",
        "Test Threat Report"
    );
    await tx1.wait();
    console.log("✓ CTI submitted successfully");
    
    // Test 2: Get CTI
    console.log("Test 2: Retrieving CTI...");
    const cti = await contract.getCTI(1);
    console.log("✓ CTI retrieved:", cti.title);
    
    // Test 3: Vote on CTI (from different account)
    console.log("Test 3: Voting on CTI...");
    const [owner, voter] = await ethers.getSigners();
    const tx2 = await contract.connect(voter).voteCTI(1, true);
    await tx2.wait();
    console.log("✓ Vote submitted successfully");
    
    // Test 4: Check score
    const score = await contract.getCTIScore(1);
    console.log("✓ CTI score:", score.toString());
    
    console.log("All E2E tests passed! 🎉");
}

main().catch(console.error);
```

Run the test:
```bash
npx hardhat run scripts/e2e-test.js --network sepolia
```

---

## 🚀 Production Deployment

### Step 1: Security Checklist

Before production deployment:

- [ ] Private keys are stored securely (not in code)
- [ ] Environment variables are properly configured
- [ ] Smart contract has been audited
- [ ] All tests are passing
- [ ] Frontend has been tested on multiple browsers
- [ ] IPFS uploads are working correctly
- [ ] Error handling is implemented
- [ ] Rate limiting is in place

### Step 2: Deploy to Ethereum Mainnet

**⚠️ WARNING**: Mainnet deployment costs real ETH. Test thoroughly on testnet first!

Update `hardhat.config.js`:

```javascript
networks: {
  mainnet: {
    url: process.env.MAINNET_RPC_URL || "",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 1
  }
}
```

Deploy:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

### Step 3: Production Frontend Deployment

Update production environment variables:
- Use mainnet contract address
- Ensure Web3.Storage token has sufficient credits
- Configure proper error tracking (Sentry)
- Set up analytics (Google Analytics)

### Step 4: Domain Configuration

1. Purchase domain name
2. Configure DNS to point to your hosting provider
3. Set up SSL certificate
4. Configure custom domain in Vercel/Netlify

---

## 📊 Monitoring & Maintenance

### Step 1: Set Up Contract Monitoring

Create monitoring script `scripts/monitor.js`:

```javascript
const { ethers } = require("hardhat");

async function monitorContract() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const CTIRegistry = await ethers.getContractFactory("CTIRegistry");
    const contract = CTIRegistry.attach(contractAddress).connect(provider);
    
    // Monitor CTI submissions
    contract.on("CTISubmitted", (id, submitter, ipfsHash, category, title) => {
        console.log(`New CTI submitted: ${title} by ${submitter}`);
        // Send notification, log to database, etc.
    });
    
    // Monitor votes
    contract.on("CTIVoted", (id, validator, isUpvote) => {
        console.log(`Vote on CTI ${id}: ${isUpvote ? 'upvote' : 'downvote'} by ${validator}`);
    });
    
    console.log("Monitoring contract events...");
}

monitorContract().catch(console.error);
```

### Step 2: Health Check Script

Create `scripts/health-check.js`:

```javascript
const { ethers } = require("hardhat");

async function healthCheck() {
    try {
        const contractAddress = process.env.CONTRACT_ADDRESS;
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        const CTIRegistry = await ethers.getContractFactory("CTIRegistry");
        const contract = CTIRegistry.attach(contractAddress).connect(provider);
        
        // Check contract is responsive
        const counter = await contract.ctiCounter();
        console.log(`✓ Contract responsive. Total CTIs: ${counter}`);
        
        // Check active CTI count
        const activeCount = await contract.getActiveCTICount();
        console.log(`✓ Active CTIs: ${activeCount}`);
        
        // Check recent CTIs
        const recentCTIs = await contract.getActiveCTIs(5, 0);
        console.log(`✓ Recent CTIs: ${recentCTIs.length}`);
        
        console.log("Health check passed! 🟢");
        return true;
    } catch (error) {
        console.error("Health check failed! 🔴", error);
        return false;
    }
}

healthCheck();
```

### Step 3: Automated Backups

Create backup script for deployment information:

```javascript
const fs = require('fs');
const path = require('path');

function backupDeploymentInfo() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '..', 'backups');
    
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    
    // Backup deployment.json
    if (fs.existsSync('deployment.json')) {
        const deploymentData = fs.readFileSync('deployment.json');
        fs.writeFileSync(
            path.join(backupDir, `deployment-${timestamp}.json`),
            deploymentData
        );
    }
    
    // Backup environment configuration (without sensitive data)
    const envBackup = {
        timestamp: new Date().toISOString(),
        network: process.env.NETWORK || 'sepolia',
        contractAddress: process.env.CONTRACT_ADDRESS,
        // Don't backup private keys or API keys
    };
    
    fs.writeFileSync(
        path.join(backupDir, `env-config-${timestamp}.json`),
        JSON.stringify(envBackup, null, 2)
    );
    
    console.log(`Backup created: ${timestamp}`);
}

backupDeploymentInfo();
```

---

## 🔧 Troubleshooting Guide

### Common Issues and Solutions

#### 1. "Insufficient funds for gas"
**Problem**: Not enough ETH in wallet for transaction
**Solution**:
```bash
# Check balance
npx hardhat run scripts/check-balance.js --network sepolia

# Get more test ETH from faucets
# For mainnet, buy ETH from exchange
```

#### 2. "Contract not deployed"
**Problem**: Contract address not found or incorrect
**Solution**:
```bash
# Verify contract address in deployment.json
cat deployment.json

# Check on Etherscan
# Update frontend/.env with correct address
```

#### 3. "MetaMask connection failed"
**Problem**: Network mismatch or MetaMask not connected
**Solution**:
```javascript
// Add network detection to frontend
const checkNetwork = async () => {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0xaa36a7') { // Sepolia
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
        });
    }
};
```

#### 4. "IPFS upload failed"
**Problem**: Web3.Storage token invalid or expired
**Solution**:
```bash
# Check token validity
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.web3.storage/user

# Generate new token if needed
# Update frontend/.env
```

#### 5. "Transaction failed"
**Problem**: Smart contract revert or gas estimation failed
**Solution**:
```bash
# Check transaction on Etherscan for revert reason
# Increase gas limit in MetaMask
# Verify contract function parameters
```

### Debug Scripts

Create `scripts/debug.js`:

```javascript
const { ethers } = require("hardhat");

async function debug() {
    console.log("🔍 Debug Information");
    console.log("==================");
    
    // Network info
    const network = await ethers.provider.getNetwork();
    console.log(`Network: ${network.name} (${network.chainId})`);
    
    // Account info
    const [signer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(signer.address);
    console.log(`Account: ${signer.address}`);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
    
    // Contract info
    if (process.env.CONTRACT_ADDRESS) {
        const CTIRegistry = await ethers.getContractFactory("CTIRegistry");
        const contract = CTIRegistry.attach(process.env.CONTRACT_ADDRESS);
        
        try {
            const counter = await contract.ctiCounter();
            console.log(`Contract: ${process.env.CONTRACT_ADDRESS}`);
            console.log(`CTI Counter: ${counter}`);
        } catch (error) {
            console.log(`Contract Error: ${error.message}`);
        }
    }
    
    // Gas prices
    const gasPrice = await ethers.provider.getGasPrice();
    console.log(`Gas Price: ${ethers.formatUnits(gasPrice, 'gwei')} gwei`);
}

debug().catch(console.error);
```

---

## 🚀 Advanced Operations

### Custom Deployment Scripts

Create advanced deployment script `scripts/advanced-deploy.js`:

```javascript
const hre = require("hardhat");
const fs = require('fs');

async function advancedDeploy() {
    console.log("🚀 Advanced Deployment Starting...");
    
    // Pre-deployment checks
    console.log("1. Running pre-deployment checks...");
    const [deployer] = await hre.ethers.getSigners();
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    
    if (balance < hre.ethers.parseEther("0.01")) {
        throw new Error("Insufficient balance for deployment");
    }
    
    console.log(`✓ Deployer: ${deployer.address}`);
    console.log(`✓ Balance: ${hre.ethers.formatEther(balance)} ETH`);
    
    // Deploy with gas estimation
    console.log("2. Estimating gas costs...");
    const CTIRegistry = await hre.ethers.getContractFactory("CTIRegistry");
    const deploymentData = CTIRegistry.interface.encodeDeploy([]);
    const gasEstimate = await hre.ethers.provider.estimateGas({
        data: deploymentData
    });
    
    console.log(`✓ Estimated gas: ${gasEstimate.toString()}`);
    
    // Deploy contract
    console.log("3. Deploying contract...");
    const ctiRegistry = await CTIRegistry.deploy();
    await ctiRegistry.waitForDeployment();
    
    const contractAddress = await ctiRegistry.getAddress();
    const deploymentTx = ctiRegistry.deploymentTransaction();
    
    console.log(`✓ Contract deployed: ${contractAddress}`);
    console.log(`✓ Transaction hash: ${deploymentTx.hash}`);
    
    // Wait for confirmations
    console.log("4. Waiting for confirmations...");
    const receipt = await deploymentTx.wait(3);
    console.log(`✓ Confirmed in block: ${receipt.blockNumber}`);
    
    // Save comprehensive deployment info
    const deploymentInfo = {
        network: hre.network.name,
        contractAddress: contractAddress,
        deploymentTime: new Date().toISOString(),
        deployer: deployer.address,
        transactionHash: deploymentTx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: deploymentTx.gasPrice.toString(),
        totalCost: (receipt.gasUsed * deploymentTx.gasPrice).toString()
    };
    
    fs.writeFileSync(
        'deployment.json', 
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    // Verify contract
    if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
        console.log("5. Verifying contract...");
        try {
            await hre.run("verify:verify", {
                address: contractAddress,
                constructorArguments: [],
            });
            console.log("✓ Contract verified on Etherscan");
        } catch (error) {
            console.log(`⚠ Verification failed: ${error.message}`);
        }
    }
    
    // Generate frontend config
    console.log("6. Generating frontend configuration...");
    const frontendConfig = {
        CONTRACT_ADDRESS: contractAddress,
        NETWORK: hre.network.name,
        CHAIN_ID: hre.network.config.chainId,
        DEPLOYMENT_BLOCK: receipt.blockNumber
    };
    
    fs.writeFileSync(
        'frontend-config.json',
        JSON.stringify(frontendConfig, null, 2)
    );
    
    console.log("🎉 Advanced deployment completed successfully!");
    console.log(`Total cost: ${hre.ethers.formatEther(receipt.gasUsed * deploymentTx.gasPrice)} ETH`);
}

advancedDeploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
```

### Batch Operations Script

Create `scripts/batch-operations.js`:

```javascript
const { ethers } = require("hardhat");

async function batchOperations() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const CTIRegistry = await ethers.getContractFactory("CTIRegistry");
    const contract = CTIRegistry.attach(contractAddress);
    
    console.log("📊 Batch Operations Dashboard");
    console.log("============================");
    
    // Get all CTI data
    const counter = await contract.ctiCounter();
    console.log(`Total CTIs: ${counter}`);
    
    const activeCTIs = await contract.getActiveCTIs(100, 0);
    console.log(`Active CTIs: ${activeCTIs.length}`);
    
    // Analyze CTI data
    const ctiData = [];
    for (let id of activeCTIs) {
        const cti = await contract.getCTI(id);
        const score = await contract.getCTIScore(id);
        
        ctiData.push({
            id: Number(id),
            title: cti.title,
            category: cti.category,
            submitter: cti.submitter,
            upvotes: Number(cti.upvotes),
            downvotes: Number(cti.downvotes),
            score: Number(score),
            timestamp: new Date(Number(cti.timestamp) * 1000)
        });
    }
    
    // Generate statistics
    const categories = {};
    const submitters = {};
    let totalVotes = 0;
    
    ctiData.forEach(cti => {
        categories[cti.category] = (categories[cti.category] || 0) + 1;
        submitters[cti.submitter] = (submitters[cti.submitter] || 0) + 1;
        totalVotes += cti.upvotes + cti.downvotes;
    });
    
    console.log("\n📈 Statistics:");
    console.log(`Total votes cast: ${totalVotes}`);
    console.log(`Average votes per CTI: ${(totalVotes / ctiData.length).toFixed(2)}`);
    
    console.log("\n🏷️ Categories:");
    Object.entries(categories).forEach(([category, count]) => {
        console.log(`  ${category}: ${count}`);
    });
    
    console.log("\n👥 Top Submitters:");
    Object.entries(submitters)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([submitter, count]) => {
            console.log(`  ${submitter.slice(0, 10)}...: ${count} CTIs`);
        });
    
    // Export data
    const fs = require('fs');
    fs.writeFileSync(
        `cti-export-${Date.now()}.json`,
        JSON.stringify(ctiData, null, 2)
    );
    
    console.log("\n💾 Data exported to cti-export-[timestamp].json");
}

batchOperations().catch(console.error);
```

### Automated Testing Pipeline

Create `scripts/test-pipeline.js`:

```javascript
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function runTestPipeline() {
    console.log("🧪 Starting Test Pipeline");
    console.log("========================");
    
    const tests = [
        {
            name: "Smart Contract Tests",
            command: "npx hardhat test",
            critical: true
        },
        {
            name: "Gas Usage Analysis",
            command: "npx hardhat test --reporter gas",
            critical: false
        },
        {
            name: "Contract Size Check",
            command: "npx hardhat compile",
            critical: true
        },
        {
            name: "Frontend Tests",
            command: "cd frontend && npm test -- --watchAll=false",
            critical: true
        },
        {
            name: "Build Test",
            command: "cd frontend && npm run build",
            critical: true
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        console.log(`\n🔄 Running: ${test.name}`);
        try {
            const { stdout, stderr } = await execAsync(test.command);
            console.log(`✅ ${test.name} - PASSED`);
            if (stdout) console.log(stdout);
            passed++;
        } catch (error) {
            console.log(`❌ ${test.name} - FAILED`);
            console.log(error.stdout || error.message);
            failed++;
            
            if (test.critical) {
                console.log("🚨 Critical test failed. Stopping pipeline.");
                process.exit(1);
            }
        }
    }
    
    console.log("\n📊 Test Pipeline Results");
    console.log("========================");
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
        console.log("🎉 All tests passed! Ready for deployment.");
    } else {
        console.log("⚠️ Some tests failed. Review before deployment.");
    }
}

runTestPipeline().catch(console.error);
```

---

## 📝 Final Checklist

Before going live, ensure you have completed:

### Development Phase
- [ ] All dependencies installed
- [ ] Local development environment working
- [ ] Smart contracts compiled without errors
- [ ] All tests passing (19/19)
- [ ] Frontend connecting to local blockchain
- [ ] IPFS uploads working locally

### Testing Phase
- [ ] Smart contract deployed to Sepolia testnet
- [ ] Frontend deployed to staging environment
- [ ] End-to-end testing completed
- [ ] Security testing performed
- [ ] Performance testing done
- [ ] Cross-browser testing completed

### Production Phase
- [ ] Environment variables configured securely
- [ ] Domain name purchased and configured
- [ ] SSL certificate installed
- [ ] Monitoring systems in place
- [ ] Backup procedures established
- [ ] Documentation updated
- [ ] Team trained on operations

### Post-Launch
- [ ] Contract verified on Etherscan
- [ ] Monitoring alerts configured
- [ ] User feedback system in place
- [ ] Analytics tracking enabled
- [ ] Support documentation created

---

## 🎯 Next Steps

After successful deployment:

1. **Community Building**: Engage with cybersecurity communities
2. **Content Creation**: Create tutorials and documentation
3. **Feature Enhancement**: Add new features based on user feedback
4. **Security Audits**: Regular security reviews and audits
5. **Scaling**: Consider Layer 2 solutions for lower costs
6. **Integration**: APIs for third-party integrations
7. **Mobile App**: React Native mobile application
8. **Enterprise Features**: Multi-sig, role-based access control

---

**🎉 Congratulations!** You now have a complete guide to deploy and operate your CTI blockchain platform. This guide covers everything from initial setup to production deployment and ongoing maintenance.

Remember to always test thoroughly before deploying to production, and keep your private keys secure!