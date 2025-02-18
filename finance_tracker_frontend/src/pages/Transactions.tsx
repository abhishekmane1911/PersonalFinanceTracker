import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, createTransaction, deleteTransaction } from "../api"; // Import createTransaction

interface Transaction {
  id: number;
  transaction_date: string;
  amount: number; // Ensure this is typed as number
  category:
    | "Travel"
    | "Salary"
    | "Profits"
    | "Food"
    | "Shopping"
    | "Enternaiment"
    | "Skills"
    | "Auto"
    | "Medical & Health"
    | "Personal Items"
    | "Bills and Utilities"
    | "Education"
    | "Gifts & Donations"
    | "Others";
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

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete transaction");
    }
  };

  const [newTransaction, setNewTransaction] = useState({
    transaction_date: "",
    amount: 0,
    category: "Food" as
      | "Travel"
      | "Salary"
      | "Profits"
      | "Shopping"
      | "Entertainment"
      | "Skills"
      | "Auto"
      | "Medical & Health"
      | "Personal Items"
      | "Bills and Utilities"
      | "Education"
      | "Gifts & Donations"
      | "Others",
    transaction_type: "expense" as "income" | "expense",
    description: "",
  });
  const categories: Transaction["category"][] = [
    "Travel",
    "Salary",
    "Profits",
    "Food",
    "Shopping",
    "Entertainment",
    "Skills",
    "Auto",
    "Medical & Health",
    "Personal Items",
    "Bills and Utilities",
    "Education",
    "Gifts & Donations",
    "Others",
  ];

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
        category: "Salary",
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Transactions</h1>
      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6 text-black">
        <div className="flex flex-col w-full sm:w-1/2 lg:w-1/4 ">
          <label htmlFor="start" className="text-lg font-semibold">
            Start Date:
          </label>
          <input
            id="start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-lg"
          />
        </div>
        <div className="flex flex-col w-full sm:w-1/2 lg:w-1/4">
          <label htmlFor="end" className="text-lg font-semibold">
            End Date:
          </label>
          <input
            id="end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-lg"
          />
        </div>
        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="w-full sm:w-auto bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {loading ? "Refreshing..." : "Apply Filters"}
        </button>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto text-black bg-white">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b overflow-x-auto text-black">
                  <td className="px-4 py-2">
                    {new Date(tx.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">₹{Number(tx.amount).toFixed(2)}</td>
                  <td className="px-4 py-2">{tx.category}</td>
                  <td
                    className={`px-4 py-2 ${
                      tx.transaction_type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {tx.transaction_type.charAt(0).toUpperCase() +
                      tx.transaction_type.slice(1)}
                  </td>
                  <td className="px-4 py-2">{tx.description}</td>
                  {/* Delete Button */}
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Transaction Form */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Create New Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="transaction_date" className="font-medium">
              Date:
            </label>
            <input
              type="date"
              id="transaction_date"
              name="transaction_date"
              value={newTransaction.transaction_date}
              onChange={handleInputChange}
              required
              className="p-2 border rounded-lg"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="amount" className="font-medium">
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="0.01"
              step="0.01"
              value={newTransaction.amount || ""}
              onChange={handleInputChange}
              required
              className="p-2 border rounded-lg"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="category" className="font-medium">
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={newTransaction.category}
              onChange={handleInputChange}
              className="p-2 border rounded-lg"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="transaction_type" className="font-medium">
              Type:
            </label>
            <select
              id="transaction_type"
              name="transaction_type"
              value={newTransaction.transaction_type}
              onChange={handleInputChange}
              className="p-2 border rounded-lg"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="font-medium">
              Description:
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={newTransaction.description}
              onChange={handleInputChange}
              className="p-2 border rounded-lg"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition"
          >
            {isSubmitting ? "Creating..." : "Create Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transactions;
