// src/Components/Blockchain/BlockchainBadge.jsx
import React from "react";
import { ShieldCheck, Box } from "lucide-react";

export default function BlockchainBadge({ hash }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2 py-1 shadow-sm">
      <ShieldCheck className="h-3 w-3 text-green-600" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">
        On-Chain Verified
      </span>
      {hash && (
        <span className="ml-1 font-mono text-[10px] text-gray-400">
          #{hash.slice(0, 4)}...{hash.slice(-4)}
        </span>
      )}
    </div>
  );
}
