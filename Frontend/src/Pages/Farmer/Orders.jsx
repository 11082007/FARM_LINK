import React, { useState } from 'react';
import { useWeb3 } from '../../Context/Web3Context';
import { useEscrow } from '../../Context/EscrowContext';
import { useNavigate } from 'react-router';
import { Search, Truck, CheckCircle } from 'lucide-react';
import Navbar from './FarmerNavbar';

const OrdersPage = () => {
  const { walletAddress } = useWeb3();
  const { escrows, markAsShipped } = useEscrow();
      const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const myEscrows = escrows.filter(e => e.seller === walletAddress);
  const pendingOrders = myEscrows.filter(e => e.status === 'pending');
  const verifiedOrders = myEscrows.filter(e => e.status === 'verified');
  const completedOrders = myEscrows.filter(e => e.status === 'released');

  const filteredOrders = myEscrows.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
      <>
      <Navbar />
    <div className="min-h-screen mt-14 bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">View and manage all customer orders</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="released">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Verified</div>
            <div className="text-2xl font-bold text-blue-600">{verifiedOrders.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-2xl font-bold text-green-600">{completedOrders.length}</div>
          </div>
        </div>

        {pendingOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pending Orders</h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                {pendingOrders.length} New
              </span>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingOrders.map(order => (
                <div key={order.id} className="p-6 bg-yellow-50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.productName}</h3>
                      <p className="text-sm text-gray-600">Order: {order.id}</p>
                      <p className="text-sm text-gray-600">Buyer: {order.buyer.slice(0, 10)}...</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">${order.amount}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => markAsShipped(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Truck size={18} />
                      Mark as Shipped
                    </button>
                    <button
                      onClick={() => navigate('/transaction', { hash: order.transactionHash })}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      View Transaction
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {verifiedOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Awaiting Fund Release</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {verifiedOrders.map(order => (
                <div key={order.id} className="p-4 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                      <p className="text-sm text-gray-600">Order: {order.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">${order.amount}</div>
                      <span className="text-xs text-blue-600">Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Completed Orders</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {completedOrders.map(order => (
              <div key={order.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                    <p className="text-sm text-gray-600">Completed: {new Date(order.releasedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle size={16} />
                    <span className="font-semibold">${order.amount}</span>
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
export default OrdersPage;
