import { useState } from 'react';
import { useWeb3 } from '../../Context/Web3Context';
import { useNavigate } from 'react-router';
import { 
  Search, 
  Lock, 
  Activity, 
  Shield, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  ExternalLink,
  Hash,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  Layers,
  RefreshCw,
  User,
  FileText,
  Tag,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import Navbar from './FarmerNavbar';

const BlockchainPageFarmer = () => {
  const { transactions } = useWeb3();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Mock transaction data with all fields
  const mockTransactions = [
    {
      hash: '0x4a3b2c1d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a',
      escrowId: 'ESC-001',
      type: 'ESCROW_CREATED',
      productName: 'Organic Tomatoes',
      amount: 1250.50,
      status: 'completed',
      timestamp: '2024-01-15T10:30:00Z',
      blockNumber: 12345678,
      from: '0x1234...abcd',
      to: '0x5678...efgh',
      gasUsed: 21000,
      gasPrice: '0.00000005',
      confirmations: 12
    },
    {
      hash: '0x5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b',
      escrowId: 'ESC-002',
      type: 'PRODUCT_LISTED',
      productName: 'Fresh Carrots',
      amount: 850.75,
      status: 'pending',
      timestamp: '2024-01-15T09:15:00Z',
      blockNumber: 12345675,
      from: '0x1234...abcd',
      to: '0x5678...efgh',
      gasUsed: 18500,
      gasPrice: '0.00000004',
      confirmations: 6
    },
    {
      hash: '0x6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c',
      escrowId: 'ESC-003',
      type: 'ESCROW_RELEASED',
      productName: 'Basmati Rice',
      amount: 3200.00,
      status: 'verified',
      timestamp: '2024-01-14T14:45:00Z',
      blockNumber: 12345670,
      from: '0x1234...abcd',
      to: '0x5678...efgh',
      gasUsed: 23000,
      gasPrice: '0.00000006',
      confirmations: 24
    },
    {
      hash: '0x7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d',
      escrowId: 'ESC-004',
      type: 'QUALITY_VERIFIED',
      productName: 'Red Onions',
      amount: 450.25,
      status: 'failed',
      timestamp: '2024-01-13T16:20:00Z',
      blockNumber: 12345665,
      from: '0x1234...abcd',
      to: '0x5678...efgh',
      gasUsed: 19500,
      gasPrice: '0.00000005',
      confirmations: 0
    }
  ];

  const allTransactions = transactions.length > 0 ? transactions : mockTransactions;

  // Filter transactions
  const filteredTxs = allTransactions.filter(tx => {
    const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.escrowId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const metrics = {
    total: allTransactions.length,
    pending: allTransactions.filter(t => t.status === 'pending').length,
    completed: allTransactions.filter(t => t.status === 'completed').length,
    verified: allTransactions.filter(t => t.status === 'verified').length,
    failed: allTransactions.filter(t => t.status === 'failed').length,
    totalValue: allTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0),
    avgValue: allTransactions.length > 0 
      ? allTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0) / allTransactions.length 
      : 0,
    avgConfirmations: allTransactions.length > 0
      ? allTransactions.reduce((sum, tx) => sum + (tx.confirmations || 0), 0) / allTransactions.length
      : 0
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'verified':
        return <Shield size={16} className="text-blue-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };

  // Get status colors
  const getStatusColors = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'verified':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    if (type.includes('escrow') || type.includes('ESCROW')) {
      return <Lock size={16} className="text-purple-500" />;
    } else if (type.includes('product') || type.includes('PRODUCT')) {
      return <Package size={16} className="text-blue-500" />;
    } else if (type.includes('verification') || type.includes('QUALITY')) {
      return <Shield size={16} className="text-emerald-500" />;
    } else if (type.includes('payment')) {
      return <DollarSign size={16} className="text-green-500" />;
    }
    return <Activity size={16} className="text-gray-500" />;
  };

  // Format transaction type
  const formatTransactionType = (type) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString()
    };
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Layers size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Blockchain Transactions</h1>
                    <p className="text-emerald-100">Secure, transparent, and immutable transaction history</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Total Transactions</div>
                    <div className="text-xl font-bold">{metrics.total}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Total Value</div>
                    <div className="text-xl font-bold">${metrics.totalValue.toLocaleString()}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Success Rate</div>
                    <div className="text-xl font-bold">
                      {metrics.total > 0 ? ((metrics.completed + metrics.verified) / metrics.total * 100).toFixed(0) : 0}%
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Avg. Confirmations</div>
                    <div className="text-xl font-bold">{metrics.avgConfirmations.toFixed(0)}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors">
                  <RefreshCw size={18} />
                  Refresh
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
                  <Download size={18} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.completed + metrics.verified}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Successful</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {((metrics.completed + metrics.verified) / metrics.total * 100).toFixed(1)}% of total
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center">
                  <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.pending}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Awaiting confirmations
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${metrics.avgValue.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg. Value</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Per transaction
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                  <XCircle size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.failed}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Failed</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {(metrics.failed / metrics.total * 100).toFixed(1)}% failure rate
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by transaction hash, escrow ID, product name, or type..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <Filter size={18} />
                  Advanced Filters
                </button>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Transaction History</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {filteredTxs.length} transactions found • Total value: ${filteredTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sorted by: Most recent
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-700/50">
              {filteredTxs.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredTxs.map((tx) => {
                  const formattedDate = formatDate(tx.timestamp);
                  return (
                    <div
                      key={tx.hash}
                      onClick={() => navigate('/transaction', { state: { hash: tx.hash } })}
                      className="p-6 hover:bg-emerald-50/30 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-200 group border-l-4 border-transparent hover:border-emerald-500"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main Transaction Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg flex items-center justify-center">
                              {getTypeIcon(tx.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {formatTransactionType(tx.type)}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColors(tx.status)}`}>
                                  <span className="flex items-center gap-1.5">
                                    {getStatusIcon(tx.status)}
                                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                  </span>
                                </span>
                              </div>
                              
                              {tx.productName && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                                  <Package size={14} />
                                  <span className="font-medium">{tx.productName}</span>
                                  {tx.escrowId && (
                                    <>
                                      <span className="text-gray-300 dark:text-gray-600">•</span>
                                      <span className="flex items-center gap-1">
                                        <Lock size={14} />
                                        Escrow: {tx.escrowId}
                                      </span>
                                    </>
                                  )}
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1.5">
                                  <Hash size={14} />
                                  <span className="font-mono">{tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar size={14} />
                                  <span>{formattedDate.date} at {formattedDate.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Activity size={14} />
                                  <span>Block #{tx.blockNumber}</span>
                                </div>
                                {tx.confirmations !== undefined && (
                                  <div className="flex items-center gap-1.5">
                                    <Shield size={14} />
                                    <span>{tx.confirmations} confirmations</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Transaction Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <User size={14} className="text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
                              </div>
                              <div className="font-mono text-sm text-gray-900 dark:text-white truncate">
                                {tx.from}
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <User size={14} className="text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">To</span>
                              </div>
                              <div className="font-mono text-sm text-gray-900 dark:text-white truncate">
                                {tx.to}
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText size={14} className="text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">Gas Info</span>
                              </div>
                              <div className="text-sm text-gray-900 dark:text-white">
                                {tx.gasUsed?.toLocaleString()} gas • {tx.gasPrice} ETH
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Amount and Actions */}
                        <div className="lg:w-64 flex flex-col">
                          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-4 mb-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</div>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              ${tx.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                          
                          <div className="flex-1 flex items-end">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors group/view">
                              View Details
                              <ChevronRight size={16} className="group-hover/view:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Transaction Summary</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{metrics.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {((metrics.completed + metrics.verified) / metrics.total * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Transaction Value</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${metrics.avgValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Value</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${metrics.totalValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Status Distribution</h3>
              </div>
              <div className="space-y-4">
                {[
                  { status: 'Completed', count: metrics.completed, color: 'bg-green-500' },
                  { status: 'Verified', count: metrics.verified, color: 'bg-blue-500' },
                  { status: 'Pending', count: metrics.pending, color: 'bg-yellow-500' },
                  { status: 'Failed', count: metrics.failed, color: 'bg-red-500' },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.status}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${(item.count / metrics.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                  <Activity size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {filteredTxs.slice(0, 3).map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {formatTransactionType(tx.type)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(tx.timestamp).time}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">
                        ${tx.amount?.toFixed(2)}
                      </div>
                      <div className={`text-xs ${getStatusColors(tx.status)} px-2 py-0.5 rounded-full`}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Blockchain Info Section */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black rounded-2xl shadow-xl p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={24} className="text-emerald-400" />
                  <h3 className="text-2xl font-bold">Blockchain Security</h3>
                </div>
                <p className="text-slate-300">
                  All transactions are permanently recorded on the blockchain. Each transaction is cryptographically 
                  secured, immutable, and transparent. View your complete transaction history with full audit trails.
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-300 mb-1">Network Status</div>
                <div className="flex items-center justify-end gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="text-xl font-bold">Operational</div>
                </div>
                <div className="text-sm text-slate-300 mt-2">
                  All systems normal • 99.9% uptime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockchainPageFarmer;