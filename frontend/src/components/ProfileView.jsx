import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { User, Mail, Phone, Shield, Save } from "lucide-react";
import { AUTH_URL, authHeaders } from "../config/api";

const ProfileView = ({ user, token, onProfileUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { username: form.username, email: form.email, phoneNumber: form.phoneNumber };
      if (form.password) payload.password = form.password;

      const res = await axios.put(`${AUTH_URL}/profile`, payload, authHeaders(token));
      onProfileUpdate(res.data.user);
      setEditing(false);
      setForm({ ...form, password: "" });
      Swal.fire({
        title: "Profile Updated",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
        color: document.documentElement.classList.contains("dark") ? "#f8fafc" : "#0f172a",
      });
    } catch (err) {
      Swal.fire({
        title: "Update Failed",
        text: err.response?.data?.message || err.message,
        icon: "error",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
        color: document.documentElement.classList.contains("dark") ? "#f8fafc" : "#0f172a",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Profile Management</h1>
        <p className="text-slate-500 dark:text-slate-400">View and update your account information</p>
      </div>

      <div className="rounded-2xl p-6 md:p-8 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-white/5">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-teal-500/20">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.username}</h2>
            <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 rounded-full text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase">
              <Shield size={12} /> {user?.role}
            </span>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                className="form-input bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-teal-500/40"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label text-slate-700 dark:text-slate-300">Email</label>
              <input
                type="email"
                className="form-input bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-teal-500/40"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label text-slate-700 dark:text-slate-300">Phone Number</label>
              <input
                className="form-input bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-teal-500/40"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label text-slate-700 dark:text-slate-300">New Password (optional)</label>
              <input
                type="password"
                className="form-input bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-teal-500/40"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-customer flex items-center gap-2">
                <Save size={16} /> {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1"><User size={14} /> Username</div>
                <p className="text-slate-950 dark:text-white font-semibold">{user?.username}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1"><Mail size={14} /> Email</div>
                <p className="text-slate-950 dark:text-white font-semibold">{user?.email}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1"><Phone size={14} /> Phone</div>
                <p className="text-slate-950 dark:text-white font-semibold">{user?.phoneNumber}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1"><Shield size={14} /> Account Type</div>
                <p className="text-teal-600 dark:text-teal-400 font-semibold capitalize">{user?.role}</p>
              </div>
            </div>
            <button onClick={() => setEditing(true)} className="btn-customer px-6 py-2.5">Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
