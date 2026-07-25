import React, { useState, useEffect } from "react";
import axios from "axios";
import { CreditCard, Search } from "lucide-react";
import { API_URL, authHeaders } from "../config/api";

const AdminTransactionsView = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API_URL}/all-transactions`, authHeaders(token));
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  const filtered = transactions.filter(
    (t) =>
      t.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8 animate-slide-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="admin-page-title">Transaction Management</h1>
          <p className="admin-page-subtitle">View all payment records and transaction history</p>
        </div>
        <div className="admin-stat-card !p-4 flex items-center gap-4">
          <CreditCard size={24} className="text-green-400" />
          <div>
            <p className="text-sm text-slate-400">Total Revenue</p>
            <p className="text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="relative mb-6 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, user, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-12"
          />
        </div>

        {loading ? (
          <p className="text-slate-500 text-center py-10">Loading transactions...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Location</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t._id}>
                    <td className="font-mono text-sm text-blue-400">{t.transactionId}</td>
                    <td>
                      <div className="font-medium text-white">{t.user?.username}</div>
                      <div className="text-xs text-slate-500">{t.user?.email}</div>
                    </td>
                    <td className="text-slate-400">{t.booking?.slot?.area?.name || "—"}</td>
                    <td className="font-semibold text-green-400">₹{t.amount}</td>
                    <td className="uppercase text-xs">{t.paymentMethod}</td>
                    <td><span className={`status-badge status-${t.status === "completed" ? "active" : "cancelled"}`}>{t.status}</span></td>
                    <td className="text-slate-400 text-sm">{new Date(t.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactionsView;
