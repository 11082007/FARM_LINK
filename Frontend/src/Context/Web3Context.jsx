import React, { createContext, useContext, useState } from 'react';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  // Connect demo wallet
  const connectDemoWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      const demoAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setWalletAddress(demoAddress);
      setIsConnecting(false);
    }, 1000);
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  // Add transaction to blockchain
  const addTransaction = (tx) => {
    const newTx = {
      ...tx,
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      timestamp: Date.now(),
      blockNumber: transactions.length + 1,
    };
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  return (
    <Web3Context.Provider value={{
      walletAddress,
      transactions,
      connectDemoWallet,
      disconnectWallet,
      addTransaction,
      isConnecting
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);