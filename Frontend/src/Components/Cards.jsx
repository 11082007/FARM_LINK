import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Package,
  ShoppingCart,
  Star,
  Shield,
  Lock,
} from "lucide-react";
import { useCart } from "../Context/CartContext";
import { useWeb3 } from "../Context/Web3Context";
import EscrowWizard from "./EscrowWizard";

const ProductCard = ({ product, onCreateEscrow }) => {
  // Safety check for undefined product
  if (!product) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 p-4 animate-pulse">
        <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          <div className="flex justify-between">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { walletAddress } = useWeb3();
  const [showEscrowModal, setShowEscrowModal] = useState(false);

  // Helper function to get image URL
  const getImageUrl = () => {
    // Debug: log what we have
    console.log("Product data:", product);
    console.log("Product imageUrl:", product.imageUrl);
    console.log("Product images array:", product.images);
    
    // If product has imageUrl (string), use it
    if (product.imageUrl && typeof product.imageUrl === 'string') {
      console.log("Using imageUrl:", product.imageUrl);
      return product.imageUrl;
    }
    
    // If product has images array, use first image
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      console.log("Using images[0]:", product.images[0]);
      return product.images[0];
    }
    
    // Fallback: create placeholder based on product name
    const productName = product.name || "Product";
    const placeholder = `https://placehold.co/500x400/10b981/white?text=${encodeURIComponent(productName)}`;
    console.log("Using placeholder:", placeholder);
    return placeholder;
  };

  // Also add safety checks for nested properties
  const {
    name = "Unknown Product",
    description = "No description available",
    category = "Uncategorized",
    price = 0,
    rating = 0,
    quantityAvailable = 0,
    location = "Location not specified",
    available = false,
    isVerified = false,
    id,
  } = product || {};

  // Get the image URL
  const imageUrl = getImageUrl();

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          <img
            src={imageUrl}
            alt={name}
            onError={(e) => {
              console.log("Image failed to load, using fallback");
              e.target.src = `https://placehold.co/500x400/10b981/white?text=${encodeURIComponent(name)}`;
            }}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Verified Badge */}
          {isVerified && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
              <Shield size={14} /> Verified
            </div>
          )}

          {/* Availability Badge */}
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
              available
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            {available ? "Available" : "Out of Stock"}
          </div>
        </div>
        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₦{price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">per kg</p>
            </div>

            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Package size={16} />
              <span className="text-sm font-medium">
                {quantityAvailable} kg
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-2">
            <MapPin size={14} />
            <span className="text-sm">{location}</span>
          </div>

          <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400 mt-2 text-sm">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            {rating}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            {/* View Details - Fixed: using product.id */}
            <button
              onClick={() => navigate(`/details/${product.id}`)}
              disabled={!available}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                available
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {available ? "View Details" : "Unavailable"}
            </button>

            {/* Add to Cart */}
            {available && (
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-lg flex items-center justify-center transition-all"
              >
                <ShoppingCart size={18} />
              </button>
            )}
          </div>

          {/* Create Escrow Button (if wallet is connected) */}
          {walletAddress && available && (
            <button
              onClick={() => setShowEscrowModal(true)}
              className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Lock size={16} /> Create Escrow
            </button>
          )}
        </div>
      </div>
      {/* Escrow Modal */}
      {showEscrowModal && (
        <EscrowWizard
          product={product}
          onClose={() => setShowEscrowModal(false)}
          onComplete={(escrow) => {
            setShowEscrowModal(false);
            onCreateEscrow?.(escrow);
          }}
        />
      )}
    </>
  );
};

export default ProductCard;