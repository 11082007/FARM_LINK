import React, { useState } from "react";
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  History,
  Send,
  Shield,
  CheckCircle,
  AlertCircle,
  Download,
  QrCode,
  ArrowDownToLine,
} from "lucide-react";
import { useWeb3 } from "../../Context/Web3Context";
import { useEscrow } from "../../Context/EscrowContext";
import Navbar from "./Navbar";

const WalletPage = () => {
  const { walletAddress, balance, transactions, connectDemoWallet, disconnectWallet, isConnecting } = useWeb3();
  const { escrows } = useEscrow();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate wallet stats
  const totalBalance = balance || 0;
  const totalEscrowed = escrows
    .filter(e => e.status === "pending" || e.status === "verified")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  
  const availableBalance = totalBalance - totalEscrowed;

  // Format wallet address
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Copy wallet address to clipboard
  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If no wallet connected, show connect screen
  if (!walletAddress) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center mt-6 p-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Connect Your Wallet
              </h1>
              <p className="text-gray-600">
                Connect your wallet to access funds, view transactions, and manage your digital assets
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Demo Wallet</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect a demo wallet to explore the platform features
                  </p>
                </div>

                <button
                  onClick={connectDemoWallet}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Wallet size={24} />
                  {isConnecting ? 'Connecting...' : 'Connect Demo Wallet'}
                </button>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Secure & Non-Custodial</h4>
                      <p className="text-sm text-blue-700">
                        Your keys, your crypto. We never have access to your funds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Wallet Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
                <p className="text-blue-100">Manage your digital assets and transactions</p>
                
                {/* Wallet Address */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 font-mono text-sm">
                    {formatAddress(walletAddress)}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <QrCode size={16} />
                    <span className="text-sm">QR</span>
                  </button>
                </div>
              </div>

              {/* Balance Display */}
              <div className="text-right">
                <div className="text-sm text-blue-200 mb-1">Total Balance</div>
                <div className="text-5xl font-bold">${totalBalance.toFixed(2)}</div>
                <div className="text-sm text-blue-200 mt-2">≈ ₦{(totalBalance * 1500).toLocaleString()}</div>
              </div>
            </div>

            {/* QR Code Modal */}
            {showQR && (
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg mb-3">
                  {/* Placeholder for QR Code - in real app, generate QR from walletAddress */}
                  <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <QrCode size={64} className="text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-blue-200 text-center">
                  Scan to receive funds
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <button className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Send size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">$0</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Sent</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Send</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transfer funds to another wallet</p>
            </button>

            <button className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <ArrowDownToLine size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">$0</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Received</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Receive</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get your wallet address or QR code</p>
            </button>

            <button 
              onClick={disconnectWallet}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <Wallet size={24} className="text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Disconnect</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Safely disconnect your wallet</p>
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mb-8">
            <div className="border-b border-gray-200 dark:border-slate-700">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "overview", label: "Overview", icon: DollarSign },
                  { id: "transactions", label: "Transactions", icon: History },
                  { id: "escrows", label: "Escrows", icon: Shield },
                  { id: "export", label: "Export", icon: Download }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-green-500 text-green-600 dark:text-green-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Balance Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Available</h3>
                        <DollarSign className="text-green-600 dark:text-green-400" size={24} />
                      </div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ${availableBalance.toFixed(2)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Ready to use</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">In Escrow</h3>
                        <Shield className="text-blue-600 dark:text-blue-400" size={24} />
                      </div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ${totalEscrowed.toFixed(2)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Secured transactions</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Total</h3>
                        <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
                      </div>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        ${totalBalance.toFixed(2)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">All assets</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {transactions.slice(0, 3).map((tx, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === "deposit" 
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            }`}>
                              {tx.type === "deposit" ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {tx.type === "deposit" ? "Received" : "Sent"}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(tx.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              tx.type === "deposit" 
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}>
                              {tx.type === "deposit" ? "+" : "-"}${tx.amount?.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatAddress(tx.hash)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "transactions" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction History</h3>
                  {transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <History size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b dark:border-slate-700">
                            <th className="pb-3">Type</th>
                            <th className="pb-3">Amount</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx, index) => (
                            <tr key={index} className="border-b dark:border-slate-700">
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  {tx.type === "deposit" ? (
                                    <TrendingUp size={16} className="text-green-500" />
                                  ) : (
                                    <TrendingDown size={16} className="text-red-500" />
                                  )}
                                  <span className="capitalize">{tx.type}</span>
                                </div>
                              </td>
                              <td className="py-4 font-medium">${tx.amount?.toFixed(2)}</td>
                              <td className="py-4 text-gray-500 dark:text-gray-400">
                                {new Date(tx.timestamp).toLocaleDateString()}
                              </td>
                              <td className="py-4">
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                                  Confirmed
                                </span>
                              </td>
                              <td className="py-4">
                                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 text-sm">
                                  <ExternalLink size={14} />
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "escrows" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Escrows</h3>
                  {escrows.filter(e => e.status !== "released").length === 0 ? (
                    <div className="text-center py-12">
                      <Shield size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No active escrows</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {escrows.filter(e => e.status !== "released").map((escrow) => (
                        <div key={escrow.id} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{escrow.productName}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">ID: {escrow.id}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              escrow.status === "verified"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                            }`}>
                              {escrow.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                              <span className="font-semibold text-gray-900 dark:text-white ml-2">
                                ${escrow.amount}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Created:</span>
                              <span className="text-gray-900 dark:text-white ml-2">
                                {new Date(escrow.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "export" && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Data</h3>
                  <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8">
                    <div className="text-center max-w-md mx-auto">
                      <Download size={48} className="text-gray-400 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Export Wallet Data</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Download your transaction history and wallet information for record keeping or tax purposes.
                      </p>
                      <div className="space-y-3">
                        <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                          Export as CSV
                        </button>
                        <button className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                          Export as PDF
                        </button>
                        <button className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
                          Export Full History
                        </button>
                      </div>
                      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            Never share your private keys or seed phrase. This export only contains transaction history.
                          </p>
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

export default WalletPage;