// src/Components/Blockchain/VerificationStamp.jsx
import React from "react";
import { Check } from "lucide-react";

export default function VerificationStamp() {
  return (
    <div className="relative h-24 w-24">
      <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-75"></div>
      <div className="absolute inset-2 rounded-full border-4 border-dashed border-green-200"></div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 shadow-lg">
          <Check className="h-8 w-8 text-white" />
        </div>
      </div>

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-green-600">
          Block Mined
        </p>
      </div>
    </div>
  );
}
