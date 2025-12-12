import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  Download,
  Filter,
  MoreVertical,
  Target,
  Trophy,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Navbar from './FarmerNavbar';

// Mock data for charts and analytics
const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(false);

  // Mock sales data
  const salesData = {
    daily: [
      { day: 'Mon', sales: 45000, orders: 12 },
      { day: 'Tue', sales: 52000, orders: 15 },
      { day: 'Wed', sales: 48000, orders: 13 },
      { day: 'Thu', sales: 61000, orders: 18 },
      { day: 'Fri', sales: 72000, orders: 22 },
      { day: 'Sat', sales: 85000, orders: 25 },
      { day: 'Sun', sales: 68000, orders: 20 },
    ],
    monthly: [
      { month: 'Jan', sales: 250000, orders: 75 },
      { month: 'Feb', sales: 280000, orders: 82 },
      { month: 'Mar', sales: 320000, orders: 95 },
      { month: 'Apr', sales: 290000, orders: 88 },
      { month: 'May', sales: 350000, orders: 105 },
      { month: 'Jun', sales: 410000, orders: 125 },
    ]
  };

  // Mock product performance
  const productPerformance = [
    { name: 'Basmati Rice', revenue: 1250000, sales: 500, growth: 15, rating: 4.8 },
    { name: 'Plantain', revenue: 840000, sales: 700, growth: 8, rating: 4.5 },
    { name: 'Tomatoes', revenue: 672000, sales: 840, growth: 22, rating: 4.7 },
    { name: 'Carrots', revenue: 456000, sales: 760, growth: 12, rating: 4.9 },
    { name: 'Potatoes', revenue: 315000, sales: 450, growth: 5, rating: 4.6 },
  ];

  // Mock customer insights
  const customerInsights = {
    totalCustomers: 850,
    newCustomers: 45,
    returningCustomers: 72,
    avgOrderValue: 3800,
    customerSatisfaction: 4.7
  };

  // Mock revenue metrics
  const revenueMetrics = {
    totalRevenue: 3528000,
    revenueGrowth: 18.5,
    averageDailyRevenue: 98000,
    bestDay: 'Saturday',
    bestDayRevenue: 185000
  };

  // Mock order metrics
  const orderMetrics = {
    totalOrders: 1258,
    pendingOrders: 12,
    completedOrders: 1210,
    canceledOrders: 36,
    conversionRate: 85.3
  };

  // Calculate insights
  const calculateInsights = () => {
    const currentData = timeRange === 'month' ? salesData.monthly : salesData.daily;
    const totalSales = currentData.reduce((sum, item) => sum + item.sales, 0);
    const totalOrders = currentData.reduce((sum, item) => sum + item.orders, 0);
    const avgOrderValue = totalSales / totalOrders;

    return { totalSales, totalOrders, avgOrderValue };
  };

  const { totalSales, totalOrders, avgOrderValue } = calculateInsights();

  // Get growth indicator
  const getGrowthIndicator = (growth) => {
    if (growth > 0) {
      return {
        icon: <ArrowUpRight size={16} />,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30'
      };
    } else {
      return {
        icon: <ArrowDownRight size={16} />,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30'
      };
    }
  };

  // Get sales trend
  const getSalesTrend = () => {
    const data = timeRange === 'month' ? salesData.monthly : salesData.daily;
    if (data.length < 2) return 0;
    
    const firstValue = data[0].sales;
    const lastValue = data[data.length - 1].sales;
    return ((lastValue - firstValue) / firstValue * 100).toFixed(1);
  };

  const salesTrend = getSalesTrend();
  const trendIndicator = getGrowthIndicator(salesTrend);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <BarChart3 size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <p className="text-purple-100">Real-time insights and performance metrics</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Current Period</div>
                    <div className="text-xl font-bold capitalize">{timeRange}ly</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm">Sales Trend</div>
                    <div className={`text-xl font-bold flex items-center gap-1 ${trendIndicator.color}`}>
                      {trendIndicator.icon}
                      {Math.abs(salesTrend)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="day">Daily</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${trendIndicator.bgColor} ${trendIndicator.color}`}>
                  {trendIndicator.icon}
                  <span className="ml-1">{salesTrend}%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₦{totalSales.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Revenue</div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                  <ArrowUpRight size={12} className="inline" />
                  <span className="ml-1">12.5%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalOrders}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Orders</div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                  <ArrowUpRight size={12} className="inline" />
                  <span className="ml-1">8.3%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {customerInsights.totalCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Customers</div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
                  <Target size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                  <ArrowUpRight size={12} className="inline" />
                  <span className="ml-1">5.2%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₦{avgOrderValue.toFixed(0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg. Order Value</div>
            </div>
          </div>

          {/* Charts and Graphs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sales Overview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {timeRange === 'month' ? 'Monthly' : 'Daily'} revenue performance
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                    <MoreVertical size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="h-64 flex items-end justify-between gap-2 mt-8">
                {(timeRange === 'month' ? salesData.monthly : salesData.daily).map((item, index) => {
                  const maxValue = Math.max(...(timeRange === 'month' ? salesData.monthly : salesData.daily).map(d => d.sales));
                  const height = (item.sales / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="relative w-full">
                        <div 
                          className="w-10 mx-auto bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg transition-all duration-300 hover:opacity-90"
                          style={{ height: `${height}%` }}
                        />
                        <div className="mt-2 text-center">
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            {timeRange === 'month' ? item.month : item.day}
                          </div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            ₦{(item.sales / 1000).toFixed(0)}K
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Orders</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Performance */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Products</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Best performing products by revenue
                  </p>
                </div>
                <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {productPerformance.map((product, index) => {
                  const growthIndicator = getGrowthIndicator(product.growth);
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center">
                          <Package size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Star size={12} className="fill-yellow-400 text-yellow-400" />
                              {product.rating}
                            </div>
                            <span>•</span>
                            <span>{product.sales} sales</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          ₦{product.revenue.toLocaleString()}
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${growthIndicator.color}`}>
                          {growthIndicator.icon}
                          {product.growth}% growth
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Order Metrics */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Order performance metrics</p>
                </div>
                <Activity size={20} className="text-blue-500" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Completed</span>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {orderMetrics.completedOrders}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-yellow-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {orderMetrics.pendingOrders}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Canceled</span>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {orderMetrics.canceledOrders}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-purple-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Conversion Rate</span>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {orderMetrics.conversionRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Insights */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Customer Insights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Customer behavior & satisfaction</p>
                </div>
                <Users size={20} className="text-purple-500" />
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">New Customers</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      +{customerInsights.newCustomers}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(customerInsights.newCustomers / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Returning Customers</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {customerInsights.returningCustomers}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(customerInsights.returningCustomers / customerInsights.totalCustomers) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</span>
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                      {customerInsights.customerSatisfaction}/5
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(customerInsights.customerSatisfaction / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      ₦{customerInsights.avgOrderValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Average Order Value</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Breakdown</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Revenue sources and trends</p>
                </div>
                <PieChart size={20} className="text-green-500" />
              </div>

              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {revenueMetrics.revenueGrowth}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Growth</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₦{(revenueMetrics.totalRevenue / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Revenue</div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₦{revenueMetrics.averageDailyRevenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Daily Average</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                  <div className="text-center">
                    <Trophy size={24} className="text-yellow-500 mx-auto mb-2" />
                    <div className="font-bold text-gray-900 dark:text-white">Best Day: {revenueMetrics.bestDay}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ₦{revenueMetrics.bestDayRevenue.toLocaleString()} revenue
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights and Recommendations */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Performance Insights</h3>
                <p className="text-green-100">
                  Your farm is performing exceptionally well! Revenue is up by {revenueMetrics.revenueGrowth}% compared to last period.
                  Consider focusing on your top 3 products which generate 65% of your revenue.
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-200 mb-1">Recommendation</div>
                <div className="text-xl font-bold">Increase Stock of Top Products</div>
                <div className="text-sm text-green-200 mt-2">Basmati Rice, Plantain, Tomatoes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;