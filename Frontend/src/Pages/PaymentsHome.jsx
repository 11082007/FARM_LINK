import React from 'react';
import { useNavigate } from 'react-router';
import { useWeb3 } from '../Context/Web3Context';
import { useEscrow } from '../Context/EscrowContext';
import  WalletConnect  from '../Components/WalletConnect';
import { Layers, Lock } from 'lucide-react';
import Header from '../Components/TransactionNavbar';

const PaymentsHome = () => {
  const navigate = useNavigate();
  const { walletAddress, transactions } = useWeb3();
  const { createEscrow } = useEscrow();

  const createDemoEscrow = () => {
    createEscrow(
      'PROD' + Date.now(),
      Math.floor(Math.random() * 500) + 100,
      '0x' + Math.random().toString(16).substr(2, 40),
      walletAddress
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
            <Header />
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Farm-Link</h1>
          <p className="text-xl text-gray-600">
            Secure agricultural transactions powered by blockchain technology
          </p>
        </div>

        {/* Wallet Connect */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Connect your demo wallet to explore blockchain-verified escrow transactions
          </p>
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        </div>

        {/* Actions & Summary */}
        {walletAddress && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/blockchain-explorer')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  <Layers size={20} /> View Explorer
                </button>
                <button
                  onClick={createDemoEscrow}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Lock size={20} /> Create Demo Escrow
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Summary</h3>
              <div className="text-3xl font-bold text-green-600">{transactions.length}</div>
              <p className="text-sm text-gray-600">Total Transactions</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentsHome;
