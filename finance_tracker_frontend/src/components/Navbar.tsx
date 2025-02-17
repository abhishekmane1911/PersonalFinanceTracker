import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Left Side - Links */}
      <div className="flex space-x-6">
        <Link to="/dashboard" className="hover:text-gray-300 transition">
          Dashboard
        </Link>
        <Link to="/transactions" className="hover:text-gray-300 transition">
          Transactions
        </Link>
        <Link to="/budgets" className="hover:text-gray-300 transition">
          Budgets
        </Link>
        <Link to="/currency-converter" className="hover:text-gray-300 transition">
          Currency Converter
        </Link>
        <Link to="/export-report" className="hover:text-gray-300 transition">
          Export Report
        </Link>
      </div>

      {/* Right Side - Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;