import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ useParams & useNavigate
import { useWeb3 } from '../Context/Web3Context';
import { CheckCircle, Clock, ExternalLink, AlertCircle } from 'lucide-react';

const TransactionDetail = () => {
  const { hash } = useParams(); // ✅ get hash from URL
  const navigate = useNavigate(); // ✅ navigation
  const { transactions } = useWeb3();

  const tx = transactions.find(t => t.hash === hash);

  if (!tx) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Transaction Not Found</h2>
          <p className="text-gray-600 mb-4">The transaction hash you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/blockchain-explorer')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Explorer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/blockchain-explorer')}
          className="mb-6 text-green-600 hover:text-green-700 flex items-center gap-2"
        >
          ← Back to Explorer
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="text-green-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
              <p className="text-gray-600">Complete information about this transaction</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
              tx.status === 'completed' ? 'bg-green-100 text-green-700' :
              tx.status === 'verified' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {tx.status === 'completed' && <CheckCircle size={16} />}
              {tx.status === 'verified' && <Clock size={16} />}
              {tx.status === 'pending' && <Clock size={16} />}
              {tx.status.toUpperCase()}
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            <DetailRow label="Transaction Hash" value={tx.hash} mono />
            <DetailRow label="Block Number" value={`#${tx.blockNumber}`} />
            <DetailRow label="Type" value={tx.type.replace(/_/g, ' ').toUpperCase()} />
            {tx.escrowId && <DetailRow label="Escrow ID" value={tx.escrowId} />}
            {tx.amount && <DetailRow label="Amount" value={`$${tx.amount.toFixed(2)}`} />}
            {tx.from && <DetailRow label="From" value={tx.from} mono />}
            {tx.to && <DetailRow label="To" value={tx.to} mono />}
            <DetailRow 
              label="Timestamp" 
              value={new Date(tx.timestamp).toLocaleString()} 
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ExternalLink className="text-blue-600 mt-1" size={20} />
            <div>
              <div className="font-medium text-blue-900">Blockchain Verified</div>
              <div className="text-sm text-blue-700">
                This transaction is permanently recorded on the AgriChain blockchain and cannot be altered.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, mono }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-200 last:border-0">
    <div className="text-sm font-medium text-gray-600 sm:w-1/3 mb-1 sm:mb-0">{label}</div>
    <div className={`text-sm text-gray-900 sm:w-2/3 ${mono ? 'font-mono break-all' : ''}`}>
      {value}
    </div>
  </div>
);

export default TransactionDetail;
