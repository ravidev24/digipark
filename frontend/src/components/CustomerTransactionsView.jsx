import React, { useState, useEffect } from "react";
import axios from "axios";
import { CreditCard, Receipt } from "lucide-react";
import { API_URL, authHeaders } from "../config/api";

const CustomerTransactionsView = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API_URL}/transactions`, authHeaders(token));
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token]);

  const totalSpent = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Transaction History</h1>
          <p className="text-slate-500 dark:text-slate-400">View your payment records and receipts</p>
        </div>
        <div className="p-4 flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
            <CreditCard size={24} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Spent</p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">₹{totalSpent.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <Receipt size={48} className="mx-auto text-slate-400 dark:text-slate-600 mb-4 animate-float" />
            <p className="text-slate-500 dark:text-slate-400">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((t, index) => (
              <div
                key={t._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border gap-4 transition-all duration-200 animate-slide-up
                  bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-white/5
                  hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-white/10"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-600/10 rounded-xl flex items-center justify-center shrink-0">
                    <Receipt size={22} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{t.booking?.slot?.area?.name || "Parking Payment"}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Slot {t.booking?.slot?.slotNumber} · {t.paymentMethod?.toUpperCase()}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1">{t.transactionId}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right border-t sm:border-t-0 border-slate-100 dark:border-white/5 pt-3 sm:pt-0">
                  <p className="text-xl font-bold text-teal-600 dark:text-teal-400">₹{t.amount}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase mt-1
                    ${t.status === "completed"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"
                      : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-500/20"
                    }`}
                  >
                    {t.status}
                  </span>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">{new Date(t.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerTransactionsView;
