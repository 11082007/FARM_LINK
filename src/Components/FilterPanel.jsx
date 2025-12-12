import React from "react";
import { Filter, RotateCcw } from "lucide-react";

const FiltersPanel = ({ 
  filters = {}, 
  setFilters = () => {}, 
  categories = [], 
  locations = [],
  onReset
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const safeFilters = {
    category: filters.category || "",
    location: filters.location || "",
    minPrice: filters.minPrice || "",
    maxPrice: filters.maxPrice || "",
  };

  const hasActiveFilters = Object.values(safeFilters).some(val => val !== "");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Filter size={18} />
          <span className="font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:underline"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category */}
        <div>
          <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="filter-category"
            name="category"
            value={safeFilters.category}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="filter-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <select
            id="filter-location"
            name="location"
            value={safeFilters.location}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map((loc, i) => (
              <option key={i} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label htmlFor="filter-min" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min Price (₦)
          </label>
          <input
            id="filter-min"
            type="number"
            name="minPrice"
            placeholder="0"
            value={safeFilters.minPrice}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Max Price */}
        <div>
          <label htmlFor="filter-max" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Price (₦)
          </label>
          <input
            id="filter-max"
            type="number"
            name="maxPrice"
            placeholder="10000"
            value={safeFilters.maxPrice}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;