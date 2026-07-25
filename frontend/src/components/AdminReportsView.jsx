import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart3, Users, ParkingSquare, IndianRupee, Calendar } from "lucide-react";
import { API_URL, authHeaders } from "../config/api";

const AdminReportsView = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/stats`, authHeaders(token));
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="text-slate-400 text-center py-20">Loading reports...</div>;

  const occupancyRate = stats?.totalSlots
    ? Math.round((stats.bookedSlots / stats.totalSlots) * 100)
    : 0;

  const reportCards = [
    { title: "User Distribution", items: [
      { label: "Customers", value: stats?.totalCustomers, color: "text-green-400" },
      { label: "Admins", value: stats?.totalAdmins, color: "text-blue-400" },
      { label: "Total Users", value: stats?.totalUsers, color: "text-white" },
    ], icon: Users },
    { title: "Parking Inventory", items: [
      { label: "Total Areas", value: stats?.totalAreas, color: "text-purple-400" },
      { label: "Total Slots", value: stats?.totalSlots, color: "text-white" },
      { label: "Occupancy Rate", value: `${occupancyRate}%`, color: "text-amber-400" },
    ], icon: ParkingSquare },
    { title: "Financial Summary", items: [
      { label: "Total Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, color: "text-green-400" },
      { label: "Transactions", value: stats?.totalTransactions, color: "text-white" },
      { label: "Avg. per Transaction", value: stats?.totalTransactions ? `₹${Math.round(stats.totalRevenue / stats.totalTransactions)}` : "₹0", color: "text-blue-400" },
    ], icon: IndianRupee },
    { title: "Booking Analytics", items: [
      { label: "Total Bookings", value: stats?.totalBookings, color: "text-white" },
      { label: "Active", value: stats?.activeBookings, color: "text-green-400" },
      { label: "Completed/Cancelled", value: (stats?.totalBookings || 0) - (stats?.activeBookings || 0), color: "text-slate-400" },
    ], icon: Calendar },
  ];

  return (
    <div className="space-y-8 animate-slide-in">
      <div>
        <h1 className="admin-page-title flex items-center gap-3">
          <BarChart3 size={28} className="text-blue-600 dark:text-blue-400" /> Reports & Statistics
        </h1>
        <p className="admin-page-subtitle">Platform analytics and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCards.map((card, i) => (
          <div key={i} className="admin-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="stat-icon stat-icon-blue">
                <card.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            </div>
            <div className="space-y-4">
              {card.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                  <span className="text-slate-400">{item.label}</span>
                  <span className={`font-bold text-lg ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3 className="text-lg font-semibold text-white mb-4">Slot Occupancy Overview</h3>
        <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-slate-400">
          <span>{stats?.bookedSlots || 0} booked</span>
          <span>{occupancyRate}% occupied</span>
          <span>{stats?.availableSlots || 0} available</span>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsView;
