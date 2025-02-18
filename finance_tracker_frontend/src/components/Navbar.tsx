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
} from "react-icons/fi";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    <nav className="bg-indigo-600 text-white shadow-md sticky top-0 w-full z-10">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        {/* Logo or title can go here */}
        <div className="text-xl font-semibold">MyApp</div>

        {/* Navbar links */}
        <div className="hidden md:flex space-x-6 text-white">
          <Link
            to="/dashboard"
            className={`flex text-black items-center space-x-2 p-2 rounded-md ${
              isActive("/dashboard") ? "bg-indigo-900 text-white " : "hover:bg-black hover:text-white"
            }`}
          >
            <FiHome className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/transactions"
            className={`flex items-center space-x-2 p-2 rounded-md ${
              isActive("/transactions")
                ? "bg-indigo-900 text-white"
                : "hover:bg-black hover:text-white"
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
              isActive("/currency-converter")
                ? "bg-indigo-900 text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            <FiRepeat className="w-5 h-5" />
            <span>Currency</span>
          </Link>
          <Link
            to="/export-report"
            className={`flex items-center space-x-2 p-2 rounded-md ${
              isActive("/export-report")
                ? "bg-indigo-900 text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            <FiFileText className="w-5 h-5" />
            <span>Reports</span>
          </Link>
        </div>


        {/* Conditional rendering for login/signup or logout */}
        <div className="hidden md:flex space-x-6">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="hidden text-white md:flex items-center space-x-2 p-2 rounded-md bg-black hover:bg-white hover:text-black"
              >
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className="hidden text-white md:flex items-center space-x-2 p-2 rounded-md bg-black hover:bg-white hover:text-black"
              >
                <span>Sign Up</span>
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button className="text-white">
            {/* Mobile hamburger icon goes here */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
