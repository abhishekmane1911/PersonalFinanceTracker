import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import CurrencyConverter from "./pages/CurrencyConverter";
import ExportReport from "./pages/ExportReport";
import "./App.css";

const App = () => {
    // Initialize authentication state based on token presence
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));

    return (
        <Router>
            <Navbar />
            <Routes>
                {/* If authenticated, navigate to dashboard; else render Login and pass the setter */}
                <Route 
                    path="/" 
                    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
                />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<Signup />} />
                {isAuthenticated && (
                    <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/budgets" element={<Budgets />} />
                        <Route path="/currency-converter" element={<CurrencyConverter />} />
                        <Route path="/export-report" element={<ExportReport />} />
                    </>
                )}
                {/* Fallback to home if path does not match */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;