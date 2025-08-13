import React from 'react';
import { isMetaMaskInstalled } from '../utils/web3';

const WalletConnection = ({ onConnect, loading }) => {
  if (!isMetaMaskInstalled()) {
    return (
      <div className="wallet-connection">
        <h2>MetaMask Required</h2>
        <p>Please install MetaMask to use this application.</p>
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  return (
    <div className="wallet-connection">
      <h2>Welcome to CTI Platform</h2>
      <p>
        A decentralized platform for sharing and validating cyber threat intelligence.
        Connect your wallet to get started.
      </p>
      
      <div className="features-list" style={{ marginBottom: '2rem', textAlign: 'left', maxWidth: '600px', margin: '0 auto 2rem' }}>
        <h3>Features:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>📤</span>
            Submit cyber threat intelligence reports
          </li>
          <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>🗳️</span>
            Vote on CTI submissions for validation
          </li>
          <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>🔗</span>
            Immutable storage on blockchain and IPFS
          </li>
          <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>🔒</span>
            Decentralized and secure
          </li>
        </ul>
      </div>

      <button 
        className="btn btn-primary"
        onClick={onConnect}
        disabled={loading}
        style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
      >
        {loading ? (
          <>
            <div className="spinner" style={{ width: '20px', height: '20px', marginRight: '0.5rem' }}></div>
            Connecting...
          </>
        ) : (
          'Connect MetaMask Wallet'
        )}
      </button>
      
      <div className="network-info" style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        <p>Make sure you're connected to the Sepolia testnet</p>
        <p>Need test ETH? Get it from the <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer">Sepolia Faucet</a></p>
      </div>
    </div>
  );
};

export default WalletConnection;