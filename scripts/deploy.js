const hre = require("hardhat");

async function main() {
  console.log("Deploying CTIRegistry contract...");

  // Get the contract factory
  const CTIRegistry = await hre.ethers.getContractFactory("CTIRegistry");
  
  // Deploy the contract
  const ctiRegistry = await CTIRegistry.deploy();
  
  // Wait for deployment to complete
  await ctiRegistry.waitForDeployment();
  
  const contractAddress = await ctiRegistry.getAddress();
  
  console.log(`CTIRegistry deployed to: ${contractAddress}`);
  console.log(`Network: ${hre.network.name}`);
  
  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deploymentTime: new Date().toISOString(),
    deployer: (await hre.ethers.getSigners())[0].address
  };
  
  fs.writeFileSync(
    'deployment.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment.json");
  
  // Verify contract on Etherscan (if not local network)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await ctiRegistry.deploymentTransaction().wait(6);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });