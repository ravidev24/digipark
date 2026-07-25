import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Phone, Mail, Shield, Plus, Edit, Trash2 } from "lucide-react";
import { AUTH_URL, authHeaders } from "../config/api";

const AdminUsersView = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", phoneNumber: "" });
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${AUTH_URL}/users`, authHeaders(token));
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${AUTH_URL}/users`, newUser, authHeaders(token));
      Swal.fire({ title: "Admin User Created", text: "User registered with Admin role", icon: "success", timer: 2000, showConfirmButton: false });
      setNewUser({ username: "", email: "", password: "", phoneNumber: "" });
      fetchUsers();
    } catch (err) {
      Swal.fire({ title: "Failed", text: err.response?.data?.message || err.message, icon: "error" });
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${AUTH_URL}/users/${editingUser._id}`, editingUser, authHeaders(token));
      Swal.fire({ title: "User Updated", icon: "success", timer: 1500, showConfirmButton: false });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      Swal.fire({ title: "Failed", text: err.response?.data?.message || err.message, icon: "error" });
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirm = await Swal.fire({
      title: "Delete user?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${AUTH_URL}/users/${userId}`, authHeaders(token));
        Swal.fire({ title: "Deleted", icon: "success", timer: 1500, showConfirmButton: false });
        fetchUsers();
      } catch (err) {
        Swal.fire({ title: "Failed", text: err.response?.data?.message || err.message, icon: "error" });
      }
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      <div>
        <h1 className="admin-page-title">User Management</h1>
        <p className="admin-page-subtitle">Create admin users and manage all platform accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="admin-card">
          {editingUser ? (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Edit size={20} className="text-blue-400" /> Edit User</h3>
              <div>
                <label className="form-label">Username</label>
                <input className="form-input" value={editingUser.username} onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input className="form-input" value={editingUser.phoneNumber} onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Role</label>
                <select className="form-input" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-admin flex-1">Update</button>
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg">Cancel</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddUser} className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Plus size={20} className="text-blue-400" /> Add Admin User</h3>
              <p className="text-xs text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg">Users created here are automatically assigned the Admin role</p>
              <div>
                <label className="form-label">Username</label>
                <input className="form-input" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input type="password" className="form-input" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input className="form-input" value={newUser.phoneNumber} onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })} required />
              </div>
              <button type="submit" className="btn-admin w-full">Create Admin User</button>
            </form>
          )}
        </div>

        <div className="admin-card lg:col-span-2 overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-6">Users List ({users.length})</h3>
          {loading ? (
            <p className="text-slate-500 text-center py-10">Loading...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center font-bold text-blue-400">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white">{u.username}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1"><Mail size={10} /> {u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-400"><Phone size={12} className="inline mr-1" />{u.phoneNumber}</td>
                    <td>
                      <span className={`status-badge ${u.role === "admin" ? "status-active" : "status-completed"}`}>
                        <Shield size={10} className="inline mr-1" />{u.role}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingUser(u)} className="p-2 bg-slate-700 hover:bg-blue-600 rounded-lg"><Edit size={14} /></button>
                        <button onClick={() => handleDeleteUser(u._id)} className="p-2 bg-slate-700 hover:bg-red-600 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersView;
