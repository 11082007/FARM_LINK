import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  Plus,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Calendar,
  MapPin,
  Leaf,
} from "lucide-react";
// import Button from "../Components/Button/index.jsx";
import Button from "../../Components/Button/index.jsx";
import Card from "../../Components/Card/index.jsx";
import BlockchainBadge from "../../Components/Blockchain/BlockChainBadge.jsx";

const MOCK_LISTINGS = [
  {
    id: 1,
    name: "Yellow Maize",
    price: 1200,
    unit: "kg",
    quantity: 500,
    harvestDate: "2023-10-25",
    image:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 2,
    name: "Red Tomatoes",
    price: 800,
    unit: "basket",
    quantity: 50,
    harvestDate: "2025-12-20",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=80",
  },
];

const MOCK_INQUIRIES = [
  {
    id: 1,
    buyer: "Shoprite Logistics",
    message: "Do you have 200kg of Maize available for pickup tomorrow?",
    time: "2 hrs ago",
  },
  {
    id: 2,
    buyer: "Mama Nkechi",
    message: "Is the tomato price negotiable if I buy 20 baskets?",
    time: "5 hrs ago",
  },
];

export default function FarmerDashboard() {
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);

  const getStatus = (dateString) => {
    const today = new Date();
    const harvestDate = new Date(dateString);
    const diffTime = harvestDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        label: `Pre-Order (Ready in ${diffDays} days)`,
        color: "bg-orange-100 text-orange-700 border-orange-200",
      };
    }
    return {
      label: "Available Now",
      color: "bg-green-100 text-green-700 border-green-200",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Farm Dashboard
            </h1>
            <p className="text-gray-500">
              Welcome back! Here is what's happening on your farm.
            </p>
          </div>
          <Link to="/add-product">
            <Button btnClassName="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-green-200">
              <Plus className="h-5 w-5" />
              Post New Harvest
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link to="/disease-detection">
            <Card className="group relative overflow-hidden border-2 border-blue-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-50 transition-transform group-hover:scale-150"></div>
              <div className="relative flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                  <Leaf className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    AI Disease Detector
                  </h3>
                  <p className="text-sm text-gray-500">
                    Scan crops for health issues
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/market-prices">
            <Card className="group relative overflow-hidden border-2 border-purple-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-50 transition-transform group-hover:scale-150"></div>
              <div className="relative flex items-center gap-4">
                <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Market Prices</h3>
                  <p className="text-sm text-gray-500">Compare current rates</p>
                </div>
              </div>
            </Card>
          </Link>

          <div className="cursor-pointer">
            <Card className="group relative overflow-hidden border-2 border-orange-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-50 transition-transform group-hover:scale-150"></div>
              <div className="relative flex items-center gap-4">
                <div className="rounded-lg bg-orange-100 p-3 text-orange-600">
                  <MapPin className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Logistics Map</h3>
                  <p className="text-sm text-gray-500">View buyer distances</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Active Listings
              </h2>
              <span className="text-sm font-medium text-green-600 hover:underline cursor-pointer">
                View All
              </span>
            </div>

            <div className="grid gap-4">
              {listings.map((item) => {
                const status = getStatus(item.harvestDate);
                return (
                  <Card
                    key={item.id}
                    className="flex flex-col gap-4 p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center bg-white border border-gray-100"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-full rounded-lg object-cover sm:h-20 sm:w-20"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold border ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Price:{" "}
                        <span className="font-medium text-gray-900">
                          ₦{item.price}/{item.unit}
                        </span>
                        <span className="mx-2">•</span>
                        Stock:{" "}
                        <span className="font-medium text-gray-900">
                          {item.quantity} {item.unit}s
                        </span>
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        Harvest Date: {item.harvestDate}
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <Button
                        variant="outline"
                        btnClassName="text-xs px-3 py-1 h-8"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        btnClassName="text-xs text-red-500 px-3 py-1 h-8 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Inquiries
            </h2>
            <Card className="bg-white p-0 border border-gray-100 divide-y divide-gray-100">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-gray-900">
                      {inq.buyer}
                    </h4>
                    <span className="text-xs text-gray-400">{inq.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {inq.message}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      btnClassName="text-xs text-green-600 px-0 h-auto hover:underline hover:bg-transparent"
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
              <div className="p-4 text-center">
                <button className="text-sm font-medium text-gray-500 hover:text-green-600">
                  View All Messages
                </button>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 shrink-0 text-blue-200" />
                <div>
                  <h4 className="font-bold">Weather Alert</h4>
                  <p className="mt-1 text-sm text-blue-100">
                    Heavy rain expected in your region tomorrow. Ensure drainage
                    systems are clear.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
