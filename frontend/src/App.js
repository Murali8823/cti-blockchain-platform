import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import CTISubmission from './components/CTISubmission';
import CTIFeed from './components/CTIFeed';
import WalletConnection from './components/WalletConnection';
import { connectWallet, onAccountsChanged, onChainChanged, removeAllListeners } from './utils/web3';

function App() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already connected
    checkConnection();

    // Set up event listeners
    onAccountsChanged(handleAccountsChanged);
    onChainChanged(handleChainChanged);

    // Cleanup listeners on unmount
    return () => {
      removeAllListeners();
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      const account = await connectWallet();
      setAccount(account);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAccount('');
    setIsConnected(false);
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      handleDisconnect();
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  return (
    <div className="App">
      <Header 
        account={account}
        isConnected={isConnected}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        loading={loading}
      />
      
      <main className="main-content">
        {!isConnected ? (
          <WalletConnection onConnect={handleConnect} loading={loading} />
        ) : (
          <>
            <nav className="tab-navigation">
              <button 
                className={`tab-button ${activeTab === 'feed' ? 'active' : ''}`}
                onClick={() => setActiveTab('feed')}
              >
                CTI Feed
              </button>
              <button 
                className={`tab-button ${activeTab === 'submit' ? 'active' : ''}`}
                onClick={() => setActiveTab('submit')}
              >
                Submit CTI
              </button>
            </nav>

            <div className="tab-content">
              {activeTab === 'feed' && <CTIFeed account={account} />}
              {activeTab === 'submit' && <CTISubmission account={account} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
