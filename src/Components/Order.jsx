import React, { useState } from "react";
import { X, Plus, Minus, Package, FileText, User, MapPin, Phone, Mail } from "lucide-react";

const OrderModal = ({ product, onClose, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: ""
  });

  if (!product) return null;

  const totalPrice = ((product.pricePerKg || product.price || 0) * quantity).toFixed(2);
  const maxQuantity = product.quantityAvailable || 100;

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBuyerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmOrder = () => {
    // Validate required fields
    if (!buyerInfo.name || !buyerInfo.phone || !buyerInfo.address || !buyerInfo.city) {
      alert("Please fill in all required fields (Name, Phone, Address, City)");
      return;
    }

    const orderItem = {
      ...product,
      quantity,
      notes,
      buyerInfo,
      total: parseFloat(totalPrice),
      orderDate: new Date().toISOString()
    };
    addToCart(orderItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl my-8 animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Complete Your Order</h2>
              <p className="text-green-100 text-sm">Fill in your details below</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Product Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-700/50 rounded-xl p-4">
            <div className="flex gap-4 items-center">
              <img
                src={product.imageUrl || product.image}
                alt={product.name}
                className="w-20 h-20 rounded-xl object-cover shadow-md"
                onError={(e) => {
                  e.target.src = `https://placehold.co/100x100/10b981/white?text=${product.name}`;
                }}
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {product.category}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ₦{(product.pricePerKg || product.price || 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">per kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package size={18} className="text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Quantity (kg) <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Minus size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
              
              <input
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(Math.max(val, 1), maxQuantity));
                }}
                className="flex-1 text-center text-xl font-bold border-2 border-gray-300 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              
              <button
                onClick={handleIncrement}
                disabled={quantity >= maxQuantity}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
              >
                <Plus size={20} className="text-white" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Available: {maxQuantity} kg
            </p>
          </div>

          {/* Buyer Information Section */}
          <div className="border-t-2 border-gray-200 dark:border-slate-700 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Buyer Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={buyerInfo.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full border-2 border-gray-300 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone size={14} className="inline mr-1" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={buyerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+234 800 000 0000"
                  className="w-full border-2 border-gray-300 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail size={14} className="inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={buyerInfo.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full border-2 border-gray-300 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin size={14} className="inline mr-1" />
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={buyerInfo.address}
                  onChange={handleInputChange}
                  placeholder="Street address, house number"
                  className="w-full border-2 border-gray-300 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={buyerInfo.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Lagos"
                  className="w-full border-2 border-gray-300 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={buyerInfo.state}
                  onChange={handleInputChange}
                  placeholder="e.g., Lagos State"
                  className="w-full border-2 border-gray-300 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Delivery Notes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Delivery Notes <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
            </div>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border-2 border-gray-300 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="e.g., Deliver early morning, handle with care, call before delivery..."
            />
          </div>

          {/* Total Price */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Total Amount</span>
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                ₦{Number(totalPrice).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 sticky bottom-0 bg-white dark:bg-slate-800 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmOrder}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;