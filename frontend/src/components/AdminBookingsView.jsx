import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Calendar, Eye, XCircle, X } from "lucide-react";
import { API_URL, authHeaders } from "../config/api";

const BookingDetailModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Modal header — separate bar, no overlap */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white shrink-0">
          <h3 id="booking-modal-title" className="text-lg font-bold">Booking Details</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-blue-500 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-3 text-sm">
          <DetailRow label="Customer" value={booking.user?.username} />
          <DetailRow label="Email" value={booking.user?.email} />
          <DetailRow label="Phone" value={booking.user?.phoneNumber} />
          <DetailRow label="Location" value={booking.slot?.area?.name} />
          <DetailRow label="Address" value={booking.slot?.area?.address} alignRight />
          <DetailRow label="Slot" value={booking.slot?.slotNumber} />
          <DetailRow label="Start" value={new Date(booking.startTime).toLocaleString()} />
          <DetailRow label="End" value={new Date(booking.endTime).toLocaleString()} />
          <DetailRow label="Amount" value={`₹${booking.totalPrice}`} valueClass="text-green-600 dark:text-green-400 font-bold" />
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500 dark:text-slate-400">Status</span>
            <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
          </div>
        </div>

        {/* Footer with blue close button */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-800/80">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const DetailRow = ({ label, value, alignRight, valueClass = "text-slate-900 dark:text-white font-medium" }) => (
  <div className="flex justify-between gap-4">
    <span className="text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
    <span className={`${valueClass} ${alignRight ? "text-right max-w-[220px]" : ""}`}>{value || "—"}</span>
  </div>
);

const AdminBookingsView = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [token]);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/all-bookings`, authHeaders(token));
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/bookings/${id}/status`, { status }, authHeaders(token));
      Swal.fire({ title: "Status Updated", icon: "success", timer: 1500, showConfirmButton: false });
      setSelected(null);
      fetchBookings();
    } catch (err) {
      Swal.fire({ title: "Error", text: err.response?.data?.message || err.message, icon: "error" });
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      <div>
        <h1 className="admin-page-title">Booking Management</h1>
        <p className="admin-page-subtitle">View booking history and manage booking statuses</p>
      </div>

      <div className="admin-card overflow-x-auto">
        {loading ? (
          <p className="text-slate-500 text-center py-10">Loading bookings...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Location</th>
                <th>Slot</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="font-medium admin-text">{b.user?.username}</div>
                    <div className="text-xs text-slate-500">{b.user?.email}</div>
                  </td>
                  <td className="admin-text-muted">{b.slot?.area?.name || "—"}</td>
                  <td className="admin-text">{b.slot?.slotNumber}</td>
                  <td className="text-sm admin-text-muted">
                    {new Date(b.startTime).toLocaleDateString()} – {new Date(b.endTime).toLocaleDateString()}
                  </td>
                  <td className="font-semibold text-green-600 dark:text-green-400">₹{b.totalPrice}</td>
                  <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(b)} className="admin-icon-btn" title="View Details"><Eye size={14} /></button>
                      {b.status === "active" && (
                        <>
                          <button onClick={() => updateStatus(b._id, "completed")} className="admin-icon-btn hover:!bg-green-600" title="Complete"><Calendar size={14} /></button>
                          <button onClick={() => updateStatus(b._id, "cancelled")} className="admin-icon-btn hover:!bg-red-600" title="Cancel"><XCircle size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <BookingDetailModal booking={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default AdminBookingsView;
