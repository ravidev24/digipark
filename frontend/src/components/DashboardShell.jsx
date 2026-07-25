import React from 'react';
import { Search, Grid, MapPin, Calendar, PlusCircle, ShieldCheck, LogOut, Car, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../routes';

const SidebarItem = ({ to, label, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(to)}
      className={`sidebar-item group ${isActive ? 'active' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20' : 'bg-slate-800/50 group-hover:bg-slate-800'}`}>
          <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'} />
        </div>
        <span className={`font-bold tracking-tight transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{label}</span>
      </div>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-glow"></div>}
    </button>
  );
};

const DashboardShell = ({ children, user, theme, setTheme, handleLogout, seedData }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <aside className="w-72 bg-slate-900/50 backdrop-blur-3xl border-r border-white/5 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 pb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <Car size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">DigiPark</h1>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <div className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 mb-6 px-4">Management</div>
          <SidebarItem to={ROUTES.DASHBOARD} label="Dashboard" icon={Grid} />
          <SidebarItem to={ROUTES.PARKING} label={user?.role === 'admin' ? "Search Slots" : "Find Parking"} icon={MapPin} />
          
          {user && user.role === 'admin' ? (
            <>
              <SidebarItem to={ROUTES.ADD_PARKING} label="Add Slots/Hub" icon={PlusCircle} />
              <SidebarItem to={ROUTES.ADMIN_USERS} label="Users Management" icon={Users} />
              <SidebarItem to={ROUTES.ADMIN_BOOKINGS} label="Global Bookings" icon={Calendar} />
            </>
          ) : (
            <SidebarItem to={ROUTES.BOOKINGS} label="My Bookings" icon={Calendar} />
          )}
          
          <div className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-600 mt-12 mb-6 px-4">Account</div>
          <SidebarItem to={ROUTES.PROFILE} label="Profile" icon={ShieldCheck} />
        </nav>

        <div className="p-8 border-t border-white/5 space-y-3">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full py-3.5 bg-slate-800/50 border border-white/5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-300 hover:bg-slate-850 active:scale-95 transition-all"
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={() => { handleLogout(); window.location.href='/'; }} className="flex items-center justify-center gap-4 text-rose-500 hover:text-rose-400 transition-colors font-black uppercase text-xs tracking-widest group w-full bg-rose-500/5 py-4 rounded-2xl border border-rose-500/10 hover:bg-rose-500/10 active:scale-95 transition-all">
              <LogOut size={18} />
              Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-10 max-w-7xl mx-auto w-full">
        <header className="flex items-center justify-between mb-12 animate-slide-in">
          <div className="flex items-center gap-4">
              <div className="relative group">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search for Chennai spots..." 
                  className="bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 w-[400px] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-slate-600 font-bold"
                />
              </div>
          </div>
          <div className="flex items-center gap-6">
              {user && (
                <div className="flex items-center gap-3 glass py-2.5 px-5 border-indigo-500/20 rounded-2xl shadow-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-[10px] font-black shadow-lg shadow-indigo-500/30">{user.username.charAt(0).toUpperCase()}</div>
                    <span className="text-sm font-black text-slate-200 tracking-tight">{user.username} ({(user.role || 'customer').toUpperCase()})</span>
                </div>
              )}
              {user && user.role === 'admin' && (
                <button onClick={seedData} className="btn btn-secondary !px-6 bg-slate-800/50 ring-1 ring-white/5 hover:bg-slate-800 font-bold text-xs uppercase tracking-widest rounded-xl">
                  Sync Hubs
                </button>
              )}
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default DashboardShell;
