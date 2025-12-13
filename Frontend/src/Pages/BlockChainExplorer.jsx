import React, { useState } from 'react';
import { useWeb3 } from '../Context/Web3Context';
import { Search, Lock, Layers, Shield, Eye, Copy, CheckCircle, AlertCircle, TrendingUp, Calendar, Hash, ChevronRight, ExternalLink, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Buyer/Navbar';

const BlockchainExplorer = () => {
  const { transactions } = useWeb3();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedHash, setCopiedHash] = useState(null);

  // Format transaction hash for display
  const formatHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  // Copy hash to clipboard
  const copyToClipboard = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Filter transactions
  const filteredTxs = transactions.filter(tx => {
    const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.escrowId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalTransactions = transactions.length;
  const latestBlock = transactions[0]?.blockNumber || 0;
  const pendingTxs = transactions.filter(tx => tx.status === 'pending').length;
  const completedTxs = transactions.filter(tx => tx.status === 'completed').length;

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'verified': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    if (type.includes('escrow')) return <Shield size={16} className="text-green-600 dark:text-green-400" />;
    if (type.includes('release')) return <CheckCircle size={16} className="text-blue-600 dark:text-blue-400" />;
    return <Layers size={16} className="text-purple-600 dark:text-purple-400" />;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Layers size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Blockchain Explorer</h1>
                    <p className="text-blue-100">Real-time transaction tracking on AgriChain</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Network</div>
                    <div className="text-xl font-bold">Mainnet</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Gas Price</div>
                    <div className="text-xl font-bold">15 Gwei</div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-blue-200 mb-1">Latest Block</div>
                <div className="text-5xl font-bold">#{latestBlock}</div>
                <div className="text-sm text-blue-200 mt-2">Chain ID: 137</div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search by transaction hash, escrow ID, or type..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Filter size={20} className="text-gray-500 dark:text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Transactions</h3>
                <Layers className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{totalTransactions}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">On-chain records</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Pending</h3>
                <AlertCircle className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{pendingTxs}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Awaiting confirmation</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Completed</h3>
                <CheckCircle className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{completedTxs}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Finalized transactions</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Latest Block</h3>
                <Hash className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">#{latestBlock}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Current block height</p>
            </div>
          </div>

          {/* Transaction List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Showing {filteredTxs.length} of {totalTransactions} transactions
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Eye size={16} />
                  <span>Live updates</span>
                </div>
              </div>
            </div>

            {filteredTxs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={48} className="text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {transactions.length === 0 ? 'No Transactions Yet' : 'No Results Found'}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {transactions.length === 0 
                    ? 'Connect your wallet and create an escrow to see transactions here'
                    : 'Try adjusting your search or filter criteria'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredTxs.map((tx) => (
                  <div
                    key={tx.hash}
                    onClick={() => navigate(`/transaction/${tx.hash}`)}
                    className="group p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(tx.status)}`}>
                            {getTypeIcon(tx.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {tx.type?.replace(/_/g, ' ').toUpperCase()}
                              </span>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                                {tx.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                                {formatHash(tx.hash)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(tx.hash);
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                title="Copy hash"
                              >
                                {copiedHash === tx.hash ? <CheckCircle size={14} /> : <Copy size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Hash size={14} />
                            <span>Block #{tx.blockNumber}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                          </div>
                          {tx.escrowId && (
                            <div className="flex items-center gap-1">
                              <Shield size={14} />
                              <span className="font-mono">Escrow: {tx.escrowId.slice(0, 8)}...</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${tx.amount?.toFixed(2) || '0.00'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {tx.type === 'deposit' ? 'Received' : 'Sent'}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/transaction/${tx.hash}`);
                            }}
                            className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                            title="View details"
                          >
                            <Eye size={18} />
                          </button>
                          <ChevronRight 
                            size={20} 
                            className="text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors transform group-hover:translate-x-1" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {filteredTxs.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} />
                    <span>Real-time blockchain data</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                    >
                      Back to top
                    </button>
                    <span>Updated just now</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">About Blockchain Explorer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This explorer shows all transactions on the AgriChain network. Each transaction is verified on-chain and provides transparent tracking for all escrow activities.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <ExternalLink size={16} />
                <span>View on external explorer</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Network Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Network:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Polygon Mainnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Chain ID:</span>
                  <span className="font-medium text-gray-900 dark:text-white">137</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">RPC URL:</span>
                  <span className="font-medium text-gray-900 dark:text-white">https://polygon-rpc.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Explorer:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Polygonscan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockchainExplorer;