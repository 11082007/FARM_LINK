import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  Filter,
  RefreshCw,
  AlertCircle,
  Leaf
} from "lucide-react";

import { getProduceListings } from "../../Services/api";
import { useCart } from "../../Context/CartContext";
import SearchBar from "../../Components/Searchbar";
import FiltersPanel from "../../Components/FilterPanel";
import Navbar from "./Navbar";

// ✅ Your new escrow-enabled green card:
import ProductCard from "../../Components/Cards";

const BrowseProducts = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // -------------------------------------------------------
  // FETCH PRODUCE LISTINGS
  // -------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await getProduceListings();

        if (isMounted) {
          setListings(Array.isArray(response) ? response : response.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load listings. Please try again.");
          console.error("Error loading listings:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchListings();
    return () => { isMounted = false; };
  }, []);

  // -------------------------------------------------------
  // FILTER LOGIC
  // -------------------------------------------------------
  const categories = [...new Set(listings.map(item => item.category))];
  const locations = [...new Set(listings.map(item => item.location))];

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesLocation = !filters.location || item.location === filters.location;
    const matchesMinPrice = !filters.minPrice || item.pricePerKg >= Number(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || item.pricePerKg <= Number(filters.maxPrice);

    return matchesSearch && matchesCategory && matchesLocation && matchesMinPrice && matchesMaxPrice;
  });

  const hasActiveFilters =
    searchQuery || filters.category || filters.location || filters.minPrice || filters.maxPrice;

  const handleResetFilters = () => {
    setFilters({ category: "", location: "", minPrice: "", maxPrice: "" });
    setSearchQuery("");
  };

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  return (
    <>
    <Navbar />
    <div className="min-h-screen mt-14 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf size={32} className="text-white" />
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Browse Produce
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Fresh from local farms to your table
              </p>
            </div>
          </div>

          {/* CART BUTTON */}
          <button
            onClick={() => navigate("/cart")}
            className="relative group p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ShoppingCart
              size={24}
              className="text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors"
            />

            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
            <div className="flex-1 w-full">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                hasActiveFilters
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              <Filter size={20} />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>}
            </button>
          </div>

          {showFilters && (
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4 mt-4 animate-slideDown">
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                locations={locations}
                onReset={handleResetFilters}
              />
            </div>
          )}
        </div>

        {/* STATS BAR */}
        {!loading && !error && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-green-600 dark:text-green-400" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Showing{" "}
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {filteredListings.length}
                  </span>{" "}
                  of {listings.length} products
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
                >
                  <RefreshCw size={16} />
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-green-200 dark:border-green-900 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-green-600 dark:border-green-400 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium text-lg">
              Loading fresh produce...
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
          </div>
        )}

        {/* LISTINGS GRID */}
        {!loading && !error && (
          filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map(item => (
                <ProductCard key={item.id || item._id} produce={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={48} className="text-gray-400" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Products Found</h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {hasActiveFilters
                  ? "Try adjusting your filters or search terms to find what you're looking for."
                  : "No products are currently available. Check back soon!"}
              </p>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                >
                  <RefreshCw size={20} />
                  Clear All Filters
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
    </>
  );
};

export default BrowseProducts;
