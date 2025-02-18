import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../api";
import {
  FiHome,
  FiDollarSign,
  FiPieChart,
  FiRepeat,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check authentication status on mount and route change
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-black text-white shadow-md sticky mr-5 ml-5 top-4 z-10 rounded-2xl backdrop-blur-lg">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-xl font-semibold">MyApp</div>

        {/* Desktop Navbar Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/dashboard"
            className={`flex items-center space-x-2 p-2 rounded-md ${
              isActive("/dashboard") ? "bg-indigo-900 text-white" : "hover:bg-black hover:text-white"
            }`}
          >
            <FiHome className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/transactions"
            className={`flex items-center space-x-2 p-2 rounded-md ${
              isActive("/transactions") ? "bg-indigo-900 text-white" : "hover:bg-black hover:text-white"
            }`}
          >
            <FiDollarSign className="w-5 h-5" />
            <span>Transactions</span>
          </Link>
          <Link
            to="/budgets"
            className={`flex items-center space-x-2 p-2 rounded-md ${
              isActive("/budgets") ? "bg-indigo-900 text-white" : "hover:bg-black hover:text-white"
            }`}
          >
            <FiPieChart className="w-5 h-5" />
            <span>Budgets</span>
          </Link>
          <Link
            to="/currency-converter"
            className={`flex items-center space-x-2 p-2 rounded-md ${
              isActive("/currency-converter") ? "bg-indigo-900 text-white" : "hover:bg-black hover:text-white"
            }`}
          >
            <FiRepeat className="w-5 h-5" />
            <span>Currency</span>
          </Link>
          <Link
            to="/export-report"
            className={`flex items-center space-x-2 p-2 rounded-md ${
              isActive("/export-report") ? "bg-indigo-900 text-white" : "hover:bg-black hover:text-white"
            }`}
          >
            <FiFileText className="w-5 h-5" />
            <span>Reports</span>
          </Link>
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden md:flex space-x-6">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-white p-2 rounded-md bg-black hover:bg-white hover:text-black"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white p-2 rounded-md bg-black hover:bg-white hover:text-black"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 rounded-md bg-red-600 hover:bg-red-700"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden bg-gray-900 p-4`}>
        <Link
          to="/dashboard"
          className="block text-white py-2 hover:bg-gray-700 px-4 rounded"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          to="/transactions"
          className="block text-white py-2 hover:bg-gray-700 px-4 rounded"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Transactions
        </Link>
        <Link
          to="/budgets"
          className="block text-white py-2 hover:bg-gray-700 px-4 rounded"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Budgets
        </Link>
        <Link
          to="/currency-converter"
          className="block text-white py-2 hover:bg-gray-700 px-4 rounded"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Currency Converter
        </Link>
        <Link
          to="/export-report"
          className="block text-white py-2 hover:bg-gray-700 px-4 rounded"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Export Report
        </Link>

        {/* Mobile Logout/Login Buttons */}
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="block text-white py-2 hover:bg-gray-700 px-4 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block text-white py-2 hover:bg-gray-700 px-4 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-white py-2 hover:bg-gray-700 px-4 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;