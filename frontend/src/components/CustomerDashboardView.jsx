import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Calendar, IndianRupee, MapPin, ArrowRight, Car,
  TrendingUp, Zap, ChevronRight, Navigation,
} from "lucide-react";
import { API_URL, authHeaders } from "../config/api";
import { ROUTES } from "../routes";
import bannerImg from "../banner.webp";
import solutionImg from "../our-solution-1.webp";
import valetImg from "../valet.png";

const CustomerDashboardView = ({ user, token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/stats/customer`, authHeaders(token));
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
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
        <p className="mt-4 text-slate-400 dark:text-slate-400">Loading your dashboard...</p>
      </div>
    );
  }

  const cards = [
    { label: "Total Bookings", value: stats?.totalBookings || 0, icon: Calendar, color: "teal" },
    { label: "Active Sessions", value: stats?.activeBookings || 0, icon: Zap, color: "blue" },
    { label: "Transactions", value: stats?.totalTransactions || 0, icon: TrendingUp, color: "violet" },
    { label: "Total Spent", value: `₹${(stats?.totalSpent || 0).toLocaleString()}`, icon: IndianRupee, color: "amber" },
  ];

  const colorMap = {
    teal: { icon: "bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400", accent: "from-teal-500 to-teal-600" },
    blue: { icon: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400", accent: "from-blue-500 to-blue-600" },
    violet: { icon: "bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400", accent: "from-violet-500 to-violet-600" },
    amber: { icon: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", accent: "from-amber-500 to-orange-500" },
  };

  const getStatusStyle = (status) => {
    const map = {
      active: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
      completed: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20",
      cancelled: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20",
    };
    return map[status] || map.active;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section with Background */}
      <div
        className="relative overflow-hidden rounded-2xl animate-fade-in"
        style={{ animationDelay: "0s" }}
      >
        {/* BG image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bannerImg})`,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-slate-900/85 to-slate-900/80 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-teal-900/70" />

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-teal-300 text-sm font-medium mb-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Welcome back 👋
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                Hello, <span className="text-teal-400">{user?.username || "User"}</span>
              </h1>
              <p className="text-slate-300 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                Manage your parking bookings and find available spots
              </p>
            </div>
            <Link
              to={ROUTES.CUSTOMER_PARKING}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 animate-slide-up group"
              style={{ animationDelay: "0.4s" }}
            >
              <Car size={20} />
              Find Parking
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => {
          const c = colorMap[card.color];
          return (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up
                bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 backdrop-blur-sm
                hover:border-slate-300 dark:hover:border-white/10"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              {/* Accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.icon}`}>
                <card.icon size={22} />
              </div>
              <p className="text-2xl font-bold mt-4 text-slate-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-slide-up"
        style={{ animationDelay: "0.5s" }}
      >
        <Link
          to={ROUTES.CUSTOMER_PARKING}
          className="group flex items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
            bg-gradient-to-r from-teal-500 to-teal-600 text-white"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <MapPin size={24} className="sm:w-7 sm:h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold mb-0.5">Find Parking</h3>
            <p className="text-teal-100 text-xs sm:text-sm truncate">Browse all parking locations</p>
          </div>
          <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>

        <Link
          to={ROUTES.CUSTOMER_PARKING}
          state={{ openNearby: true }}
          className="group flex items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
            bg-gradient-to-r from-blue-500 to-blue-600 text-white"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Navigation size={24} className="sm:w-7 sm:h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold mb-0.5">Nearby Parking</h3>
            <p className="text-blue-100 text-xs sm:text-sm truncate">Find spots closest to you</p>
          </div>
          <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>

        <Link
          to={ROUTES.CUSTOMER_BOOKINGS}
          className="group flex items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:col-span-1
            bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-white/5
            hover:border-teal-300 dark:hover:border-teal-500/30"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-100 dark:bg-teal-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Calendar size={24} className="text-teal-600 dark:text-teal-400 sm:w-7 sm:h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-0.5">My Bookings</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm truncate">View your parking sessions</p>
          </div>
          <ChevronRight size={22} className="text-slate-400 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-1 transition-all shrink-0" />
        </Link>
      </div>

      {/* Recent Bookings */}
      <div
        className="rounded-2xl overflow-hidden animate-slide-up
          bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 backdrop-blur-sm"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Bookings</h3>
          <Link to={ROUTES.CUSTOMER_BOOKINGS} className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>

        <div className="px-6 pb-6">
          {!stats?.recentBookings?.length ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 animate-float">
                <Car size={36} className="text-slate-400 dark:text-slate-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No bookings yet</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Start by finding a parking spot near your destination</p>
              <Link
                to={ROUTES.CUSTOMER_PARKING}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors"
              >
                Find Your First Spot <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentBookings.map((b, i) => (
                <div
                  key={b._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl transition-all duration-200 animate-slide-up
                    bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5
                    hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-white/10"
                  style={{ animationDelay: `${0.7 + i * 0.1}s` }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-teal-100 dark:bg-teal-600/10 rounded-xl flex items-center justify-center shrink-0">
                      <Car size={18} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{b.slot?.area?.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Slot {b.slot?.slotNumber} · {new Date(b.startTime).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:block items-center justify-between sm:text-right pl-[52px] sm:pl-0 shrink-0">
                    <p className="font-bold text-teal-600 dark:text-teal-400">₹{b.totalPrice}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Solutions & Info Showcase */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up"
        style={{ animationDelay: "0.8s" }}
      >
        {/* Solution 1 */}
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 backdrop-blur-sm">
          <div className="h-48 overflow-hidden relative">
            <img 
              src={solutionImg} 
              alt="Smart City Parking Solution" 
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900/90 via-transparent to-transparent" />
          </div>
          <div className="p-6">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Smart City Parking Networks</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We integrate real-time sensor loops and high-occupancy zone analytics across Chennai. Book directly from Express Avenue to Marina Beach with automated slot availability updates.
            </p>
          </div>
        </div>

        {/* Solution 2 */}
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 backdrop-blur-sm">
          <div className="h-48 overflow-hidden relative bg-teal-500/10 flex items-center justify-center">
            <img 
              src={valetImg} 
              alt="Premium Security Valet Services" 
              className="h-40 object-contain transform hover:rotate-3 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900/90 via-transparent to-transparent" />
          </div>
          <div className="p-6">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Premium Security & Valet Integrations</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Experience the ease of digital check-ins. Access automatic ticket processing, license plate scan validation (ANPR), secure CCTV bays, and on-demand valet pick-ups directly from your personal dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardView;
