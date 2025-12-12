import React from "react";
import { useCart } from "../../Context/CartContext";
import { Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.pricePerKg, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center">
              <ShoppingBag size={64} className="text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to find fresh produce!
          </p>
          <button
            onClick={() => navigate("/buyer")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Shopping
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                  <p className="text-green-100 text-sm">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={clearCart}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-all duration-200"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="p-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl shadow-md"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/100x100/10b981/white?text=${item.name}`;
                        }}
                         onClick = {() => navigate(`/details/${item.id}`)}
                      />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Package size={16} className="text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 capitalize">
                        {item.category}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ₦{item.pricePerKg.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          per kg
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Total Amount
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₦{total.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/buyer")}
                className="flex-1 py-3 px-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200"
              >
                Continue Shopping
              </button>
              <button
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;