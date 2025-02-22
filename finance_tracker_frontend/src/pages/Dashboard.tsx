import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { fetchMonthlySummary, fetchSpendingAnalysis } from "../api";

Chart.register(...registerables);

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }
    const now = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setStartDate(now);
    setEndDate(now);
    loadData(now, now, "all");
  }, [navigate]);

  const loadData = async (start: string, end: string, category: string) => {
    setLoading(true);
    try {
      const summaryData = await fetchMonthlySummary(start);
      const analysisData = await fetchSpendingAnalysis({
        start_date: start,
        end_date: end,
        category: category !== "all" ? category : undefined,
      });

      setSummary(summaryData);
      setAnalysis(analysisData);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(startDate, endDate, category);
  };

  return (
    <div className="p-6 text-black min-h-screen ">
      <h1 className="text-3xl font-semibold mb-6 text-center bg-white">
        Financial Dashboard
      </h1>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Date Range Inputs */}
            <div className="flex flex-col w-full sm:w-1/2 md:w-1/3">
              <label className="text-gray-700">Date Range:</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col w-full sm:w-1/2 md:w-1/3">
              <label className="text-gray-700">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="all">All Categories</option>
                <option value="food">Food</option>
                <option value="housing">Housing</option>
                <option value="transportation">Transportation</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 text-white p-2 rounded-lg mt-4"
          >
            {loading ? "Applying Filters..." : "Apply Filters"}
          </button>
        </form>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-700">Total Income</h3>
            <p className="text-2xl font-semibold text-green-500">
              ${summary.income.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-700">Total Expenses</h3>
            <p className="text-2xl font-semibold text-red-500">
              ${summary.expenses.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-700">Net Balance</h3>
            <p
              className={`text-2xl font-semibold ${
                summary.net_balance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ${summary.net_balance.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Transaction List Preview */}
      {analysis?.recent_transactions && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="font-medium text-gray-700">Recent Transactions</h3>
          <table className="w-full mt-4 table-auto border-collapse">
            <thead className="text-left">
              <tr>
                <th className="border-b py-2 px-4">Date</th>
                <th className="border-b py-2 px-4">Amount</th>
                <th className="border-b py-2 px-4">Category</th>
                <th className="border-b py-2 px-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {analysis.recent_transactions.map((tx: any) => (
                <tr key={tx.id}>
                  <td className="border-b py-2 px-4">
                    {new Date(tx.transaction_date).toISOString().split("T")[0]}
                  </td>
                  <td className="border-b py-2 px-4">
                    ${Number(tx.amount).toFixed(2)}
                  </td>
                  <td className="border-b py-2 px-4">{tx.category}</td>
                  <td className="border-b py-2 px-4">{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center text-white">
          Loading...
        </div>
      )}
      {error && <div className="text-center text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Dashboard;