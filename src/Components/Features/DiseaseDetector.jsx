import React, { useState } from "react";

const DiseaseDetector = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult("Detected: Early Blight. Recommendation: Apply Fungicide X.");
    }, 2500);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-dashed border-[#00FF88] text-center">
      <h3 className="text-[#00FF88] font-bold mb-2">🤖 AI Disease Scanner</h3>
      <input type="file" className="text-sm text-gray-400 mb-4" />
      <button
        onClick={handleAnalyze}
        className="bg-[#007BFF] text-white px-4 py-2 rounded-full w-full"
      >
        {loading ? "Scanning..." : "Analyze Plant"}
      </button>
      {result && <p className="mt-3 text-green-400 text-sm">{result}</p>}
    </div>
  );
};

export default DiseaseDetector;
