import React, { useState } from "react";

const DistanceMap = () => {
  const [region, setRegion] = useState("");

  const estimate = region === "far" ? "50km - ₦3,000" : "10km - ₦800";

  return (
    <div className="bg-gray-900 p-4 rounded-lg mt-4 border border-gray-700">
      <h3 className="text-white font-bold mb-2">📍 Distance & Cost</h3>
      <select
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        onChange={(e) => setRegion(e.target.value)}
      >
        <option value="">Select Buyer Location</option>
        <option value="near">Nearby (Same City)</option>
        <option value="far">Inter-state</option>
      </select>

      {region && (
        <div className="mt-3 p-2 bg-[#1A1A2E] rounded border border-[#00FF88]">
          <p className="text-[#00FF88] font-mono">Est. Shipping: {estimate}</p>
        </div>
      )}
    </div>
  );
};

export default DistanceMap;
