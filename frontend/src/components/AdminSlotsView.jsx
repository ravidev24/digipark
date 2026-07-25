import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Plus, Edit, Trash2, ParkingSquare } from "lucide-react";
import { API_URL, authHeaders } from "../config/api";

const AdminSlotsView = ({ token }) => {
  const [slots, setSlots] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ areaId: "", slotNumber: "", slotType: "car", pricePerHour: 20 });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsRes, areasRes] = await Promise.all([
        axios.get(`${API_URL}/slots`, authHeaders(token)),
        axios.get(`${API_URL}/areas`),
      ]);
      setSlots(slotsRes.data);
      setAreas(areasRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/slots`, form, authHeaders(token));
      Swal.fire({ title: "Slot Created", icon: "success", timer: 1500, showConfirmButton: false });
      setForm({ areaId: "", slotNumber: "", slotType: "car", pricePerHour: 20 });
      fetchData();
    } catch (err) {
      Swal.fire({ title: "Error", text: err.response?.data?.message || err.message, icon: "error" });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/slots/${editing._id}`, editing, authHeaders(token));
      Swal.fire({ title: "Slot Updated", icon: "success", timer: 1500, showConfirmButton: false });
      setEditing(null);
      fetchData();
    } catch (err) {
      Swal.fire({ title: "Error", text: err.response?.data?.message || err.message, icon: "error" });
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete slot?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/slots/${id}`, authHeaders(token));
        Swal.fire({ title: "Deleted", icon: "success", timer: 1500, showConfirmButton: false });
        fetchData();
      } catch (err) {
        Swal.fire({ title: "Error", text: err.response?.data?.message || err.message, icon: "error" });
      }
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      <div>
        <h1 className="admin-page-title">Slot Management</h1>
        <p className="admin-page-subtitle">Add, edit, and delete parking slots across all areas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="admin-card">
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Edit size={20} className="text-blue-400" /> Edit Slot
              </h3>
              <div>
                <label className="form-label">Slot Number</label>
                <input className="form-input" value={editing.slotNumber} onChange={(e) => setEditing({ ...editing, slotNumber: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Type</label>
                <select className="form-input" value={editing.slotType || "car"} onChange={(e) => setEditing({ ...editing, slotType: e.target.value })}>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                </select>
              </div>
              <div>
                <label className="form-label">Price/Hour (₹)</label>
                <input type="number" className="form-input" value={editing.pricePerHour} onChange={(e) => setEditing({ ...editing, pricePerHour: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Status</label>
                <select className="form-input" value={editing.isBooked ? "booked" : "available"} onChange={(e) => setEditing({ ...editing, isBooked: e.target.value === "booked" })}>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-admin flex-1">Update</button>
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg">Cancel</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Plus size={20} className="text-blue-400" /> Add Slot
              </h3>
              <div>
                <label className="form-label">Parking Area</label>
                <select className="form-input" value={form.areaId} onChange={(e) => setForm({ ...form, areaId: e.target.value })} required>
                  <option value="">Select area</option>
                  {areas.map((a) => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Slot Number</label>
                <input className="form-input" value={form.slotNumber} onChange={(e) => setForm({ ...form, slotNumber: e.target.value })} placeholder="P-101" required />
              </div>
              <div>
                <label className="form-label">Type</label>
                <select className="form-input" value={form.slotType} onChange={(e) => setForm({ ...form, slotType: e.target.value })}>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                </select>
              </div>
              <div>
                <label className="form-label">Price/Hour (₹)</label>
                <input type="number" className="form-input" value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} required />
              </div>
              <button type="submit" className="btn-admin w-full">Create Slot</button>
            </form>
          )}
        </div>

        <div className="admin-card lg:col-span-2 overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <ParkingSquare size={20} className="text-blue-400" /> All Slots ({slots.length})
          </h3>
          {loading ? (
            <p className="text-slate-500 text-center py-10">Loading...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Slot</th>
                  <th>Area</th>
                  <th>Type</th>
                  <th>Price/hr</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((s) => (
                  <tr key={s._id}>
                    <td className="font-medium text-white">{s.slotNumber}</td>
                    <td className="text-slate-400">{s.area?.name || "—"}</td>
                    <td className="capitalize">{s.slotType || "car"}</td>
                    <td>₹{s.pricePerHour}</td>
                    <td>
                      <span className={`status-badge ${s.isBooked ? "status-cancelled" : "status-active"}`}>
                        {s.isBooked ? "Booked" : "Available"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(s)} className="p-2 bg-slate-700 hover:bg-blue-600 rounded-lg transition-colors"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(s._id)} className="p-2 bg-slate-700 hover:bg-red-600 rounded-lg transition-colors"><Trash2 size={14} /></button>
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

export default AdminSlotsView;
