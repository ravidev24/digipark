import React from "react";
import { Link } from "react-router-dom";
import {
  Car,
  ShieldCheck,
  MapPin,
  CreditCard,
  Clock,
  Smartphone,
  ChevronRight,
  Search,
  Star,
} from "lucide-react";
import { ROUTES } from "../routes";

const LandingPage = () => {
  const features = [
    { icon: Search, title: "Find Parking", desc: "Search parking spots near malls, theaters, and landmarks across Chennai" },
    { icon: Clock, title: "Book Instantly", desc: "Reserve your spot in seconds with real-time availability" },
    { icon: CreditCard, title: "Digital Payments", desc: "Pay securely via UPI, card, or wallet with instant receipts" },
    { icon: Smartphone, title: "Mobile Ready", desc: "Access your bookings and manage parking from any device" },
  ];

  const destinations = [
    { name: "Express Avenue Mall", type: "Mall", slots: "50+", img: "https://images.unsplash.com/photo-1590674033513-3efbe96d6fc3?auto=format&fit=crop&q=80&w=600" },
    { name: "Phoenix Marketcity", type: "Mall", slots: "100+", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600" },
    { name: "Sathyam Cinemas", type: "Theater", slots: "30+", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600" },
    { name: "Marina Beach", type: "General", slots: "80+", img: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600" },
  ];

  const stats = [
    { value: "12K+", label: "Bookings Monthly" },
    { value: "8", label: "Parking Hubs" },
    { value: "500+", label: "Parking Slots" },
    { value: "4.8", label: "User Rating" },
  ];

  return (
    <div className="landing-page min-h-screen">
      <nav className="landing-nav fixed top-0 inset-x-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={ROUTES.LANDING} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Car size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">ParkSmart</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#destinations" className="hover:text-white transition-colors">Locations</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to={ROUTES.LOGIN} className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to={ROUTES.REGISTER} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-lg transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="landing-hero pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600/10 border border-teal-500/20 rounded-full text-teal-400 text-xs font-semibold uppercase tracking-wider mb-8">
              <ShieldCheck size={14} /> Chennai's Smart Parking Platform
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              India's Most Trusted{" "}
              <span className="text-teal-400">Parking Partner</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
              Smart parking for everyday parkers. Find, book, and pay for parking spots across Chennai — driven by innovative technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={ROUTES.REGISTER} className="btn-customer inline-flex items-center justify-center gap-2 px-8 py-4 text-base">
                Find Parking Now <ChevronRight size={20} />
              </Link>
              <Link to={ROUTES.LOGIN} className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors">
                Sign In to Dashboard
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((s, i) => (
              <div key={i} className="landing-stat-card text-center p-6">
                <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">All Your Parking Needs</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              From finding spots to digital payments, we manage your parking experience end-to-end.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="landing-feature-card p-8">
                <div className="w-14 h-14 bg-teal-600/10 rounded-2xl flex items-center justify-center mb-6">
                  <f.icon size={28} className="text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="destinations" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Popular Destinations</h2>
              <p className="text-slate-400 text-lg">Premium parking at Chennai's top locations</p>
            </div>
            <Link to={ROUTES.REGISTER} className="text-teal-400 font-semibold flex items-center gap-1 hover:text-teal-300">
              View all locations <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((d, i) => (
              <div key={i} className="landing-dest-card group">
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-teal-600 text-white text-xs font-semibold rounded-full uppercase">{d.type}</span>
                </div>
                <div className="p-5 bg-slate-800/50 border border-white/5 border-t-0 rounded-b-2xl">
                  <h3 className="font-bold text-white mb-1">{d.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1"><MapPin size={14} /> {d.slots} slots</span>
                    <span className="text-teal-400 font-semibold">From ₹20/hr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-6 bg-gradient-to-r from-teal-900/20 to-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">Superior User Experience</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-10">
            ParkSmart delivers a seamless parking experience with real-time availability, secure payments, and instant booking confirmations — making every trip stress-free.
          </p>
          <Link to={ROUTES.REGISTER} className="btn-customer inline-flex items-center gap-2 px-10 py-4">
            Create Free Account <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Car size={22} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">ParkSmart</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 ParkSmart. Smart parking for Chennai.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <button type="button" className="hover:text-teal-400 transition-colors">Privacy</button>
            <button type="button" className="hover:text-teal-400 transition-colors">Terms</button>
            <button type="button" className="hover:text-teal-400 transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
