import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBudgets, createBudget } from "../api"; // Assuming createBudget is a function in your API module

interface Budget {
  month: string;
  limit: number;
  spent_amount: number;
  remaining_amount: number;
}

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [newBudget, setNewBudget] = useState<{ month: string; limit: number }>({
    month: "",
    limit: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const getBudgets = async () => {
      setLoading(true);
      try {
        const data = await fetchBudgets();
        setBudgets(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch budgets");
      } finally {
        setLoading(false);
      }
    };

    getBudgets();
  }, [navigate]); // ✅ Dependency array should include navigate

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBudget((prev) => ({
      ...prev,
      [name]: name === "limit" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createBudget(newBudget); // Assuming createBudget is a function that sends a POST request
      setBudgets((prev) => [
        ...prev,
        { ...newBudget, spent_amount: 0, remaining_amount: newBudget.limit },
      ]);
      setNewBudget({ month: "", limit: 0 }); // Reset form
    } catch (err: any) {
      setError(err.message || "Failed to create budget");
    }
  };

  return (
    <div className="p-6 h-screen max-w-4xl mx-auto bg-white rounded-lg ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Budgets</h2>

      {loading && (
        <p className="text-center text-gray-500">Loading budgets...</p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && budgets.length === 0 && (
        <p className="text-center text-gray-500">No budgets found.</p>
      )}

      {!loading && !error && budgets.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Month</th>
                <th className="py-2 px-4 border-b">Budget Limit</th>
                <th className="py-2 px-4 border-b">Spent Amount</th>
                <th className="py-2 px-4 border-b">Remaining Amount</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.month} className="border-b">
                  <td className="py-2 px-4">{budget.month}</td>
                  <td className="py-2 px-4">{budget.limit}</td>
                  <td className="py-2 px-4">{budget.spent_amount}</td>
                  <td className="py-2 px-4">{budget.remaining_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-800 mt-8">
        Create New Budget
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-gray-700">Month:</label>
          <select
            name="month"
            value={newBudget.month}
            onChange={handleInputChange}
            required
            className="mt-2 text-gray-700 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select a month</option>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Budget Limit:</label>
          <input
            type="number"
            name="limit"
            value={newBudget.limit}
            onChange={handleInputChange}
            required
            className="mt-2 text-gray-700 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Budget
        </button>
      </form>
    </div>
  );
};

export default Budgets;