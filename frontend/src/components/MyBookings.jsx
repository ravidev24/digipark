import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Calendar, Clock, MapPin, Tag, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { API_URL, authHeaders } from "../config/api";

const MyBookings = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/bookings`, authHeaders(token));
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const generateInvoice = (booking) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(13, 148, 136);
    doc.text("ParkSmart Invoice", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice ID: ${booking._id.substring(0, 8).toUpperCase()}`, 105, 30, { align: "center" });
    doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString()}`, 105, 36, { align: "center" });

    const tableData = [
      ["Location", booking.slot?.area?.name || "N/A"],
      ["Address", booking.slot?.area?.address || "N/A"],
      ["Slot Number", booking.slot?.slotNumber || "N/A"],
      ["Start Time", new Date(booking.startTime).toLocaleString()],
      ["End Time", new Date(booking.endTime).toLocaleString()],
      ["Status", booking.status],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Field", "Details"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [13, 148, 136] },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0);
    doc.text(`Total Amount: Rs ${booking.totalPrice}`, 140, finalY);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(150);
    doc.text("Thank you for choosing ParkSmart.", 105, 280, { align: "center" });
    doc.save(`Invoice_${booking._id.substring(0, 8)}.pdf`);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
      completed: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20",
      cancelled: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20",
    };
    const styleClass = styles[status] || styles.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${styleClass}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 dark:text-slate-400">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and manage your parking reservations</p>
        </div>
        <div className="px-4 py-2 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 rounded-xl text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-2 w-fit">
          <Tag size={18} /> {bookings.length} Bookings
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl p-16 text-center bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
          <Calendar size={48} className="mx-auto text-slate-400 dark:text-slate-600 mb-4 animate-float" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No bookings yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Find parking and book your first spot to get started.</p>
          <a
            href="/customer/parking"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors"
          >
            Find Parking
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div
              key={booking._id}
              className="flex flex-col lg:flex-row lg:items-center gap-4 p-6 rounded-2xl border transition-all duration-200 animate-slide-up
                bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/5 
                hover:border-teal-500/20 dark:hover:border-teal-500/20"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-teal-50 dark:bg-teal-600/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                <Tag size={24} />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{booking.slot?.area?.name || "Unknown Area"}</h4>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-teal-600 dark:text-teal-400" /> Slot {booking.slot?.slotNumber}</span>
                  <span className="flex items-center gap-1"><Clock size={14} className="text-slate-400 dark:text-slate-500" /> {new Date(booking.startTime).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 lg:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-white/5">
                {getStatusBadge(booking.status)}
                <div className="text-right">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Amount</p>
                  <p className="text-xl font-bold text-teal-600 dark:text-teal-400">₹{booking.totalPrice}</p>
                </div>
                <button
                  onClick={() => generateInvoice(booking)}
                  className="p-3 rounded-xl border transition-all duration-200
                    bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-600/20 
                    border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                  title="Download Invoice"
                >
                  <FileText size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
