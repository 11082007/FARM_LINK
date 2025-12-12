import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Lock, 
  DollarSign, 
  CheckCircle, 
  ShoppingCart, 
  TrendingUp, 
  Layers, 
  Wallet,
  Package,
  Shield,
  ArrowRight,
  Eye,
  Calendar,
  RefreshCw,
  BarChart3,
  User,
  Store
} from "lucide-react";
import { useWeb3 } from "../../Context/Web3Context";
import { useEscrow } from "../../Context/EscrowContext";
import Navbar from "./Navbar";

const UserDashboard = () => {
  const { walletAddress, transactions, connectDemoWallet, isConnecting, balance } = useWeb3();
  const { escrows, verifyEscrow, releaseEscrow } = useEscrow();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Filter buyer escrows
  const buyerEscrows = escrows.filter((e) => e.buyer === walletAddress);
  
  // Calculate stats
  const activePurchases = buyerEscrows.filter((e) => e.status !== "released").length;
  const totalSpent = buyerEscrows.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const completedOrders = buyerEscrows.filter((e) => e.status === "released").length;
  const pendingEscrows = escrows.filter(e => e.status === "pending" || e.status === "verified").length;

  // If no wallet connected, show enhanced welcome page
  if (!walletAddress) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 flex items-center justify-center mt-6 p-8">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Shield size={64} className="text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
                AgriChain Platform
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Secure agricultural transactions powered by blockchain escrow technology
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-10 mb-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Start Your Secure Journey
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Connect your wallet to access blockchain-verified escrow transactions, 
                  secure payments, and transparent supply chain tracking.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={connectDemoWallet}
                    disabled={isConnecting}
                    className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    <Wallet size={24} />
                    <span>{isConnecting ? 'Connecting...' : 'Connect Demo Wallet'}</span>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Secure Escrow</h3>
                  <p className="text-sm text-gray-600">
                    Funds held securely until delivery confirmation
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 size={24} className="text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Transparent Tracking</h3>
                  <p className="text-sm text-gray-600">
                    Real-time blockchain transaction visibility
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Store size={24} className="text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Farm Direct</h3>
                  <p className="text-sm text-gray-600">
                    Connect directly with verified local farmers
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to Transform Agriculture?</h3>
              <p className="text-green-100 mb-6">
                Join thousands of users already securing their transactions
              </p>
              <button
                onClick={connectDemoWallet}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                <Wallet size={20} />
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If wallet connected, show full dashboard
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <User size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Welcome Back!</h1>
                    <p className="text-green-100">Manage your agricultural transactions</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Wallet Balance</div>
                    <div className="text-xl font-bold">${balance?.toFixed(2) || "0.00"}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Active Orders</div>
                    <div className="text-xl font-bold">{activePurchases}</div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-green-200 mb-1">Total Escrowed</div>
                <div className="text-5xl font-bold">${totalSpent.toFixed(2)}</div>
                <div className="text-sm text-green-200 mt-2">{pendingEscrows} active escrows</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => navigate('/browse')}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-green-200 dark:hover:border-green-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <ArrowRight size={20} className="text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Marketplace</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Browse fresh produce</p>
            </button>

            <button
              onClick={() => navigate('/wallet')}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center">
                  <Wallet size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Wallet</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your funds</p>
            </button>

            <button
              onClick={() => navigate('/blockchain-explorer')}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                  <Layers size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <ArrowRight size={20} className="text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Explorer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View transactions</p>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-yellow-200 dark:hover:border-yellow-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <ArrowRight size={20} className="text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View insights</p>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Active Purchases</h3>
                <Lock className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {activePurchases}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Orders in progress</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Spent</h3>
                <DollarSign className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                ${totalSpent.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">All transactions</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Completed</h3>
                <CheckCircle className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {completedOrders}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Successful deliveries</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200 dark:border-slate-700">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "purchases", label: "My Purchases", icon: Package },
                  { id: "transactions", label: "Transactions", icon: Layers },
                  { id: "activity", label: "Activity", icon: BarChart3 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 py-5 px-1 font-medium text-sm border-b-2 transition-all ${
                      activeTab === tab.id
                        ? "border-green-500 text-green-600 dark:text-green-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "purchases" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">My Purchases</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                      <RefreshCw size={16} />
                      Refresh
                    </button>
                  </div>

                  {buyerEscrows.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={48} className="text-gray-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Purchases Yet</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Start shopping in the marketplace to see your purchases here
                      </p>
                      <button
                        onClick={() => navigate('/browse')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                      >
                        <ShoppingCart size={20} />
                        Browse Marketplace
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {buyerEscrows.map((escrow) => (
                        <div key={escrow.id} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                escrow.status === "released" 
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                  : escrow.status === "verified"
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                              }`}>
                                {escrow.status === "released" ? (
                                  <CheckCircle size={24} />
                                ) : escrow.status === "verified" ? (
                                  <Eye size={24} />
                                ) : (
                                  <Package size={24} />
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                  {escrow.productName}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Order ID: {escrow.id.slice(0, 8)}...
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    escrow.status === "released"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                      : escrow.status === "verified"
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  }`}>
                                    {escrow.status.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${escrow.amount}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <Calendar size={14} />
                                {new Date(escrow.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => navigate("/transaction", { state: { hash: escrow.transactionHash } })}
                              className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 text-sm font-medium transition-colors"
                            >
                              View Transaction
                            </button>

                            {escrow.status === "pending" && (
                              <button
                                onClick={() => verifyEscrow(escrow.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                              >
                                Mark as Received
                              </button>
                            )}

                            {escrow.status === "verified" && (
                              <button
                                onClick={() => releaseEscrow(escrow.id)}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-medium transition-colors"
                              >
                                Release Funds
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "transactions" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Transaction History</h3>
                  {transactions.length === 0 ? (
                    <div className="text-center py-16">
                      <Layers size={48} className="text-gray-400 mx-auto mb-6" />
                      <p className="text-gray-600 dark:text-gray-400">No transactions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.slice(0, 10).map((tx, index) => (
                        <div
                          key={index}
                          onClick={() => navigate("/transaction", { state: { hash: tx.hash } })}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === "deposit" 
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            }`}>
                              {tx.type === "deposit" ? <TrendingUp size={20} /> : <TrendingUp size={20} className="rotate-180" />}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white capitalize">
                                {tx.type?.replace(/_/g, " ")}
                              </div>
                              <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                                {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-semibold ${
                              tx.type === "deposit" 
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}>
                              {tx.type === "deposit" ? "+" : "-"}${tx.amount?.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "activity" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8">
                    <div className="text-center">
                      <BarChart3 size={64} className="text-blue-400 mx-auto mb-6" />
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Activity Insights</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Your transaction patterns and activity analytics will appear here
                      </p>
                      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4">
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{buyerEscrows.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
                        </div>
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{transactions.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Transactions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;