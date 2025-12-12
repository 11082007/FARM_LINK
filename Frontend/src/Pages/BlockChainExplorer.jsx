import React, { useState } from 'react';
import { useWeb3 } from '../Context/Web3Context';
import { Search, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import Navbar from './Buyer/Navbar';

const BlockchainExplorer = () => {
  const { transactions } = useWeb3();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTxs = transactions.filter(tx => 
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.escrowId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <>
      <Navbar/>
    <div className="min-h-screen mt-14 bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blockchain Explorer</h1>
          <p className="text-gray-600">View all transactions on the AgriChain network</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by transaction hash or escrow ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Total Transactions</div>
            <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Latest Block</div>
            <div className="text-2xl font-bold text-gray-900">#{transactions[0]?.blockNumber || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Network Status</div>
            <div className="text-2xl font-bold text-green-600">Active</div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredTxs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {transactions.length === 0 ? 'No transactions yet. Connect your wallet and create an escrow to get started.' : 'No transactions found'}
              </div>
            ) : (
              filteredTxs.map(tx => (
                <div
                  key={tx.hash}
                  onClick={() => navigate(`/transaction/${tx.hash}`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="text-green-600" size={16} />
                        <span className="font-mono text-sm text-gray-900">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                          tx.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Type: <span className="font-medium">{tx.type.replace(/_/g, ' ')}</span>
                        {tx.escrowId && <> • Escrow: {tx.escrowId}</>}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        ${tx.amount?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Block #{tx.blockNumber}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BlockchainExplorer;