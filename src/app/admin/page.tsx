"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { StatSkeleton, TableRowSkeleton } from "@/components/ui/Skeleton";
import {
  orderService, userService, analyticsService
} from "@/lib/db";
import type { Order, UserProfile, OrderStatus } from "@/types";
import {
  BarChart3, Users, Package, DollarSign, TrendingUp, Clock,
  CheckCircle, XCircle, Truck, Eye, Search, Filter,
  ShoppingBag, CreditCard, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, ClipboardList, UserCog, PieChart,
  ChevronRight, RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart as RePieChart,
  Pie, Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const COLORS = ["#ff0055", "#00f0ff", "#7000ff", "#ffaa00", "#39ff14"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [orderFilter, setOrderFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, usersData, statsData] = await Promise.all([
        orderService.getAllOrders(),
        userService.getAllUsers(),
        analyticsService.getDashboardStats(),
      ]);
      setOrders(ordersData);
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order updated to ${newStatus}`);
      loadData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return "N/A";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatCurrency = (n: number) => `₹${(n || 0).toLocaleString()}`;

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Delivered": return "bg-brand-success/10 text-brand-success";
      case "Processing": return "bg-brand-cyan/10 text-brand-cyan";
      case "Confirmed": return "bg-brand-purple/10 text-brand-purple";
      case "Shipped": return "bg-brand-gold/10 text-brand-gold";
      case "Cancelled": return "bg-brand-accent/10 text-brand-accent";
      default: return "bg-white/10 text-gray-400";
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "Delivered": return <CheckCircle className="w-3.5 h-3.5" />;
      case "Processing": return <Clock className="w-3.5 h-3.5" />;
      case "Shipped": return <Truck className="w-3.5 h-3.5" />;
      case "Cancelled": return <XCircle className="w-3.5 h-3.5" />;
      default: return <Package className="w-3.5 h-3.5" />;
    }
  };

  // Filtered data
  const filteredOrders = orders
    .filter((o) => orderFilter === "all" || o.orderStatus === orderFilter || (orderFilter === "cod" && o.paymentMethod === "cod"))
    .filter((o) => {
      if (!orderSearch) return true;
      const search = orderSearch.toLowerCase();
      return (
        o.id?.toLowerCase().includes(search) ||
        o.userName?.toLowerCase().includes(search) ||
        o.userEmail?.toLowerCase().includes(search)
      );
    });

  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true;
    const search = userSearch.toLowerCase();
    return u.name?.toLowerCase().includes(search) || u.email?.toLowerCase().includes(search);
  });

  const selectedUserOrders = selectedUserId
    ? orders.filter((o) => o.userId === selectedUserId)
    : [];

  const sidebarTabs = [
    { id: "overview", name: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "orders", name: "Orders", icon: <ClipboardList className="w-5 h-5" />, count: orders.length },
    { id: "customers", name: "Customers", icon: <UserCog className="w-5 h-5" />, count: users.length },
    { id: "analytics", name: "Analytics", icon: <PieChart className="w-5 h-5" /> },
  ];

  // Pie data for payment methods
  const paymentPieData = [
    { name: "Stripe", value: stats?.stripeOrders || 0 },
    { name: "COD", value: stats?.codOrders || 0 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-surface border border-white/10 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-[10px] text-gray-500 font-indian tracking-widest uppercase">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
              {p.name === "revenue" ? formatCurrency(p.value) : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-brand-dark pt-28 pb-12">
        <Header />
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl md:text-6xl italic tracking-tighter uppercase">
                ADMIN <span className="text-brand-accent">CONSOLE</span>
              </h1>
              <p className="font-indian text-gray-500 tracking-[0.2em] uppercase text-sm mt-1">
                Live administration panel
              </p>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-6 py-2.5 border border-white/10 hover:border-brand-accent text-sm font-bold tracking-widest uppercase transition-all rounded-xl"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
            {/* ─── Sidebar ─── */}
            <nav className="bg-brand-surface rounded-3xl border border-white/5 p-3 h-fit lg:sticky lg:top-28">
              {sidebarTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group mb-1",
                    activeTab === tab.id
                      ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20"
                      : "text-gray-500 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3 uppercase font-bold text-[11px] tracking-[0.15em]">
                    {tab.icon}
                    {tab.name}
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      activeTab === tab.id ? "bg-white/20" : "bg-white/5"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* ─── Main Content ─── */}
            <div className="space-y-6">
              {/* ═══════ OVERVIEW ═══════ */}
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {loading ? (
                      Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />)
                    ) : (
                      [
                        { label: "Total Revenue", value: formatCurrency(stats?.totalRevenue || 0), trend: "+12.5%", icon: DollarSign, color: "text-brand-success", up: true },
                        { label: "Total Orders", value: stats?.totalOrders || 0, trend: `${stats?.codOrders || 0} COD`, icon: Package, color: "text-brand-cyan", up: true },
                        { label: "Total Customers", value: stats?.totalUsers || 0, trend: "Active", icon: Users, color: "text-brand-purple", up: true },
                        { label: "Avg Order Value", value: formatCurrency(stats?.totalOrders ? Math.round((stats?.totalRevenue || 0) / stats.totalOrders) : 0), trend: "Per order", icon: BarChart3, color: "text-brand-accent", up: true },
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-brand-surface border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all"
                        >
                          <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="w-20 h-20" />
                          </div>
                          <div className="relative z-10">
                            <p className="font-indian text-gray-400 tracking-[0.15em] uppercase text-[10px] mb-3">{stat.label}</p>
                            <p className="text-3xl font-display tracking-wider mb-1">{stat.value}</p>
                            <p className={`text-xs tracking-wider font-bold ${stat.color} flex items-center gap-1`}>
                              {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              {stat.trend}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Revenue Chart */}
                    <div className="bg-brand-surface border border-white/5 rounded-2xl p-6">
                      <h3 className="font-display text-xl italic tracking-wider uppercase mb-6">Daily Revenue</h3>
                      <div className="h-64">
                        {stats?.revenueByDay?.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.revenueByDay}>
                              <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ff0055" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#ff0055" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="date" stroke="#555" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                              <YAxis stroke="#555" fontSize={10} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                              <Tooltip content={<CustomTooltip />} />
                              <Area type="monotone" dataKey="revenue" stroke="#ff0055" fill="url(#revGrad)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-600 text-sm font-indian tracking-widest">
                            No revenue data yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Orders Chart */}
                    <div className="bg-brand-surface border border-white/5 rounded-2xl p-6">
                      <h3 className="font-display text-xl italic tracking-wider uppercase mb-6">Orders Per Day</h3>
                      <div className="h-64">
                        {stats?.ordersByDay?.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.ordersByDay}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="date" stroke="#555" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                              <YAxis stroke="#555" fontSize={10} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="orders" fill="#00f0ff" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-600 text-sm font-indian tracking-widest">
                            No order data yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Top Products + Payment Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Selling */}
                    <div className="lg:col-span-2 bg-brand-surface border border-white/5 rounded-2xl p-6">
                      <h3 className="font-display text-xl italic tracking-wider uppercase mb-6">Top Selling Jerseys</h3>
                      {stats?.topProducts?.length > 0 ? (
                        <div className="space-y-3">
                          {stats.topProducts.map((p: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl hover:bg-black/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center font-display text-sm text-brand-accent">
                                  #{i + 1}
                                </span>
                                <div>
                                  <p className="font-bold text-sm">{p.name}</p>
                                  <p className="text-[10px] text-gray-500 font-indian tracking-widest">{p.sold} units sold</p>
                                </div>
                              </div>
                              <p className="font-display text-lg text-brand-gold">{formatCurrency(p.revenue)}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center text-gray-600 text-sm font-indian tracking-widest">
                          No sales data yet
                        </div>
                      )}
                    </div>

                    {/* Payment Method Split */}
                    <div className="bg-brand-surface border border-white/5 rounded-2xl p-6">
                      <h3 className="font-display text-xl italic tracking-wider uppercase mb-6">Payment Split</h3>
                      <div className="h-48">
                        {(stats?.stripeOrders > 0 || stats?.codOrders > 0) ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                              <Pie
                                data={paymentPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {paymentPieData.map((_, i) => (
                                  <Cell key={i} fill={COLORS[i]} />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </RePieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-600 text-sm font-indian tracking-widest">
                            No data
                          </div>
                        )}
                      </div>
                      <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-brand-accent" />
                          <span className="text-xs text-gray-400">Stripe ({stats?.stripeOrders || 0})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-brand-cyan" />
                          <span className="text-xs text-gray-400">COD ({stats?.codOrders || 0})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders Preview */}
                  <div className="bg-brand-surface border border-white/5 rounded-2xl overflow-hidden mt-6">
                    <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/30">
                      <h3 className="font-display text-xl italic tracking-wider">RECENT ORDERS</h3>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-brand-cyan text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors flex items-center gap-1"
                      >
                        View All <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 bg-black/20 font-indian uppercase tracking-widest text-[10px] text-gray-500">
                            <th className="p-4 font-normal">Order ID</th>
                            <th className="p-4 font-normal">Customer</th>
                            <th className="p-4 font-normal">Date</th>
                            <th className="p-4 font-normal">Amount</th>
                            <th className="p-4 font-normal">Payment</th>
                            <th className="p-4 font-normal">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
                          ) : (
                            orders.slice(0, 5).map((order, i) => (
                              <motion.tr
                                key={order.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm"
                              >
                                <td className="p-4 font-indian tracking-wider text-gray-300">#{order.id.slice(-8).toUpperCase()}</td>
                                <td className="p-4">{order.userName || order.userEmail?.split("@")[0]}</td>
                                <td className="p-4 text-gray-400 font-indian">{formatDate(order.createdAt)}</td>
                                <td className="p-4 font-bold text-brand-gold">{formatCurrency(order.total)}</td>
                                <td className="p-4">
                                  <span className="text-[10px] uppercase font-bold tracking-widest">
                                    {order.paymentMethod === "cod" ? "COD" : "Stripe"}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 ${getStatusColor(order.orderStatus)}`}>
                                    {getStatusIcon(order.orderStatus)}
                                    {order.orderStatus}
                                  </span>
                                </td>
                              </motion.tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══════ ORDERS MANAGEMENT ═══════ */}
              {activeTab === "orders" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search orders by ID, name, email..."
                        className="w-full bg-brand-surface border border-white/10 p-3.5 pl-11 rounded-xl outline-none focus:border-brand-accent text-sm font-indian tracking-widest"
                      />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      {["all", "Processing", "Confirmed", "Shipped", "Delivered", "Cancelled", "cod"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setOrderFilter(f)}
                          className={cn(
                            "flex-shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                            orderFilter === f
                              ? "bg-brand-accent text-white"
                              : "bg-brand-surface border border-white/10 text-gray-500 hover:border-brand-accent/50"
                          )}
                        >
                          {f === "cod" ? "COD Only" : f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-brand-surface border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 bg-black/20 font-indian uppercase tracking-widest text-[10px] text-gray-500">
                            <th className="p-4 font-normal">Order ID</th>
                            <th className="p-4 font-normal">Customer</th>
                            <th className="p-4 font-normal">Items</th>
                            <th className="p-4 font-normal">Date</th>
                            <th className="p-4 font-normal">Amount</th>
                            <th className="p-4 font-normal">Payment</th>
                            <th className="p-4 font-normal">Status</th>
                            <th className="p-4 font-normal">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-12 text-center text-gray-600 font-indian tracking-widest">
                                No orders found
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((order) => (
                              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                                <td className="p-4 font-indian tracking-wider text-gray-300">#{order.id.slice(-8).toUpperCase()}</td>
                                <td className="p-4">
                                  <div>
                                    <p className="font-bold text-xs">{order.userName}</p>
                                    <p className="text-[10px] text-gray-500">{order.userEmail}</p>
                                  </div>
                                </td>
                                <td className="p-4 text-gray-400 text-xs">{order.items?.length || 0} items</td>
                                <td className="p-4 text-gray-400 font-indian text-xs">{formatDate(order.createdAt)}</td>
                                <td className="p-4 font-bold text-brand-gold">{formatCurrency(order.total)}</td>
                                <td className="p-4">
                                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full ${
                                    order.paymentMethod === "cod" ? "bg-brand-gold/10 text-brand-gold" : "bg-brand-cyan/10 text-brand-cyan"
                                  }`}>
                                    {order.paymentMethod === "cod" ? "COD" : "Stripe"} • {order.paymentStatus}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
                                    {getStatusIcon(order.orderStatus)}
                                    {order.orderStatus}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <select
                                    value={order.orderStatus}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                    className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-indian tracking-widest uppercase outline-none focus:border-brand-accent"
                                  >
                                    {["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((s) => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══════ CUSTOMERS MANAGEMENT ═══════ */}
              {activeTab === "customers" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search customers..."
                      className="w-full bg-brand-surface border border-white/10 p-3.5 pl-11 rounded-xl outline-none focus:border-brand-accent text-sm font-indian tracking-widest"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer List */}
                    <div className="bg-brand-surface border border-white/5 rounded-2xl overflow-hidden">
                      <div className="p-5 border-b border-white/5 bg-black/30">
                        <h3 className="font-display text-xl italic">ALL CUSTOMERS ({filteredUsers.length})</h3>
                      </div>
                      <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                        {filteredUsers.map((u) => (
                          <button
                            key={u.uid}
                            onClick={() => setSelectedUserId(u.uid)}
                            className={cn(
                              "w-full flex items-center gap-4 p-4 border-b border-white/5 transition-all text-left hover:bg-white/5",
                              selectedUserId === u.uid && "bg-brand-accent/10 border-l-2 border-l-brand-accent"
                            )}
                          >
                            <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center font-display text-sm italic font-bold flex-shrink-0">
                              {u.name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">{u.name || "No name"}</p>
                              <p className="text-[10px] text-gray-500 font-indian tracking-widest truncate">{u.email}</p>
                            </div>
                            <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                              u.role === "admin" ? "bg-brand-accent/20 text-brand-accent" : "bg-white/5 text-gray-500"
                            }`}>
                              {u.role || "user"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selected User Details */}
                    <div className="bg-brand-surface border border-white/5 rounded-2xl overflow-hidden">
                      <div className="p-5 border-b border-white/5 bg-black/30">
                        <h3 className="font-display text-xl italic">
                          {selectedUserId ? "CUSTOMER ORDERS" : "SELECT A CUSTOMER"}
                        </h3>
                      </div>
                      {selectedUserId ? (
                        <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto no-scrollbar">
                          {selectedUserOrders.length === 0 ? (
                            <div className="py-12 text-center text-gray-600 font-indian tracking-widest text-sm">
                              No orders from this customer
                            </div>
                          ) : (
                            selectedUserOrders.map((order) => (
                              <div key={order.id} className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-indian text-xs tracking-wider text-gray-300">#{order.id.slice(-8).toUpperCase()}</p>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                                    {order.orderStatus}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-[10px] text-gray-500">{order.items?.length} items • {formatDate(order.createdAt)}</p>
                                  <p className="font-display text-lg text-brand-gold">{formatCurrency(order.total)}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
                          <Eye className="w-12 h-12 mb-3 opacity-20" />
                          <p className="font-indian tracking-widest text-sm">Click a customer to view their orders</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══════ ANALYTICS ═══════ */}
              {activeTab === "analytics" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Revenue Chart */}
                    <div className="bg-brand-surface border border-white/5 rounded-2xl p-6">
                      <h3 className="font-display text-xl italic tracking-wider uppercase mb-6">Revenue Trend</h3>
                      <div className="h-72">
                        {stats?.revenueByDay?.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.revenueByDay}>
                              <defs>
                                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ff0055" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#ff0055" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="date" stroke="#555" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                              <YAxis stroke="#555" fontSize={10} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                              <Tooltip content={<CustomTooltip />} />
                              <Area type="monotone" dataKey="revenue" stroke="#ff0055" fill="url(#revGrad2)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-600 text-sm font-indian">No data</div>
                        )}
                      </div>
                    </div>

                    {/* Orders Per Day */}
                    <div className="bg-brand-surface border border-white/5 rounded-2xl p-6">
                      <h3 className="font-display text-xl italic tracking-wider uppercase mb-6">Daily Orders</h3>
                      <div className="h-72">
                        {stats?.ordersByDay?.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.ordersByDay}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis dataKey="date" stroke="#555" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                              <YAxis stroke="#555" fontSize={10} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="orders" fill="#00f0ff" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-600 text-sm font-indian">No data</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-brand-surface border border-white/5 rounded-2xl p-6 text-center">
                      <CreditCard className="w-8 h-8 text-brand-cyan mx-auto mb-3" />
                      <p className="font-display text-4xl italic">{stats?.stripeOrders || 0}</p>
                      <p className="text-[10px] text-gray-500 font-indian tracking-widest uppercase mt-1">Stripe Orders</p>
                    </div>
                    <div className="bg-brand-surface border border-white/5 rounded-2xl p-6 text-center">
                      <Truck className="w-8 h-8 text-brand-gold mx-auto mb-3" />
                      <p className="font-display text-4xl italic">{stats?.codOrders || 0}</p>
                      <p className="text-[10px] text-gray-500 font-indian tracking-widest uppercase mt-1">COD Orders</p>
                    </div>
                    <div className="bg-brand-surface border border-white/5 rounded-2xl p-6 text-center">
                      <ShoppingBag className="w-8 h-8 text-brand-success mx-auto mb-3" />
                      <p className="font-display text-4xl italic">{formatCurrency(stats?.totalRevenue || 0)}</p>
                      <p className="text-[10px] text-gray-500 font-indian tracking-widest uppercase mt-1">Total Revenue</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <Footer />
        </div>
      </main>
    </ProtectedRoute>
  );
}
