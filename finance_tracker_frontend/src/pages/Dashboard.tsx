import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { fetchMonthlySummary, fetchSpendingAnalysis } from "../api";
import "./Dashboard.css";

Chart.register(...registerables);

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [month, setMonth] = useState("");
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
    const now = new Date();
    const defaultMonth = now.toISOString().slice(0, 7);
    setMonth(defaultMonth);
    loadData(defaultMonth, "", "all");
  }, [navigate]);

  const loadData = async (month: string, range: string, category: string) => {
    setLoading(true);
    try {
      const summaryData = await fetchMonthlySummary(month);
      const analysisData = await fetchSpendingAnalysis({ 
        start_date: startDate, 
        end_date: endDate,
        category: category !== "all" ? category : undefined
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
    loadData(month, `${startDate}|${endDate}`, category);
  };

  // Chart configuration functions
  const spendingTrendConfig = {
    labels: analysis?.monthly_trend.labels || [],
    datasets: [{
      label: 'Spending Trend',
      data: analysis?.monthly_trend.values || [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const categoryDistributionConfig = {
    labels: analysis?.category_breakdown.labels || [],
    datasets: [{
      data: analysis?.category_breakdown.values || [],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
      ]
    }]
  };

  return (
    <div className="dashboard-container">
      <h1>Financial Dashboard</h1>
      
      {/* Filters Section */}
      <div className="filters-section">
        <form onSubmit={handleFilterSubmit}>
          <div className="filter-group">
            <label>Date Range:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="housing">Housing</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Applying Filters..." : "Apply Filters"}
          </button>
        </form>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Income</h3>
            <p>${summary.income.toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h3>Total Expenses</h3>
            <p>${summary.expenses.toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h3>Net Balance</h3>
            <p className={summary.net_balance >= 0 ? "positive" : "negative"}>
              ${summary.net_balance.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {analysis && (
        <div className="charts-grid">
          <div className="chart-container">
            <h3>Spending Trend</h3>
            <Line data={spendingTrendConfig} />
          </div>
          
          <div className="chart-container">
            <h3>Category Distribution</h3>
            <Pie data={categoryDistributionConfig} />
          </div>
        </div>
      )}

      {/* Transaction List Preview */}
      {analysis?.recent_transactions && (
        <div className="transactions-preview">
          <h3>Recent Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {analysis.recent_transactions.map((tx: any) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.transaction_date).toLocaleDateString()}</td>
                  <td>${tx.amount.toFixed(2)}</td>
                  <td>{tx.category}</td>
                  <td>{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading && <div className="loading-overlay">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Dashboard;