import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import CurrencyConverter from "./pages/CurrencyConverter";
import ExportReport from "./pages/ExportReport";
import { SidebarDemo } from "./pages/Sidebar";
import MagnetLines from "./components/ui/MagnetLines";
import "./App.css";

const App = () => {
  // Initialize authentication state based on token presence
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  return (
    <Router>
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        {/* Background MagnetLines */}
        <MagnetLines
          rows={9}
          columns={9}
          containerSize="60vmin"
          lineColor="black"
          lineWidth="0.8vmin"
          lineHeight="5vmin"
          baseAngle={0}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0, // Ensure it's behind other content
          }}
        />

        {/* Main Content */}
        <Navbar />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Routes>
            {/* If authenticated, navigate to dashboard; else render Login and pass the setter */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
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
        </div>
      </div>
    </Router>
  );
};

export default App;