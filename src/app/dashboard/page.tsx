"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Box, 
  ShoppingCart, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  Menu,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Package,
  CreditCard,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Mock e-commerce sales data
const salesData = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 139 },
  { name: 'Mar', sales: 5000, orders: 380 },
  { name: 'Apr', sales: 4780, orders: 390 },
  { name: 'May', sales: 6890, orders: 480 },
  { name: 'Jun', sales: 8200, orders: 590 },
  { name: 'Jul', sales: 9500, orders: 720 },
];

const categoryData = [
  { name: 'Electronics', value: 400, fill: '#3b82f6' },
  { name: 'Fashion', value: 300, fill: '#8b5cf6' },
  { name: 'Home', value: 300, fill: '#10b981' },
  { name: 'Beauty', value: 200, fill: '#f59e0b' },
];

const recentOrders = [
  { id: '#ORD-8821', customer: 'Sarah Johnson', product: 'Wireless Headphones', amount: '$129.00', status: 'Delivered' },
  { id: '#ORD-8820', customer: 'Mike Chen', product: 'Smart Watch', amount: '$299.00', status: 'Shipped' },
  { id: '#ORD-8819', customer: 'Emily Davis', product: 'Laptop Stand', amount: '$49.00', status: 'Processing' },
  { id: '#ORD-8818', customer: 'James Wilson', product: 'Mechanical Keyboard', amount: '$179.00', status: 'Delivered' },
];

const DashboardPage = () => {
  const searchParams = useSearchParams();
  const [ticker, setTicker] = useState<string>(searchParams.get('ticker') || 'STORE-001');

  useEffect(() => {
    if (searchParams.get('ticker')) {
      setTicker(searchParams.get('ticker') as string);
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950/50 backdrop-blur-sm flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">LabFin<span className="text-blue-500">Commerce</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-600/20">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
            <Box size={20} />
            <span>Products</span>
          </Link>
          <Link href="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
            <ShoppingCart size={20} />
            <span>Orders</span>
          </Link>
          <Link href="/customers" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
            <Users size={20} />
            <span>Customers</span>
          </Link>
          <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all mt-8">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-900 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 hover:bg-slate-800 rounded-lg">
              <Menu size={20} />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search products or orders..."
                className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-900 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Store Dashboard</h1>
              <p className="text-slate-400 mt-1">Welcome back! Here's what's happening with your store today.</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-emerald-400 font-medium">Store Status: Online</span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <CreditCard className="text-blue-400 w-6 h-6" />
                </div>
                <div className="flex items-center text-emerald-400 text-sm font-medium">
                  <TrendingUp size={14} className="mr-1" />
                  +12.5%
                </div>
              </div>
              <h3 className="text-slate-400 text-sm">Total Revenue</h3>
              <p className="text-2xl font-bold text-white mt-1">$45,231.89</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <ShoppingCart className="text-purple-400 w-6 h-6" />
                </div>
                <div className="flex items-center text-emerald-400 text-sm font-medium">
                  <TrendingUp size={14} className="mr-1" />
                  +8.2%
                </div>
              </div>
              <h3 className="text-slate-400 text-sm">Total Orders</h3>
              <p className="text-2xl font-bold text-white mt-1">3,241</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Package className="text-emerald-400 w-6 h-6" />
                </div>
                <div className="flex items-center text-red-400 text-sm font-medium">
                  <TrendingDown size={14} className="mr-1" />
                  -2.1%
                </div>
              </div>
              <h3 className="text-slate-400 text-sm">Products Sold</h3>
              <p className="text-2xl font-bold text-white mt-1">5,672</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Users className="text-amber-400 w-6 h-6" />
                </div>
                <div className="flex items-center text-emerald-400 text-sm font-medium">
                  <TrendingUp size={14} className="mr-1" />
                  +18.4%
                </div>
              </div>
              <h3 className="text-slate-400 text-sm">New Customers</h3>
              <p className="text-2xl font-bold text-white mt-1">892</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Sales Performance</h2>
                <select className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 12 Months</option>
                </select>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <h2 className="text-lg font-semibold text-white mb-6">Product Categories</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                {categoryData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.fill }} />
                      <span className="text-sm text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-400">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
              <Link href="/orders" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                View All <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-sm border-b border-slate-800">
                    <th className="pb-4 font-medium">Order ID</th>
                    <th className="pb-4 font-medium">Customer</th>
                    <th className="pb-4 font-medium">Product</th>
                    <th className="pb-4 font-medium">Amount</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 font-medium text-white">{order.id}</td>
                      <td className="py-4 text-slate-300">{order.customer}</td>
                      <td className="py-4 text-slate-300">{order.product}</td>
                      <td className="py-4 text-white font-medium">{order.amount}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                          order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
