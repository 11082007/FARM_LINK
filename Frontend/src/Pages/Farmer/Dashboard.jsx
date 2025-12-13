import React, { useState } from "react";
import { useWeb3 } from "../../Context/Web3Context";
import { useEscrow } from "../../Context/EscrowContext";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Clock,
  DollarSign,
  Lock,
  Package,
  Star,
  ShoppingCart,
  Layers,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3,
  ArrowRight,
  Calendar,
  Eye,
  RefreshCw,
  ChevronRight,
  Truck,
  Shield,
  Store,
} from "lucide-react";
import Navbar from "./FarmerNavbar";

const FarmerDashboard = () => {
  const { walletAddress, balance } = useWeb3();
  const { escrows } = useEscrow();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const myEscrows = escrows.filter((e) => e.seller === walletAddress);
  const pendingOrders = myEscrows.filter((e) => e.status === "pending");
  const verifiedOrders = myEscrows.filter((e) => e.status === "verified");
  const completedOrders = myEscrows.filter((e) => e.status === "released");

  const totalEarnings = completedOrders.reduce((sum, e) => sum + e.amount, 0);
  const inEscrow = myEscrows
    .filter((e) => e.status !== "released")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalOrders = myEscrows.length;

  // Mock product data (replace with your actual product context)
  const mockProducts = [
    { id: 1, name: "Basmati Rice", sales: 42, price: 2500, rating: 4.8 },
    { id: 2, name: "Plantain", sales: 28, price: 1200, rating: 4.5 },
    { id: 3, name: "Fresh Tomatoes", sales: 35, price: 800, rating: 4.7 },
    { id: 4, name: "Organic Carrots", sales: 19, price: 600, rating: 4.9 },
  ];

  const topProducts = mockProducts;

  // If no wallet connected, show connect screen
  if (!walletAddress) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center mt-6 p-8">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Store size={64} className="text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
                Farmer Dashboard
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Connect your wallet to manage your farm products and orders
              </p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Store size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
                    <p className="text-green-100">
                      Manage your farm products and customer orders
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Available Balance</div>
                    <div className="text-xl font-bold">
                      ${balance?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Total Orders</div>
                    <div className="text-xl font-bold">{totalOrders}</div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-green-200 mb-1">
                  Total Earnings
                </div>
                <div className="text-5xl font-bold">
                  ${totalEarnings.toFixed(2)}
                </div>
                <div className="text-sm text-green-200 mt-2">
                  {completedOrders.length} completed orders
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {pendingOrders.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl shadow-lg p-6 mb-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Bell size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {pendingOrders.length} new order
                    {pendingOrders.length > 1 ? "s" : ""} awaiting processing
                  </h3>
                  <p className="text-yellow-100">
                    These orders require your attention in the Orders section
                  </p>
                </div>
                <button
                  onClick={() => navigate("/farmer/orders")}
                  className="px-6 py-3 bg-white text-yellow-700 rounded-lg font-semibold hover:bg-yellow-50 transition-colors"
                >
                  View Orders
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-linear-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Pending Orders
                </h3>
                <Clock
                  className="text-yellow-600 dark:text-yellow-400"
                  size={24}
                />
              </div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {pendingOrders.length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Awaiting processing
              </p>
            </div>

            <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Total Earnings
                </h3>
                <DollarSign
                  className="text-green-600 dark:text-green-400"
                  size={24}
                />
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${totalEarnings.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                All-time revenue
              </p>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  In Escrow
                </h3>
                <Lock className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${inEscrow.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Secured funds
              </p>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Active Products
                </h3>
                <Package
                  className="text-purple-600 dark:text-purple-400"
                  size={24}
                />
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {topProducts.length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Listed for sale
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => navigate("/farmer/orders")}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-green-200 dark:hover:border-green-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center">
                  <ShoppingCart
                    size={24}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all"
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Manage Orders
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Process customer orders
              </p>
            </button>

            <button
              onClick={() => navigate("/products")}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center">
                  <Package
                    size={24}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                My Products
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage farm inventory
              </p>
            </button>

            <button
              onClick={() => navigate("/farmer/blockchain")}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                  <Layers
                    size={24}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all"
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Blockchain
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View transactions
              </p>
            </button>

            <button
              onClick={() => navigate("/analytics")}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-yellow-200 dark:hover:border-yellow-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3
                    size={24}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                </div>
                <ArrowRight
                  size={20}
                  className="text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 group-hover:translate-x-1 transition-all"
                />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sales insights
              </p>
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200 dark:border-slate-700">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "orders", label: "Recent Orders", icon: ShoppingCart },
                  { id: "products", label: "Top Products", icon: Package },
                  { id: "activity", label: "Activity", icon: BarChart3 },
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
              {activeTab === "orders" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Recent Orders
                    </h3>
                    <button
                      onClick={() => navigate("/farmer/orders")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      View All Orders
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {myEscrows.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart
                        size={48}
                        className="text-gray-400 mx-auto mb-4"
                      />
                      <p className="text-gray-600 dark:text-gray-400">
                        No orders yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myEscrows.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  order.status === "released"
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                    : order.status === "verified"
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                                }`}
                              >
                                {order.status === "released" ? (
                                  <CheckCircle size={24} />
                                ) : order.status === "verified" ? (
                                  <Truck size={24} />
                                ) : (
                                  <Clock size={24} />
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {order.productName}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    ID: {order.id.slice(0, 8)}...
                                  </span>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      order.status === "released"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : order.status === "verified"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    }`}
                                  >
                                    {order.status.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${order.amount}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <Calendar size={14} />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "products" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Top Selling Products
                    </h3>
                    <button
                      onClick={() => navigate("/products")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Manage Products
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {topProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center">
                              <Package
                                size={24}
                                className="text-green-600 dark:text-green-400"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span>{product.sales} sales</span>
                                <span className="flex items-center gap-1">
                                  <Star
                                    size={14}
                                    className="fill-yellow-400 text-yellow-400"
                                  />
                                  {product.rating}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              ₦{product.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400">
                              ₦
                              {(product.price * product.sales).toLocaleString()}{" "}
                              revenue
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Recent Activity
                  </h3>
                  <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8">
                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {pendingOrders.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Pending Orders
                        </div>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {verifiedOrders.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          In Transit
                        </div>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          {completedOrders.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Delivered
                        </div>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                          {topProducts.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Active Products
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield
                  size={24}
                  className="text-green-600 dark:text-green-400"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Secure Payments
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All transactions protected by blockchain escrow. Funds released
                only after delivery confirmation.
              </p>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Growth Insights
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your sales are growing steadily. Consider adding more variety to
                your product lineup.
              </p>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users
                  size={24}
                  className="text-purple-600 dark:text-purple-400"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Customer Satisfaction
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Maintain high ratings by ensuring prompt delivery and quality
                produce.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerDashboard;
