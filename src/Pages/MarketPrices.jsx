import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";
import Card from "../Components/Card/index.jsx";

// Mock Data for Prices
const MARKET_DATA = [
  {
    id: 1,
    item: "White Maize",
    unit: "100kg Bag",
    current: 55000,
    previous: 52000,
    region: "Lagos",
  },
  {
    id: 2,
    item: "Red Onions",
    unit: "50kg Bag",
    current: 45000,
    previous: 48000,
    region: "Kano",
  },
  {
    id: 3,
    item: "Tomatoes",
    unit: "Large Basket",
    current: 32000,
    previous: 25000,
    region: "Jos",
  },
  {
    id: 4,
    item: "Irish Potato",
    unit: "50kg Bag",
    current: 28000,
    previous: 28000,
    region: "Plateau",
  },
  {
    id: 5,
    item: "Soybeans",
    unit: "100kg Bag",
    current: 48000,
    previous: 46500,
    region: "Benue",
  },
];

export default function MarketPrices() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-gray-500 hover:text-green-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back Home
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-green-600" /> Market Prices
            </h1>
            <p className="text-gray-500 mt-2">
              Live average wholesale prices across major Nigerian markets.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search commodity..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <Card className="overflow-hidden bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-4">Commodity</th>
                  <th className="px-6 py-4">Unit</th>
                  <th className="px-6 py-4">Current Price</th>
                  <th className="px-6 py-4">Trend (24h)</th>
                  <th className="px-6 py-4">Region</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {MARKET_DATA.map((item) => {
                  const diff = item.current - item.previous;
                  const percent = ((diff / item.previous) * 100).toFixed(1);
                  const isUp = diff > 0;
                  const isStable = diff === 0;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.item}
                      </td>
                      <td className="px-6 py-4">{item.unit}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ₦{item.current.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {isStable ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            - 0.0%
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              isUp
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {isUp ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {percent}%
                          </span>
                        )}
                        {/* Note: High prices usually bad for buyers (Red), Low prices good (Green). Or Standard Green=Up. I used Standard. */}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {item.region}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
