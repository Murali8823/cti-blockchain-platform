import React from 'react';
import { formatAddress } from '../utils/web3';

const Header = ({ account, isConnected, onConnect, onDisconnect, loading }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          🛡️ CTI Platform
        </div>
        
        <div className="wallet-info">
          {isConnected ? (
            <>
              <span className="account-address">
                {formatAddress(account)}
              </span>
              <button 
                className="btn btn-secondary"
                onClick={onDisconnect}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={onConnect}
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;