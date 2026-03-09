"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { 
  BarChart, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

const mockOrders = [
  { id: "ORD-2026-001", customer: "Alex Mercer", item: "Real Madrid Home Kit", date: "2026-03-09", amount: "$49.99", status: "Delivered" },
  { id: "ORD-2026-002", customer: "Sarah Chen", item: "Lakers Icon Edition", date: "2026-03-08", amount: "$59.99", status: "Processing" },
  { id: "ORD-2026-003", customer: "Marcus Johnson", item: "FC Barcelona Home Kit", date: "2026-03-08", amount: "$47.99", status: "Shipped" },
  { id: "ORD-2026-004", customer: "Elena Rostova", item: "Custom Pro Football Boots", date: "2026-03-07", amount: "$129.99", status: "Delivered" },
  { id: "ORD-2026-005", customer: "David Kim", item: "Team India World Cup Jersey", date: "2026-03-06", amount: "$29.99", status: "Cancelled" },
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-brand-dark pt-24 pb-12">
      <Header />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="font-display text-5xl md:text-6xl italic tracking-tighter uppercase mb-2">
              SYSTEM <span className="text-brand-accent">OVERVIEW</span>
            </h1>
            <p className="font-indian text-gray-500 tracking-[0.2em] uppercase text-sm">
              Live administration console & terminal
            </p>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="px-6 py-2 border border-white/10 hover:border-brand-accent text-sm font-bold tracking-widest uppercase transition-all">
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Revenue", value: "$45,231.89", trend: "+12.5%", icon: DollarSign, color: "text-brand-success" },
            { label: "Active Orders", value: "142", trend: "+5.2%", icon: Package, color: "text-brand-cyan" },
            { label: "Total Users", value: "8,439", trend: "+18.4%", icon: Users, color: "text-brand-purple" },
            { label: "Performance", value: "99.9%", trend: "Stable", icon: BarChart, color: "text-brand-accent" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-surface border border-white/5 p-6 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <p className="font-indian text-gray-400 tracking-[0.2em] uppercase text-xs mb-4">{stat.label}</p>
                <p className="text-4xl font-display tracking-wider mb-2">{stat.value}</p>
                <p className={`text-sm tracking-wider font-bold ${stat.color} flex items-center gap-1`}>
                  <TrendingUp className="w-4 h-4" /> {stat.trend}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-brand-surface border border-white/5 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
            <h2 className="font-display text-2xl italic tracking-wider">RECENT ORDERS</h2>
            <button className="text-brand-cyan text-sm uppercase tracking-widest font-bold hover:text-white transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20 font-indian uppercase tracking-widest text-xs text-gray-500">
                  <th className="p-5 font-normal">Order ID</th>
                  <th className="p-5 font-normal">Customer</th>
                  <th className="p-5 font-normal">Item</th>
                  <th className="p-5 font-normal">Date</th>
                  <th className="p-5 font-normal">Amount</th>
                  <th className="p-5 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    key={order.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors font-medium text-sm"
                  >
                    <td className="p-5 font-indian tracking-wider text-gray-300">{order.id}</td>
                    <td className="p-5">{order.customer}</td>
                    <td className="p-5 text-gray-400">{order.item}</td>
                    <td className="p-5 text-gray-400 font-indian">{order.date}</td>
                    <td className="p-5 font-bold">{order.amount}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 ${
                        order.status === 'Delivered' ? 'bg-brand-success/10 text-brand-success' :
                        order.status === 'Processing' ? 'bg-brand-cyan/10 text-brand-cyan' :
                        order.status === 'Shipped' ? 'bg-brand-purple/10 text-brand-purple' :
                        'bg-brand-accent/10 text-brand-accent'
                      }`}>
                        {order.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                        {order.status === 'Processing' && <Clock className="w-3 h-3" />}
                        {order.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                        {order.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
