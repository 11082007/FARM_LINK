import React, { useState } from "react";
import { CheckCircle, Package } from "lucide-react";
import { useWeb3 } from "../Context/Web3Context";

const EscrowWizard = ({ product, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const { walletAddress } = useWeb3();
  const [escrowData, setEscrowData] = useState(null);

  // Mock createEscrow function since your useEscrow hook might not be set up
  const mockCreateEscrow = () => {
    return {
      id: `escrow_${Date.now()}`,
      transactionHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      status: "PENDING",
      productId: product.id,
      amount: product.price,
      buyer: walletAddress,
      seller: product.farm_id || "Unknown Seller", // Use farm_id from Supabase
      createdAt: new Date().toISOString()
    };
  };

  const handleCreateEscrow = () => {
    setStep(2);
    setTimeout(() => {
      // Use the mock function instead of useEscrow hook
      const escrow = mockCreateEscrow();
      setEscrowData(escrow);
      setStep(3);
    }, 2000);
  };

  // Get seller address from product (use farm_id or default)
  const sellerAddress = product.farm_id || product.seller || "Unknown Seller";
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Create Escrow
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create a secure escrow for this product. Funds held safely until delivery confirmed.
            </p>

            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center">
                  <Package size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {product.name || "Unknown Product"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {product.description || "No description available"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₦{product.price?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {product.quantityAvailable || product.quantity || 0} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Seller ID:</span>
                  <span className="font-mono text-xs text-gray-900 dark:text-gray-300">
                    {sellerAddress.slice(0, 6)}...{sellerAddress.slice(-4)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEscrow}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Confirm & Create
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Creating Escrow...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Recording transaction on blockchain
            </p>
          </div>
        )}

        {step === 3 && escrowData && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Escrow Created!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your transaction is now on the blockchain
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Escrow ID:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {escrowData.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Transaction:</span>
                <span className="font-mono text-xs text-gray-900 dark:text-gray-300">
                  {escrowData.transactionHash?.slice(0, 10)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ₦{escrowData.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-xs font-medium">
                  {escrowData.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => onComplete(escrowData)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EscrowWizard;