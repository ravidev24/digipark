import React from "react";
import {
  LayoutDashboard,
  Users,
  ParkingSquare,
  Calendar,
  CreditCard,
  BarChart3,
  LogOut,
  Car,
  MapPin,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";

const NavItem = ({ to, label, icon: Icon }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === to;

  return (
    <button
      onClick={() => navigate(to)}
      className={`admin-nav-item ${isActive ? "active" : ""}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
};

const AdminShell = ({ children, user, handleLogout, theme, toggleTheme }) => {
  const isDark = theme === "dark";

  return (
    <div className="admin-layout min-h-screen flex transition-colors duration-300">
      <aside className="admin-sidebar w-64 fixed inset-y-0 left-0 flex flex-col z-40">
        <div className="p-6 border-b admin-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Car size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold admin-text">ParkSmart</h1>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest admin-text-muted font-bold px-3 mb-3">Overview</p>
          <NavItem to={ROUTES.ADMIN_DASHBOARD} label="Dashboard" icon={LayoutDashboard} />
          <NavItem to={ROUTES.ADMIN_REPORTS} label="Reports & Stats" icon={BarChart3} />

          <p className="text-[10px] uppercase tracking-widest admin-text-muted font-bold px-3 mb-3 mt-6">Management</p>
          <NavItem to={ROUTES.ADMIN_USERS} label="User Management" icon={Users} />
          <NavItem to={ROUTES.ADMIN_AREAS} label="Parking Areas" icon={MapPin} />
          <NavItem to={ROUTES.ADMIN_SLOTS} label="Slot Management" icon={ParkingSquare} />
          <NavItem to={ROUTES.ADMIN_BOOKINGS} label="Bookings" icon={Calendar} />
          <NavItem to={ROUTES.ADMIN_TRANSACTIONS} label="Transactions" icon={CreditCard} />
        </nav>

        <div className="p-4 border-t admin-sidebar-border space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm admin-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-blue-600" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>

          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold admin-text truncate">{user?.username}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-w-0">
        <header className="admin-header sticky top-0 z-30 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold admin-text">Admin Dashboard</h2>
            <p className="text-sm admin-text-muted">Manage parking operations and users</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg admin-icon-btn md:hidden"
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>
            <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              Admin Access
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminShell;
