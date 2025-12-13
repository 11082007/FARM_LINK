// src/Components/Blockchain/HashDisplay.jsx
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function HashDisplay({ label = "Transaction Hash", hash }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayHash = hash || "0x7f9a...3b21";

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
        {label}
      </div>
      <div className="flex items-center justify-between gap-2">
        <code className="truncate font-mono text-sm text-blue-600">
          {displayHash}
        </code>
        <button
          onClick={handleCopy}
          className="rounded-md p-1.5 hover:bg-gray-200 transition-colors"
          title="Copy Hash"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}
