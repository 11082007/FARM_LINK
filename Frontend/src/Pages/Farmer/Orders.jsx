import React, { useState } from 'react';
import { useWeb3 } from '../../Context/Web3Context';
import { useEscrow } from '../../Context/EscrowContext';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Truck, 
  CheckCircle, 
  Filter, 
  Eye, 
  Calendar, 
  Package, 
  User, 
  DollarSign, 
  Clock,
  AlertCircle,
  Shield,
  ArrowRight,
  Copy,
  ChevronRight,
  Layers,
  TrendingUp
} from 'lucide-react';
import Navbar from './FarmerNavbar';

const OrdersPage = () => {
  const { walletAddress } = useWeb3();
  const { escrows, markAsShipped } = useEscrow();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  const myEscrows = escrows.filter(e => e.seller === walletAddress);
  const pendingOrders = myEscrows.filter(e => e.status === 'pending');
  const verifiedOrders = myEscrows.filter(e => e.status === 'verified');
  const completedOrders = myEscrows.filter(e => e.status === 'released');

  const filteredOrders = myEscrows.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.amount, 0);
  const pendingRevenue = pendingOrders.reduce((sum, order) => sum + order.amount, 0);
  const verifiedRevenue = verifiedOrders.reduce((sum, order) => sum + order.amount, 0);

  // Format wallet address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Copy order ID to clipboard
  const copyToClipboard = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'verified': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'released': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'verified': return <Truck size={16} />;
      case 'released': return <CheckCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Package size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Orders Management</h1>
                    <p className="text-green-100">Track and manage all customer orders</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Total Orders</div>
                    <div className="text-xl font-bold">{myEscrows.length}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Total Revenue</div>
                    <div className="text-xl font-bold">${totalRevenue.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-green-200 mb-1">Pending Actions</div>
                <div className="text-5xl font-bold">{pendingOrders.length}</div>
                <div className="text-sm text-green-200 mt-2">Orders awaiting processing</div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search by product name, order ID, or buyer address..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Filter size={20} className="text-gray-500 dark:text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="released">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Pending Orders</h3>
                <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                {pendingOrders.length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">${pendingRevenue.toFixed(2)} in escrow</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">In Transit</h3>
                <Truck className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {verifiedOrders.length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">${verifiedRevenue.toFixed(2)} verified</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Completed</h3>
                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {completedOrders.length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">${totalRevenue.toFixed(2)} earned</p>
            </div>
          </div>

          {/* Pending Orders Section */}
          {pendingOrders.length > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl shadow-lg mb-8 border-2 border-yellow-200 dark:border-yellow-800 overflow-hidden">
              <div className="p-6 border-b border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                      <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending Orders Require Action</h2>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Mark these orders as shipped to proceed with delivery
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
                    {pendingOrders.length} New
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {pendingOrders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                              <Package size={24} className="text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{order.productName}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                  <span>Order ID: {order.id.slice(0, 8)}...</span>
                                  <button
                                    onClick={() => copyToClipboard(order.id)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    title="Copy order ID"
                                  >
                                    {copiedOrderId === order.id ? <CheckCircle size={12} /> : <Copy size={12} />}
                                  </button>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                  <User size={12} />
                                  <span>Buyer: {formatAddress(order.buyer)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Calendar size={14} />
                              <span>Ordered: {new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <Shield size={14} />
                              <span>Escrow Active</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-4">
                          <div className="text-right">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">${order.amount}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Amount in escrow</div>
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={() => navigate(`/transaction/${order.transactionHash}`)}
                              className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 font-medium transition-colors flex items-center gap-2"
                            >
                              <Eye size={16} />
                              View Details
                            </button>
                            <button
                              onClick={() => markAsShipped(order.id)}
                              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                              <Truck size={18} />
                              Mark as Shipped
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* All Orders Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Orders</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Showing {filteredOrders.length} of {myEscrows.length} orders
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <TrendingUp size={16} />
                  <span>Order History</span>
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package size={48} className="text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {myEscrows.length === 0 ? 'No Orders Yet' : 'No Matching Orders'}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {myEscrows.length === 0 
                    ? 'You haven\'t received any orders yet. List your products to start selling.'
                    : 'Try adjusting your search or filter criteria'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredOrders.map(order => (
                  <div
                    key={order.id}
                    className="group p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-200"
                    onClick={() => navigate(`/transaction/${order.transactionHash}`)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{order.productName}</h3>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span>Order ID: {order.id.slice(0, 8)}...</span>
                              <span>Buyer: {formatAddress(order.buyer)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          {order.releasedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle size={14} />
                              <span>Completed: {new Date(order.releasedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Amount and Actions */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">${order.amount}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.status === 'released' ? 'Earned' : 'In escrow'}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/transaction/${order.transactionHash}`);
                            }}
                            className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                            title="View transaction"
                          >
                            <Eye size={18} />
                          </button>
                          {order.status === 'pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsShipped(order.id);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center gap-2"
                            >
                              <Truck size={16} />
                              Ship
                            </button>
                          )}
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
            {filteredOrders.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Layers size={16} />
                    <span>Blockchain-verified transactions</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                    >
                      Back to top
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Order Summary</h3>
                <p className="text-blue-100">
                  You have successfully completed {completedOrders.length} orders with ${totalRevenue.toFixed(2)} in total revenue.
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200 mb-1">Success Rate</div>
                <div className="text-5xl font-bold">
                  {myEscrows.length > 0 ? Math.round((completedOrders.length / myEscrows.length) * 100) : 0}%
                </div>
                <div className="text-sm text-blue-200 mt-2">Of orders completed successfully</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;