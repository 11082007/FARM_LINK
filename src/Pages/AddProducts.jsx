import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
} from "lucide-react";
import Input from "../Components/Input/index.jsx";
import Button from "../Components/Button/index.jsx";
import Card from "../Components/Card/index.jsx";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Vegetables",
    price: "",
    quantity: "",
    unit: "kg",
    harvestDate: "",
    description: "",
    blockchainVerified: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log("Product Submitted:", formData);
      setLoading(false);
      navigate("/farmer-dashboard");
    }, 1500);
  };

  const isPreOrder = () => {
    if (!formData.harvestDate) return false;
    const today = new Date();
    const harvest = new Date(formData.harvestDate);
    return harvest > today;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/farmer-dashboard"
          className="mb-6 inline-flex items-center gap-2 text-gray-500 hover:text-green-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post New Harvest</h1>
          <p className="text-gray-500">List your produce for buyers to see.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="h-full bg-white p-4">
              <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <Upload className="mb-3 h-10 w-10 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="space-y-6 bg-white p-6">
              <Input
                label="Crop Name"
                name="name"
                placeholder="e.g. Yellow Maize"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Grains</option>
                    <option>Tubers</option>
                    <option>Livestock</option>
                  </select>
                </div>

                <Input
                  label="Harvest Date"
                  name="harvestDate"
                  type="date"
                  icon={Calendar}
                  value={formData.harvestDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {formData.harvestDate && (
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    isPreOrder()
                      ? "border-orange-200 bg-orange-50 text-orange-700"
                      : "border-green-200 bg-green-50 text-green-700"
                  }`}
                >
                  {isPreOrder()
                    ? "⚠️ This will be listed as a Pre-Order because the date is in the future."
                    : "✅ This will be listed as Available Now."}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Price (₦)"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  icon={DollarSign}
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      label="Quantity"
                      name="quantity"
                      type="number"
                      placeholder="0"
                      icon={Package}
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-24">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 bg-white p-3"
                    >
                      <option>kg</option>
                      <option>ton</option>
                      <option>basket</option>
                      <option>bag</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full rounded-xl border border-gray-300 p-3 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Describe quality, variety, etc..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-bold text-blue-900">
                      Blockchain Verification
                    </p>
                    <p className="text-xs text-blue-700">
                      Generate a unique hash for this harvest.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="blockchainVerified"
                    checked={formData.blockchainVerified}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                btnClassName="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl shadow-lg"
              >
                {loading ? "Publishing..." : "Post Listing"}
              </Button>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
