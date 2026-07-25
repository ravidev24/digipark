import React from "react";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  User,
  LogOut,
  Car,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ROUTES } from "../routes";

const NavItem = ({ to, label, icon: Icon }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === to;

  return (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${isActive
          ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10"
          : "text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
        }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
};

const CustomerShell = ({ children, user, handleLogout, theme, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const mobileNav = [
    { to: ROUTES.CUSTOMER_DASHBOARD, label: "Home", icon: LayoutDashboard },
    { to: ROUTES.CUSTOMER_PARKING, label: "Find", icon: Search },
    { to: ROUTES.CUSTOMER_BOOKINGS, label: "Bookings", icon: Calendar },
    { to: ROUTES.CUSTOMER_PROFILE, label: "Profile", icon: User },
  ];

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen pb-20 md:pb-0 transition-colors duration-300
      ${isDark
        ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
        : "bg-gradient-to-br from-slate-50 via-white to-teal-50/30"
      }`}
    >
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[120px] animate-float
          ${isDark ? "bg-teal-500/5" : "bg-teal-300/20"}`}
        />
        <div className={`absolute top-1/2 -left-40 w-80 h-80 rounded-full blur-[100px]
          ${isDark ? "bg-blue-500/5" : "bg-blue-200/20"}`}
          style={{ animationDelay: "3s" }}
        />
        {!isDark && (
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23000' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            }}
          />
        )}
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300
        ${isDark
          ? "bg-slate-950/80 border-white/5"
          : "bg-white/80 border-slate-200/80"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          {/* Brand */}
          <Link to={ROUTES.CUSTOMER_DASHBOARD} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20 group-hover:shadow-teal-600/40 transition-shadow">
              <Car size={22} className="text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              ParkSmart
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavItem to={ROUTES.CUSTOMER_DASHBOARD} label="Dashboard" icon={LayoutDashboard} />
            <NavItem to={ROUTES.CUSTOMER_PARKING} label="Find Parking" icon={Search} />
            <NavItem to={ROUTES.CUSTOMER_BOOKINGS} label="My Bookings" icon={Calendar} />
            <NavItem to={ROUTES.CUSTOMER_TRANSACTIONS} label="Transactions" icon={CreditCard} />
            <NavItem to={ROUTES.CUSTOMER_PROFILE} label="Profile" icon={User} />
          </div>

          {/* Right: Theme toggle + User + Logout */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`relative p-2.5 rounded-xl transition-all duration-300 group
                ${isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-amber-400"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <div className="relative w-5 h-5">
                <Sun
                  size={20}
                  className={`absolute inset-0 transition-all duration-300 ${isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`}
                />
                <Moon
                  size={20}
                  className={`absolute inset-0 transition-all duration-300 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`}
                />
              </div>
            </button>

            {/* User chip */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors
              ${isDark
                ? "bg-white/5 border-white/10"
                : "bg-slate-100 border-slate-200"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                {user?.username}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors
                ${isDark
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-slate-500 hover:text-red-600 hover:bg-red-50"
                }`}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className={`md:hidden fixed bottom-0 inset-x-0 backdrop-blur-xl border-t z-50 transition-colors duration-300
        ${isDark
          ? "bg-slate-950/95 border-white/5"
          : "bg-white/95 border-slate-200"
        }`}
      >
        <div className="flex justify-around py-2">
          {mobileNav.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors
                  ${isActive
                    ? "text-teal-600 dark:text-teal-400"
                    : isDark ? "text-slate-500" : "text-slate-400"
                  }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CustomerShell;
