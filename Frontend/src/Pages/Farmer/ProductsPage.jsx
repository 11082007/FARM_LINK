import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  ShoppingCart,
  ArrowRight,
  Calendar,
  Hash,
  Layers
} from 'lucide-react';
import Navbar from './FarmerNavbar';

// Mock data - replace with your actual product data
const mockProducts = [
  {
    id: '1',
    name: 'Basmati Rice',
    description: 'Premium quality rice, 50kg bags',
    price: 2500,
    category: 'Grains',
    quantity: 50,
    location: 'Lagos, Nigeria',
    available: true,
    imageUrl: 'https://cdn.pixabay.com/photo/2018/05/01/13/04/rice-3364752_1280.jpg',
    rating: 4.8,
    sales: 42,
    status: 'active',
    createdAt: '2024-01-15',
    farm_id: 'farm_001'
  },
  {
    id: '2',
    name: 'Fresh Plantain',
    description: 'Ripe plantains for cooking',
    price: 1200,
    category: 'Fruits',
    quantity: 75,
    location: 'Ibadan, Nigeria',
    available: true,
    imageUrl: 'https://cdn.pixabay.com/photo/2017/06/02/18/24/plantain-2366477_1280.jpg',
    rating: 4.5,
    sales: 28,
    status: 'active',
    createdAt: '2024-02-10',
    farm_id: 'farm_001'
  },
  {
    id: '3',
    name: 'Organic Tomatoes',
    description: 'Fresh red tomatoes from organic farm',
    price: 800,
    category: 'Vegetables',
    quantity: 120,
    location: 'Abuja, Nigeria',
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    rating: 4.7,
    sales: 35,
    status: 'active',
    createdAt: '2024-02-20',
    farm_id: 'farm_001'
  },
  {
    id: '4',
    name: 'Sweet Potatoes',
    description: 'Fresh sweet potatoes, perfect for roasting',
    price: 600,
    category: 'Roots',
    quantity: 0,
    location: 'Kano, Nigeria',
    available: false,
    imageUrl: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357',
    rating: 4.9,
    sales: 19,
    status: 'out_of_stock',
    createdAt: '2024-01-30',
    farm_id: 'farm_001'
  },
];

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    location: '',
    imageUrl: ''
  });

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.available).length;
  const outOfStockProducts = products.filter(p => !p.available).length;
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.available) ||
                         (filterStatus === 'inactive' && !product.available);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      ...newProduct,
      id: Date.now().toString(),
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity),
      available: parseInt(newProduct.quantity) > 0,
      rating: 0,
      sales: 0,
      status: parseInt(newProduct.quantity) > 0 ? 'active' : 'out_of_stock',
      createdAt: new Date().toISOString().split('T')[0],
      farm_id: 'farm_001'
    };

    setProducts(prev => [productToAdd, ...prev]);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      quantity: '',
      location: '',
      imageUrl: ''
    });
    setShowAddModal(false);
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      location: product.location,
      imageUrl: product.imageUrl
    });
    setShowAddModal(true);
  };

  // Update product
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setProducts(prev => prev.map(p => 
      p.id === editingProduct.id 
        ? { 
            ...p, 
            ...newProduct, 
            price: parseFloat(newProduct.price),
            quantity: parseInt(newProduct.quantity),
            available: parseInt(newProduct.quantity) > 0,
            status: parseInt(newProduct.quantity) > 0 ? 'active' : 'out_of_stock'
          }
        : p
    ));
    setShowAddModal(false);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      quantity: '',
      location: '',
      imageUrl: ''
    });
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  // Toggle product availability
  const toggleAvailability = (productId) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, available: !p.available, status: !p.available ? 'active' : 'out_of_stock' }
        : p
    ));
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'out_of_stock': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Package size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Product Management</h1>
                    <p className="text-green-100">Manage your farm products and inventory</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Total Products</div>
                    <div className="text-xl font-bold">{totalProducts}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Total Revenue</div>
                    <div className="text-xl font-bold">₦{totalRevenue.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-green-200 mb-1">Total Sales</div>
                <div className="text-5xl font-bold">{totalSales}</div>
                <div className="text-sm text-green-200 mt-2">Items sold</div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search products by name, description, or category..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Filter size={20} className="text-gray-500 dark:text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  {categories.filter(c => c !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Out of Stock</option>
                </select>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setNewProduct({
                      name: '',
                      description: '',
                      price: '',
                      category: '',
                      quantity: '',
                      location: '',
                      imageUrl: ''
                    });
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                >
                  <Plus size={20} />
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Active Products</h3>
                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {activeProducts}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available for sale</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Out of Stock</h3>
                <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                {outOfStockProducts}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Need restocking</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Revenue</h3>
                <DollarSign className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                ₦{totalRevenue.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">From all sales</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Total Sales</h3>
                <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {totalSales}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Items sold</p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                My Products ({filteredProducts.length})
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
                <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package size={48} className="text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Products Found
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {products.length === 0 
                    ? "You haven't added any products yet. Start by adding your first product."
                    : "Try adjusting your search or filter criteria"}
                </p>
                {products.length === 0 && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                  >
                    <Plus size={20} />
                    Add Your First Product
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-slate-700">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/400x300/10b981/white?text=${encodeURIComponent(product.name)}`;
                        }}
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.available ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Sales Badge */}
                      {product.sales > 0 && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                          <TrendingUp size={12} />
                          {product.sales} sold
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {product.category}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <div className="mb-4">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="space-y-3 mb-4">
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              ₦{product.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">per unit</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.quantity} units
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">in stock</div>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < Math.floor(product.rating) 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-gray-300 dark:text-gray-600"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Hash size={14} />
                          <span>{product.location}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => toggleAvailability(product.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            product.available
                              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {product.available ? 'Out of Stock' : 'Restock'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Products Table (Alternative View) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Products List</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Detailed view of all your products
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Layers size={16} />
                  <span>Table View</span>
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b dark:border-slate-700">
                      <th className="pb-3 px-6">Product</th>
                      <th className="pb-3 px-6">Category</th>
                      <th className="pb-3 px-6">Price</th>
                      <th className="pb-3 px-6">Stock</th>
                      <th className="pb-3 px-6">Status</th>
                      <th className="pb-3 px-6">Sales</th>
                      <th className="pb-3 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = `https://placehold.co/100/10b981/white?text=${encodeURIComponent(product.name.slice(0, 2))}`;
                                }}
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{product.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-green-600 dark:text-green-400">
                            ₦{product.price.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium">{product.quantity}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                            {product.available ? 'Active' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <TrendingUp size={14} className="text-blue-500" />
                            <span>{product.sales}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => toggleAvailability(product.id)}
                              className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              title={product.available ? 'Mark as Out of Stock' : 'Restock'}
                            >
                              {product.available ? <XCircle size={16} /> : <CheckCircle size={16} />}
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No products to display
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                  setNewProduct({
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                    quantity: '',
                    location: '',
                    imageUrl: ''
                  });
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <XCircle size={24} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (₦) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      required
                      min="0"
                      value={newProduct.quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      required
                      value={newProduct.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="">Select category</option>
                      <option value="Grains">Grains</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Roots">Roots</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Meat">Meat</option>
                      <option value="Poultry">Poultry</option>
                      <option value="Fish">Fish</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={newProduct.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                      placeholder="e.g., Lagos, Nigeria"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    setNewProduct({
                      name: '',
                      description: '',
                      price: '',
                      category: '',
                      quantity: '',
                      location: '',
                      imageUrl: ''
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;