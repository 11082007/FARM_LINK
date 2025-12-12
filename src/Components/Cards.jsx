import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Package, ShoppingCart } from "lucide-react";
import { useCart } from "../Context/CartContext";

const Card = ({ produce }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const {
    id,
    name,
    category,
    pricePerKg,
    quantityAvailable,
    location,
    available,
    imageUrl,
  } = produce;

  const handleAddToCart = () => {
    addToCart(produce);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={name}
          onError={(e) => {
            e.target.src = `https://placehold.co/500x400/10b981/white?text=${name}`;
          }}
          className="w-full h-full object-cover"
          loading="lazy"
        />
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

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {category}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₦{pricePerKg.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">per kg</p>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Package size={16} />
            <span className="text-sm font-medium">{quantityAvailable} kg</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-4">
          <MapPin size={14} />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/details/${id}`)}
            disabled={!available}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
              available
                ? "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {available ? "View Details" : "Unavailable"}
          </button>

          {available && (
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-lg flex items-center justify-center transition-all"
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
