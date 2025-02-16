import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Transactions from "./components/Transactions";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { setAuthToken, fetchTransactions } from "./api";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token")); // Ensure initial state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const loadTransactions = async () => {
        try {
          const data = await fetchTransactions();
          console.log("Fetched transactions:", data); // Debugging log
          setTransactions(data);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      };

      loadTransactions();
    }
  }, [isAuthenticated]); // Ensures data is fetched when authentication status changes

  return (
    <Router>
      <div>
        <h1>Finance Tracker</h1>
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/transactions"
            element={isAuthenticated ? <Transactions transactions={transactions} /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/transactions" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;