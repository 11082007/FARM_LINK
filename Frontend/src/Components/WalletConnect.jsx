import React from 'react';
import { useWeb3 } from '../Context/Web3Context';
import { Wallet } from 'lucide-react';

const WalletConnect = () => {
  const { walletAddress, connectDemoWallet, disconnectWallet, isConnecting } = useWeb3();

  if (walletAddress) {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
        <Wallet className="text-green-600" size={20} />
        <span className="text-sm font-mono text-green-900">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </span>
        <button
          onClick={disconnectWallet}
          className="text-xs text-green-600 hover:text-green-700 font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectDemoWallet}
      disabled={isConnecting}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
    >
      <Wallet size={20} />
      {isConnecting ? 'Connecting...' : 'Connect Demo Wallet'}
    </button>
  );
};
export default WalletConnect;