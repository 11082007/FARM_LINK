import React from "react";
import Card from "./Card"; // Importing your generic card
import { MapPin, Clock } from "lucide-react"; // install lucide-react or use standard icons

const ListingCard = ({ product }) => {
  const today = new Date();
  const harvestDate = new Date(product.harvestDate);
  const isPreOrder = harvestDate > today;

  // Web3 Color Logic
  const statusColor = isPreOrder ? "bg-[#007BFF]" : "bg-[#00FF88]"; // Blue for Future, Green for Now
  const statusText = isPreOrder
    ? `Pre-order (Ready: ${product.harvestDate})`
    : "Available Now";

  return (
    <Card className="bg-[#1A1A2E] border-[#00FF88] border shadow-[0_0_10px_rgba(0,255,136,0.1)] text-white hover:scale-105 transition-transform duration-200">
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <span
          className={`absolute top-2 right-2 ${statusColor} text-black text-xs font-bold px-3 py-1 rounded-full uppercase`}
        >
          {statusText}
        </span>
      </div>

      <Card.Header>
        <Card.Title className="text-[#00FF88] text-xl">
          {product.name}
        </Card.Title>
        <Card.Description className="text-gray-400 flex items-center gap-1">
          <MapPin size={14} /> {product.location || "Lagos, NG"}
        </Card.Description>
      </Card.Header>

      <Card.Content>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-400">Price per unit</p>
            <p className="text-2xl font-bold text-white">
              ₦{product.price.toLocaleString()}
            </p>
          </div>
          {isPreOrder && (
            <div className="text-right">
              <p className="text-xs text-[#007BFF] flex items-center justify-end gap-1">
                <Clock size={12} /> Harvest in{" "}
                {Math.ceil((harvestDate - today) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          )}
        </div>
      </Card.Content>

      <Card.Footer>
        <button
          className={`w-full py-2 rounded font-bold text-black transition-colors ${
            isPreOrder
              ? "bg-[#007BFF] hover:bg-blue-600 text-white"
              : "bg-[#00FF88] hover:bg-green-400"
          }`}
        >
          {isPreOrder ? "Book in Advance" : "Buy Now"}
        </button>
      </Card.Footer>
    </Card>
  );
};

export default ListingCard;
