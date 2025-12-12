import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduceListings } from "../../Services/api";
import { MapPin, Package, ShoppingCart, Zap, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useCart } from "../../Context/CartContext";
import OrderModal from "../../Components/Order";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);
  const [addedToCart, setAddedToCart] = React.useState(false);

  const product = getProduceListings.find(
    (item) => item.id === parseInt(productId)
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/buyer")}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const {
    name,
    category,
    pricePerKg,
    quantityAvailable,
    location,
    available,
    imageUrl,
    description,
  } = product;

  const handleOrderNow = () => {
    setIsOrderModalOpen(true);
  };

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Image Section */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 p-8 flex items-center justify-center">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full max-w-md h-[450px] object-cover rounded-2xl shadow-2xl"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/600x400/10b981/white?text=${name}`;
                  }}
                />
                
                {/* Availability Badge */}
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-semibold text-sm shadow-lg ${
                  available 
                    ? "bg-green-500 text-white" 
                    : "bg-red-500 text-white"
                }`}>
                  {available ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle size={16} />
                      Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle size={16} />
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                    {category}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Details Section */}
            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
                    {name}
                  </h1>
                  <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Description
                  </h2>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {description || "Fresh, high-quality produce sourced directly from local farms. Perfect for your daily needs with guaranteed freshness and excellent taste."}
                  </p>
                </div>

                {/* Price and Stock Info */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price per kg</p>
                      <p className="text-5xl font-bold text-green-600 dark:text-green-400">
                        ₦{pricePerKg.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 px-4 py-2 rounded-xl shadow-md">
                        <Package size={20} />
                        <div className="text-left">
                          <p className="text-xs text-gray-500 dark:text-gray-400">In Stock</p>
                          <p className="text-lg font-bold">{quantityAvailable} kg</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-700 px-4 py-3 rounded-xl">
                    <MapPin size={18} className="text-green-600 dark:text-green-400" />
                    <span className="font-medium">{location}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!available}
                    className={`group relative py-4 rounded-xl font-semibold text-white transition-all duration-200 overflow-hidden ${
                      available
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                        : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <ShoppingCart size={20} />
                      {addedToCart ? "Added!" : "Add to Cart"}
                    </span>
                    {available && (
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    )}
                  </button>

                  <button
                    onClick={handleOrderNow}
                    disabled={!available}
                    className={`group relative py-4 rounded-xl font-semibold text-white transition-all duration-200 overflow-hidden ${
                      available
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                        : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Zap size={20} />
                      Order Now
                    </span>
                    {available && (
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    )}
                  </button>
                </div>

                {!available && (
                  <div className="text-center py-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                      This product is currently unavailable
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Quality Assured</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fresh produce sourced directly from verified farms
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
              <Package size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quick and reliable delivery to your doorstep
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-4">
              <MapPin size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Local Source</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Supporting local farmers and communities
            </p>
          </div>
        </div>
      </div>

      {isOrderModalOpen && (
        <OrderModal
          product={product}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetails;