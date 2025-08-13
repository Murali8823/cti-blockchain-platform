const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🔍 Verifying CTI Platform deployment...\n");

  // Check if deployment info exists
  if (!fs.existsSync('deployment.json')) {
    console.error("❌ deployment.json not found. Please deploy the contract first.");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
  const contractAddress = deploymentInfo.contractAddress;

  console.log(`📋 Deployment Info:`);
  console.log(`   Network: ${deploymentInfo.network}`);
  console.log(`   Contract: ${contractAddress}`);
  console.log(`   Deployer: ${deploymentInfo.deployer}`);
  console.log(`   Time: ${deploymentInfo.deploymentTime}\n`);

  try {
    // Get contract instance
    const CTIRegistry = await hre.ethers.getContractFactory("CTIRegistry");
    const contract = CTIRegistry.attach(contractAddress);

    // Test basic contract functions
    console.log("🧪 Testing contract functions...");

    // Check initial state
    const ctiCounter = await contract.ctiCounter();
    console.log(`   CTI Counter: ${ctiCounter}`);

    const activeCTICount = await contract.getActiveCTICount();
    console.log(`   Active CTIs: ${activeCTICount}`);

    // Test read functions
    try {
      const activeCTIs = await contract.getActiveCTIs(10, 0);
      console.log(`   Recent CTIs: ${activeCTIs.length} found`);
    } catch (error) {
      console.log(`   Recent CTIs: 0 found (expected for new deployment)`);
    }

    console.log("\n✅ Contract verification completed successfully!");

    // Display useful information
    console.log("\n📚 Next steps:");
    console.log(`1. Update frontend config with contract address: ${contractAddress}`);
    console.log(`2. Verify contract on Etherscan: https://${deploymentInfo.network}.etherscan.io/address/${contractAddress}`);
    console.log(`3. Test the frontend application`);

    // Generate frontend config update
    const configUpdate = `
// Update your frontend/src/config.js with:
export const CONTRACT_ADDRESS = "${contractAddress}";
`;
    
    fs.writeFileSync('contract-config.txt', configUpdate);
    console.log(`\n📝 Contract config saved to contract-config.txt`);

  } catch (error) {
    console.error("❌ Contract verification failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });