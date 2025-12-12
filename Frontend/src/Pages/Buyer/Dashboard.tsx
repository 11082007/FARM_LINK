import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, DollarSign, CheckCircle, ShoppingCart, TrendingUp, Layers, Wallet } from "lucide-react";
import { useWeb3 } from "../../Context/Web3Context";
import { useEscrow } from "../../Context/EscrowContext";
import Navbar from "./Navbar";

const UserDashboard = () => {
  const { walletAddress, transactions, connectDemoWallet, isConnecting } = useWeb3();
  const { escrows, verifyEscrow, releaseEscrow } = useEscrow();
  const navigate = useNavigate();

  // Filter buyer escrows
  const buyerEscrows = escrows.filter((e) => e.buyer === walletAddress);

  // If no wallet connected, show welcome page
  if (!walletAddress) {
    return (
      <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center mt-6 p-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              AgriChain Platform
            </h1>
            <p className="text-xl text-gray-600">
              Secure agricultural transactions powered by blockchain technology
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Get Started
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your demo wallet to explore blockchain-verified escrow transactions
            </p>
            <div className="flex justify-center">
              <button
                onClick={connectDemoWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet size={20} />
                {isConnecting ? 'Connecting...' : 'Connect Demo Wallet'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Summary</h3>
            <div className="text-3xl font-bold text-green-600">0</div>
            <p className="text-sm text-gray-600">Total Transactions</p>
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
    <div className="min-h-screen bg-gray-50 mt-12 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your escrows and transactions</p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/browse')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              <ShoppingCart size={20} />
              Marketplace
            </button>
            <button
              onClick={() => navigate('/blockchain-explorer')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              <Layers size={20} />
              Explorer
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <TrendingUp size={20} />
              My Orders
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Active Purchases</div>
              <Lock className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {buyerEscrows.filter((e) => e.status !== "released").length}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Spent</div>
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              $
              {buyerEscrows
                .reduce((sum, e) => sum + Number(e.amount || 0), 0)
                .toFixed(2)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Completed</div>
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {buyerEscrows.filter((e) => e.status === "released").length}
            </div>
          </div>
        </div>

        {/* PURCHASES LIST */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Purchases</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {buyerEscrows.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No purchases yet. Visit the marketplace to start buying!
              </div>
            ) : (
              buyerEscrows.map((escrow) => (
                <div key={escrow.id} className="p-4">
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {escrow.productName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Order ID: {escrow.id}
                      </p>
                    </div>
                    
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        escrow.status === "released"
                          ? "bg-green-100 text-green-700"
                          : escrow.status === "verified"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {escrow.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-gray-900 ml-2">
                        ${escrow.amount}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600">Ordered:</span>
                      <span className="text-gray-900 ml-2">
                        {new Date(escrow.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate("/transaction", {
                          state: { hash: escrow.transactionHash },
                        })
                      }
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                    >
                      View Transaction
                    </button>

                    {escrow.status === "pending" && (
                      <button
                        onClick={() => verifyEscrow(escrow.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        Mark as Received
                      </button>
                    )}

                    {escrow.status === "verified" && (
                      <button
                        onClick={() => releaseEscrow(escrow.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                      >
                        Release Funds
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="bg-white rounded-lg shadow-sm mt-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.hash}
                onClick={() =>
                  navigate("/transaction", { state: { hash: tx.hash } })
                }
                className="p-4 hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-sm text-gray-900 mb-1">
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tx.type?.replace(/_/g, " ")}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${tx.amount?.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default UserDashboard;