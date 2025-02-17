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
  const [newBudget, setNewBudget] = useState<{ month: string; limit: number }>({ month: "", limit: 0 });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setBudgets((prev) => [...prev, { ...newBudget, spent_amount: 0, remaining_amount: newBudget.limit }]);
      setNewBudget({ month: "", limit: 0 }); // Reset form
    } catch (err: any) {
      setError(err.message || "Failed to create budget");
    }
  };

  return (
    <div>
      <h2>Budgets</h2>

      {loading && <p>Loading budgets…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && budgets.length === 0 && <p>No budgets found.</p>}

      {!loading && !error && budgets.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Budget Limit</th>
              <th>Spent Amount</th>
              <th>Remaining Amount</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <tr key={budget.month}>
                <td>{budget.month}</td>
                <td>{budget.limit}</td>
                <td>{budget.spent_amount}</td>
                <td>{budget.remaining_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Create New Budget</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Month:
            <input
              type="text"
              name="month"
              value={newBudget.month}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Budget Limit:
            <input
              type="number"
              name="limit"
              value={newBudget.limit}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <button type="submit">Create Budget</button>
      </form>
    </div>
  );
};

export default Budgets;