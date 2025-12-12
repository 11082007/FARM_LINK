const EscrowWizard = ({ product, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const { walletAddress } = useWeb3();
  const { createEscrow } = useEscrow();
  const [escrowData, setEscrowData] = useState(null);

  const handleCreateEscrow = () => {
    setStep(2);
    setTimeout(() => {
      const escrow = createEscrow(
        product.id,
        product.price,
        product.seller,
        walletAddress,
        product.name
      );
      setEscrowData(escrow);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Escrow</h2>
            <p className="text-gray-600 mb-6">
              Create a secure escrow for this product. Funds held safely until delivery confirmed.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                  <Package size={32} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-gray-900">${product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-mono text-xs text-gray-900">
                    {product.seller.slice(0, 6)}...{product.seller.slice(-4)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                Cancel
              </button>
              <button onClick={handleCreateEscrow} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                Confirm & Create
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Creating Escrow...</h2>
            <p className="text-gray-600">Recording transaction on blockchain</p>
          </div>
        )}

        {step === 3 && escrowData && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Escrow Created!</h2>
              <p className="text-gray-600">Your transaction is now on the blockchain</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Escrow ID:</span>
                <span className="font-semibold text-gray-900">{escrowData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction:</span>
                <span className="font-mono text-xs text-gray-900">
                  {escrowData.transactionHash.slice(0, 10)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                  PENDING
                </span>
              </div>
            </div>

            <button onClick={() => onComplete(escrowData)} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EscrowWizard;