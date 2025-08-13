#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up CTI Blockchain Platform...\n');

// Function to run commands
const runCommand = (command, description) => {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
};

// Function to check if file exists
const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

// Main setup function
async function setup() {
  try {
    // Check if we're in the right directory
    if (!fileExists('package.json') || !fileExists('contracts')) {
      console.error('❌ Please run this script from the project root directory');
      process.exit(1);
    }

    // Install backend dependencies
    runCommand('npm install', 'Installing backend dependencies');

    // Install frontend dependencies
    if (fileExists('frontend')) {
      process.chdir('frontend');
      runCommand('npm install', 'Installing frontend dependencies');
      process.chdir('..');
    }

    // Check for .env file
    if (!fileExists('.env')) {
      console.log('📝 Creating .env file from template...');
      if (fileExists('.env.example')) {
        fs.copyFileSync('.env.example', '.env');
        console.log('✅ .env file created. Please update it with your configuration.\n');
      }
    }

    // Check for frontend .env file
    if (fileExists('frontend') && !fileExists('frontend/.env')) {
      console.log('📝 Creating frontend .env file from template...');
      if (fileExists('frontend/.env.example')) {
        fs.copyFileSync('frontend/.env.example', 'frontend/.env');
        console.log('✅ Frontend .env file created. Please update it with your configuration.\n');
      }
    }

    // Compile contracts
    runCommand('npx hardhat compile', 'Compiling smart contracts');

    // Run tests
    runCommand('npx hardhat test', 'Running smart contract tests');

    console.log('🎉 Setup completed successfully!\n');
    console.log('📋 Next steps:');
    console.log('1. Update .env with your Alchemy API key and private key');
    console.log('2. Update frontend/.env with your Web3.Storage token');
    console.log('3. Deploy contract: npm run deploy');
    console.log('4. Update frontend config with contract address');
    console.log('5. Start frontend: npm run frontend\n');
    
    console.log('📚 Useful commands:');
    console.log('- npm run deploy: Deploy to Sepolia testnet');
    console.log('- npm run test: Run smart contract tests');
    console.log('- npm run frontend: Start React development server');
    console.log('- npm run node: Start local Hardhat node\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setup();