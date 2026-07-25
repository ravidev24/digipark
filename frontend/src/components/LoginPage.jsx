import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Car, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AUTH_URL } from "../config/api";
import { ROUTES, getDashboardRoute } from "../routes";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${AUTH_URL}/login`, form);
      onLogin(res.data.token, res.data.user);
      Swal.fire({
        title: "Welcome back!",
        text: `Signed in as ${res.data.user.username}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#f8fafc",
      });
      navigate(getDashboardRoute(res.data.user.role));
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text: error.response?.data?.message || "Invalid credentials",
        icon: "error",
        background: "#0f172a",
        color: "#f8fafc",
        confirmButtonColor: "#0d9488",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 auth-hero relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
              <Car size={28} className="text-white" />
            </div>
            <span className="text-3xl font-bold text-white">DigiPark</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            India's Most Trusted Parking Partner
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Smart parking for everyday parkers. Find, book, and pay for parking spots across Chennai instantly.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Car size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">DigiPark</span>
          </div>

          <div className="auth-card p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-slate-400 mb-8">Access your parking dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-input pl-12"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="form-input pl-12 pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-customer w-full py-3.5">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-slate-400 mt-6 text-sm">
              Don't have an account?{" "}
              <Link to={ROUTES.REGISTER} className="text-teal-400 font-semibold hover:text-teal-300">
                Create Account
              </Link>
            </p>
            <p className="text-center mt-4">
              <Link to={ROUTES.LANDING} className="text-slate-500 text-sm hover:text-slate-300">
                Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
