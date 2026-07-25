import React from 'react';
import { Calendar, Clock, ShieldCheck, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';

const DashboardView = ({ user }) => {
  return (
    <div className="animate-slide-in">
      <div className="mb-12">
          <h2 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none">Welcome back, <span className="text-indigo-500">{user?.username}</span></h2>
          <p className="text-slate-400 text-xl font-medium">Your parking journey in Chennai starts here. Secure, fast, and digital.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
              { label: 'Total Bookings', value: '12', icon: Calendar, color: 'text-indigo-400', trend: '+2 this week' },
              { label: 'Active Sessions', value: '0', icon: Clock, color: 'text-emerald-400', trend: 'Ready to book' },
              { label: 'Loyalty Points', value: '450', icon: ShieldCheck, color: 'text-amber-400', trend: 'Gold Status' }
          ].map((stat, i) => (
              <div key={i} className="glass p-10 group hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
                  <div className={`w-14 h-14 rounded-[1.25rem] bg-slate-800 flex items-center justify-center mb-8 border border-white/5 shadow-inner ${stat.color}`}>
                      <stat.icon size={28} />
                  </div>
                  <div className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                  <div className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">{stat.label}</div>
                  <div className="text-[11px] font-black text-indigo-400 bg-indigo-500/5 px-3 py-1 rounded-full w-fit">{stat.trend}</div>
              </div>
          ))}
      </div>
      
      <div className="mt-12 glass p-10 flex items-center justify-between border-indigo-500/10 bg-indigo-500/[0.02]">
          <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30">
                  <Car size={40} />
              </div>
              <div>
                  <h3 className="text-2xl font-black text-white mb-1">Need a spot right now?</h3>
                  <p className="text-slate-500 font-medium">Quickly browse available slots in major Chennai hubs.</p>
              </div>
          </div>
          <Link to={ROUTES.PARKING} className="btn btn-primary !px-10 !py-4 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20">Find Nearest Spot</Link>
      </div>
    </div>
  );
};

export default DashboardView;
