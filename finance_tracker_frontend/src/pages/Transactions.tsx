import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, createTransaction } from "../api"; // Import createTransaction

interface Transaction {
  id: number;
  transaction_date: string;
  amount: number;  // Ensure this is typed as number
  category: string;
  transaction_type: "income" | "expense";
  description: string;
}

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    transaction_date: "",
    amount: 0,
    category: "",
    transaction_type: "income" as "income" | "expense",
    description: "",
  });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/transactions/", {
        params: { start_date: startDate, end_date: endDate },
      });
      setTransactions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (newTransaction.amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      // Use createTransaction from API module
      const createdTransaction = await createTransaction(newTransaction);
      setTransactions((prev) => [...prev, createdTransaction]);

      // Reset form
      setNewTransaction({
        transaction_date: "",
        amount: 0,
        category: "",
        transaction_type: "income",
        description: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }
    fetchTransactions();
  }, [navigate, startDate, endDate]);

  return (
    <div className="transactions-container">
      <h1>Transactions</h1>

      {/* Filter Section */}
      <div className="filter-section">
        <div>
          <label htmlFor="start">Start Date: </label>
          <input
            id="start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="end">End Date: </label>
          <input
            id="end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button onClick={fetchTransactions} disabled={loading}>
          {loading ? "Refreshing..." : "Apply Filters"}
        </button>
      </div>

      {/* Create Transaction Form */}
      <div className="create-transaction">
        <h2>Create New Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="transaction_date">Date:</label>
            <input
              type="date"
              id="transaction_date"
              name="transaction_date"
              value={newTransaction.transaction_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="0.01"
              step="0.01"
              value={newTransaction.amount || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={newTransaction.category}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="transaction_type">Type:</label>
            <select
              id="transaction_type"
              name="transaction_type"
              value={newTransaction.transaction_type}
              onChange={handleInputChange}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newTransaction.description}
              onChange={handleInputChange}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? "Creating..." : "Create Transaction"}
          </button>
        </form>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              // Full corrected table row:
              <tr key={tx.id}>
                <td>{new Date(tx.transaction_date).toLocaleDateString()}</td>
                <td>₹{Number(tx.amount).toFixed(2)}</td>
                <td>{tx.category}</td>
                <td className={tx.transaction_type}>
                  {tx.transaction_type.charAt(0).toUpperCase() +
                    tx.transaction_type.slice(1)}
                </td>
                <td>{tx.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
