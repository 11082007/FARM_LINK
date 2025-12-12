import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Wallet, Menu, X, Tractor } from "lucide-react";
import { useWeb3 } from "../../Context/Web3Context";

const FarmerNavbar = () => {
  const { walletAddress, connectDemoWallet, disconnectWallet, isConnecting } = useWeb3();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/farmer/dashboard", label: "Dashboard" },
    { path: "/farmer/orders", label: "Orders" },
    { path: "/farmer/products", label: "Products" },
    { path: "/farmer/blockchain", label: "Blockchain" },
    { path: "/farmer/analytics", label: "Analytics" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 w-full z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/farmer-dashboard" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold text-green-600">AgriChain</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">FARMER</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-green-600 border-b-2 border-green-600 pb-1"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet Connect - Desktop */}
          <div className="hidden md:flex items-center flex-shrink-0">
            {walletAddress ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <Wallet className="text-green-600" size={18} />
                <span className="text-sm font-mono text-green-900">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-green-600 hover:text-green-700 font-medium ml-2"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectDemoWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet size={18} />
                <span className="text-sm font-medium">
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Wallet Connect */}
            <div className="pt-4 border-t border-gray-200">
              {walletAddress ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="text-green-600" size={18} />
                    <span className="text-sm font-mono text-green-900">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="w-full text-sm text-green-600 hover:text-green-700 font-medium text-center"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectDemoWallet}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  <Wallet size={18} />
                  <span className="text-sm font-medium">
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default FarmerNavbar;
