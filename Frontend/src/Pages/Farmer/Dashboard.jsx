import { useWeb3 } from '../../Context/Web3Context';
import { useEscrow } from '../../Context/EscrowContext';
// import { useProducts } from '../../Context/ProductsContext';
import { useNavigate } from 'react-router';
import { Bell, Clock, DollarSign, Lock, Package, Star, ShoppingCart, Layers } from 'lucide-react';
import Navbar from './FarmerNavbar';

const FarmerDashboard = () => {
  const { walletAddress } = useWeb3();
  const { escrows } = useEscrow();
  // const { products } = useProducts();
  const navigate = useNavigate();

  const myEscrows = escrows.filter(e => e.seller === walletAddress);
  const pendingOrders = myEscrows.filter(e => e.status === 'pending');
  const verifiedOrders = myEscrows.filter(e => e.status === 'verified');
  const completedOrders = myEscrows.filter(e => e.status === 'released');

  const totalEarnings = completedOrders.reduce((sum, e) => sum + e.amount, 0);
  const inEscrow = myEscrows.filter(e => e.status !== 'released').reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
    <Navbar />  
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your farm business.</p>
        </div>

        {pendingOrders.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="text-yellow-600" size={24} />
              <div>
                <h3 className="text-sm font-semibold text-yellow-900">
                  {pendingOrders.length} new order{pendingOrders.length > 1 ? 's' : ''} waiting!
                </h3>
                <p className="text-sm text-yellow-700">
                  Click "Orders" to view and process them.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Pending Orders</div>
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{pendingOrders.length}</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Earnings</div>
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-green-600">${totalEarnings.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">In Escrow</div>
              <Lock className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-blue-600">${inEscrow.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Active Products</div>
              <Package className="text-purple-600" size={20} />
            </div>
            {/* <div className="text-3xl font-bold text-gray-900">{products.length}</div> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {myEscrows.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{order.productName}</div>
                    <div className="text-sm text-gray-600">{order.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${order.amount}</div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'released' ? 'bg-green-100 text-green-700' :
                      order.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              View All Orders
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
            <div className="space-y-3">
              {/* {products.slice(0, 5).map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-600">{product.sales} sales</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${product.price}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      {product.rating}
                    </div>
                  </div>
                </div>
              ))} */}
            </div>
            <button
              onClick={() => navigate('/products')}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Manage Products
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/farmer/orders')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition text-left"
          >
            <ShoppingCart className="text-green-600 mb-3" size={32} />
            <h3 className="font-semibold text-gray-900 mb-1">Manage Orders</h3>
            <p className="text-sm text-gray-600">Process and track customer orders</p>
          </button>

          <button
            onClick={() => navigate('/products')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition text-left"
          >
            <Package className="text-blue-600 mb-3" size={32} />
            <h3 className="font-semibold text-gray-900 mb-1">My Products</h3>
            <p className="text-sm text-gray-600">Add, edit, and manage your inventory</p>
          </button>

          <button
            onClick={() => navigate('/farmer/blockchain')}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition text-left"
          >
            <Layers className="text-purple-600 mb-3" size={32} />
            <h3 className="font-semibold text-gray-900 mb-1">Blockchain</h3>
            <p className="text-sm text-gray-600">View transaction history</p>
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
export default FarmerDashboard;