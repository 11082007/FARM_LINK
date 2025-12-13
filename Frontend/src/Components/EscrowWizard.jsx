import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Lock, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  AlertCircle,
  DollarSign,
  Clock,
  Truck
} from 'lucide-react';
import { createEscrow } from '../Services/api.js';
import { useAuth } from '../Context/AuthContext.jsx';
import { useWeb3 } from '../Context/Web3Context.jsx';

const EscrowWizard = ({ product, onClose, onComplete }) => {
  const { user, profile } = useAuth();
  const { walletAddress, createTransaction } = useWeb3();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [escrowData, setEscrowData] = useState({
    quantity: 1,
    deliveryAddress: '',
    deliveryDate: '',
    inspectionPeriod: 48, // hours
    termsAccepted: false
  });

  const totalAmount = product.pricePerKg * escrowData.quantity;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEscrowData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
    setError('');
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleCreateEscrow = async () => {
  console.log('🔍 DEBUG: Starting escrow creation...');
  console.log('🔍 DEBUG: user object:', user);
  console.log('🔍 DEBUG: profile object:', profile);
  console.log('🔍 DEBUG: walletAddress:', walletAddress);
  console.log('🔍 DEBUG: product:', product);
  console.log('🔍 DEBUG: termsAccepted:', escrowData.termsAccepted);
  
  if (!escrowData.termsAccepted) {
    setError('You must accept the terms and conditions');
    return;
  }

  // Check if user is logged in - FIXED: user.id exists, so user is logged in
  if (!user || !user.id) {
    console.error('❌ User not logged in or missing ID');
    setError('Please login to create an escrow');
    return;
  }

  // ✅ FIX: Check if profile exists, but allow escrow creation even if profile is null
  // We'll use user data as fallback
  const userFirstName = profile?.first_name || user.user_metadata?.first_name || 'Buyer';
  const userLastName = profile?.last_name || user.user_metadata?.last_name || 'User';
  
  console.log('✅ Using name:', userFirstName, userLastName);

  setLoading(true);
  setError('');

  try {
    console.log('🚀 Creating escrow with data:', {
      productId: product.id,
      productName: product.name,
      buyerId: user.id,
      buyerName: `${userFirstName} ${userLastName}`,
      amount: totalAmount
    });

    // 1. Create escrow record in Supabase
    const escrow = await createEscrow(
      {
        id: product.id,
        name: product.name,
        // Add fallback values for farmer data
        farmer_id: product.farmer_id || product.farm_id || 'unknown_farmer',
        farmer_name: product.farmer_name || product.farmerName || 'Unknown Farmer',
        pricePerKg: product.pricePerKg,
        quantityAvailable: product.quantityAvailable
      },
      { 
        id: user.id, 
        first_name: userFirstName,  // ✅ Use fallback name
        last_name: userLastName     // ✅ Use fallback name
      },
      totalAmount
    );

    console.log('✅ Escrow created:', escrow);

    // 2. Mock blockchain transaction
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // 3. Call onComplete callback
    onComplete({
      ...escrow,
      transactionHash: mockTxHash,
      quantity: escrowData.quantity,
      totalAmount,
      deliveryAddress: escrowData.deliveryAddress,
      deliveryDate: escrowData.deliveryDate
    });

    // Optionally close modal after success
    setTimeout(() => {
      onClose();
      // Optional: Show success message
      alert('✅ Escrow created successfully! Check your wallet for the transaction.');
    }, 2000);

  } catch (error) {
    console.error('❌ Escrow creation failed:', error);
    console.error('❌ Full error details:', error.message, error.stack);
    setError(error.message || 'Failed to create escrow. Please try again.');
  } finally {
    setLoading(false);
  }
};

  // Step 1: Quantity Selection
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Package className="text-green-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Select Quantity</h3>
          <p className="text-gray-600">Choose how much you want to purchase</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-bold text-gray-900">{product.name}</h4>
            <p className="text-sm text-gray-600">₦{product.pricePerKg.toLocaleString()} per kg</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ₦{totalAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total amount</div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Quantity (kg)
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setEscrowData(prev => ({ 
                ...prev, 
                quantity: Math.max(1, prev.quantity - 1) 
              }))}
              className="w-12 h-12 rounded-xl border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <span className="text-2xl font-bold">-</span>
            </button>
            
            <div className="flex-1">
              <input
                type="range"
                name="quantity"
                min="1"
                max={product.quantityAvailable}
                value={escrowData.quantity}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>1 kg</span>
                <span className="font-bold text-lg">{escrowData.quantity} kg</span>
                <span>{product.quantityAvailable} kg max</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEscrowData(prev => ({ 
                ...prev, 
                quantity: Math.min(product.quantityAvailable, prev.quantity + 1) 
              }))}
              className="w-12 h-12 rounded-xl border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <span className="text-2xl font-bold">+</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Unit Price</div>
              <div className="text-lg font-bold">₦{product.pricePerKg.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Price</div>
              <div className="text-2xl font-bold text-green-600">
                ₦{totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Delivery Details
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Truck className="text-blue-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Delivery Details</h3>
          <p className="text-gray-600">Where and when should we deliver?</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Address
          </label>
          <textarea
            name="deliveryAddress"
            value={escrowData.deliveryAddress}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
            rows="3"
            placeholder="Enter your full delivery address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Delivery Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="date"
              name="deliveryDate"
              value={escrowData.deliveryDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inspection Period
          </label>
          <div className="flex items-center gap-3">
            <Clock className="text-gray-400" size={20} />
            <select
              name="inspectionPeriod"
              value={escrowData.inspectionPeriod}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
            >
              <option value="24">24 hours</option>
              <option value="48">48 hours (Recommended)</option>
              <option value="72">72 hours</option>
              <option value="168">7 days</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            You'll have this time to inspect the goods after delivery before payment is released
          </p>
        </div>
      </div>
    </div>
  );

  // Step 3: Terms and Summary
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Shield className="text-purple-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Escrow Terms</h3>
          <p className="text-gray-600">Review and accept the terms</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <DollarSign className="text-green-600 mt-1" size={20} />
          <div>
            <h4 className="font-bold text-gray-900">Secure Payment</h4>
            <p className="text-sm text-gray-600">
              Your payment of ₦{totalAmount.toLocaleString()} will be held securely in escrow until you confirm receipt.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="text-blue-600 mt-1" size={20} />
          <div>
            <h4 className="font-bold text-gray-900">Quality Inspection</h4>
            <p className="text-sm text-gray-600">
              You have {escrowData.inspectionPeriod} hours to inspect the goods after delivery.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-600 mt-1" size={20} />
          <div>
            <h4 className="font-bold text-gray-900">Dispute Resolution</h4>
            <p className="text-sm text-gray-600">
              If there's an issue, you can raise a dispute within the inspection period.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              name="termsAccepted"
              checked={escrowData.termsAccepted}
              onChange={handleInputChange}
              className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the escrow terms and understand that:
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>• Payment will be released to the farmer after I confirm delivery</li>
                <li>• I can raise a dispute within {escrowData.inspectionPeriod} hours of delivery</li>
                <li>• The farmer will ship the goods within 3 business days</li>
                <li>• I'm responsible for providing accurate delivery information</li>
              </ul>
            </label>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
        <h4 className="font-bold text-gray-900 mb-4">Order Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Product</span>
            <span className="font-medium">{product.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quantity</span>
            <span className="font-medium">{escrowData.quantity} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Unit Price</span>
            <span className="font-medium">₦{product.pricePerKg.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery</span>
            <span className="font-medium">
              {escrowData.deliveryDate ? new Date(escrowData.deliveryDate).toLocaleDateString() : 'Not set'}
            </span>
          </div>
          <div className="pt-3 border-t border-green-200">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-green-600">
                ₦{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Confirmation
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Lock className="text-emerald-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Confirm Escrow</h3>
          <p className="text-gray-600">Review and create your secure escrow</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-green-600" size={32} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            Ready to Create Escrow
          </h4>
          <p className="text-gray-600 mb-6">
            Your payment of ₦{totalAmount.toLocaleString()} will be secured until delivery is confirmed.
          </p>

          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-gray-700">From</span>
              <span className="font-mono text-sm">
                {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-gray-700">To</span>
              <span className="font-medium">Escrow Smart Contract</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-gray-700">Network</span>
              <span className="font-medium">Ethereum (Testnet)</span>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Quantity', component: renderStep1() },
    { number: 2, title: 'Delivery', component: renderStep2() },
    { number: 3, title: 'Terms', component: renderStep3() },
    { number: 4, title: 'Confirm', component: renderStep4() }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Secure Escrow Purchase
                </h2>
                <p className="text-gray-600">Step {currentStep} of 4</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                {steps.map(step => (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step.number === currentStep
                          ? 'border-green-600 bg-green-600 text-white'
                          : step.number < currentStep
                          ? 'border-green-600 bg-green-600 text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}>
                        {step.number < currentStep ? (
                          <CheckCircle size={20} />
                        ) : (
                          step.number
                        )}
                      </div>
                      <span className={`text-xs mt-2 ${
                        step.number === currentStep
                          ? 'text-green-600 font-bold'
                          : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {step.number < steps.length && (
                      <div className={`flex-1 h-1 mx-2 ${
                        step.number < currentStep ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {steps[currentStep - 1].component}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-medium ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Back
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleCreateEscrow}
                  disabled={loading || !escrowData.termsAccepted}
                  className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 ${
                    loading || !escrowData.termsAccepted
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Escrow...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Confirm & Create Escrow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowWizard;