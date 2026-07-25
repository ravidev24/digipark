import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, ParkingSquare, Calendar, IndianRupee, TrendingUp, MapPin } from "lucide-react";
import { API_URL, authHeaders } from "../config/api";

const AdminDashboardView = ({ token }) => {
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

  if (loading) {
    return <div className="text-slate-400 text-center py-20">Loading dashboard...</div>;
  }

  const cards = [
    { label: "Total Users", value: stats?.totalUsers || 0, sub: `${stats?.totalCustomers || 0} customers`, icon: Users, color: "blue" },
    { label: "Parking Areas", value: stats?.totalAreas || 0, sub: `${stats?.totalSlots || 0} total slots`, icon: MapPin, color: "purple" },
    { label: "Active Bookings", value: stats?.activeBookings || 0, sub: `${stats?.totalBookings || 0} total`, icon: Calendar, color: "green" },
    { label: "Total Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, sub: `${stats?.totalTransactions || 0} transactions`, icon: IndianRupee, color: "amber" },
  ];

  return (
    <div className="space-y-8 animate-slide-in">
      <div>
        <h1 className="admin-page-title">Dashboard Overview</h1>
        <p className="admin-page-subtitle">Monitor parking operations and platform performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="admin-stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">{card.label}</p>
                <p className="text-3xl font-bold admin-text">{card.value}</p>
                <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
              </div>
              <div className={`stat-icon stat-icon-${card.color}`}>
                <card.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="admin-card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
            <TrendingUp size={18} className="text-blue-400" />
          </div>
          {stats?.recentBookings?.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No bookings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Location</th>
                    <th>Slot</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentBookings?.map((b) => (
                    <tr key={b._id}>
                      <td className="font-medium text-white">{b.user?.username}</td>
                      <td className="text-slate-400">{b.slot?.area?.name || "—"}</td>
                      <td>{b.slot?.slotNumber}</td>
                      <td className="text-green-400">₹{b.totalPrice}</td>
                      <td>
                        <span className={`status-badge status-${b.status}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-card">
          <h3 className="text-lg font-semibold text-white mb-6">Slot Availability</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <ParkingSquare size={20} className="text-green-400" />
                <span className="text-slate-300">Available</span>
              </div>
              <span className="text-xl font-bold text-green-400">{stats?.availableSlots || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <ParkingSquare size={20} className="text-red-400" />
                <span className="text-slate-300">Booked</span>
              </div>
              <span className="text-xl font-bold text-red-400">{stats?.bookedSlots || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-blue-400" />
                <span className="text-slate-300">Admins</span>
              </div>
              <span className="text-xl font-bold text-blue-400">{stats?.totalAdmins || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
