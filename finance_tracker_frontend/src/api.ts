import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // Backend API
const API_URL_AUTH = "http://127.0.0.1:8000/accounts"; // Authentication API

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Function to check if JWT token is expired
const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now(); // Check expiry
  } catch (error) {
    return false;
  }
};

// 🔹 Function to set auth token in headers
export const setAuthToken = (token: string | null = null) => {
  if (!token) {
    token = localStorage.getItem("access_token");
  }

  if (token && isTokenValid(token)) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return true;
  } else {
    delete api.defaults.headers.common["Authorization"];
    return false;
  }
};

// 🔹 Refresh Access Token
export const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) {
    logoutUser();
    return;
  }

  try {
    const response = await axios.post(`${API_URL_AUTH}/token/refresh/`, {
      refresh: refresh_token,
    });

    const newAccessToken = response.data.access;
    console.log("New access token:", newAccessToken); // Debugging log
    console.log("Old access token:", localStorage.getItem("access_token")); // Debugging log
    localStorage.setItem("access_token", newAccessToken);
    setAuthToken(newAccessToken);
  } catch (error) {
    logoutUser();
  }
};

// 🔹 Register User
export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL_AUTH}/register/`, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// 🔹 Login User
export const loginUser = async (credentials: { username: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL_AUTH}/login/`, credentials);
    const { access_token, refresh_token } = response.data;

    if (!access_token || !refresh_token) {
      throw new Error("Invalid login response: No tokens received");
    }

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    setAuthToken(access_token);

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Login failed";
  }
};

// 🔹 Logout User
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  delete api.defaults.headers.common["Authorization"];
};

// 🔹 Fetch Transactions (with Auto Refresh)
export const fetchTransactions = async () => {
  try {
    setAuthToken();
    const response = await api.get("/transactions/");
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return fetchTransactions(); // Retry after refreshing token
    }
    throw new Error(error.response?.data?.message || "Failed to fetch transactions");
  }
};

// 🔹 Fetch Budgets (with Auto Refresh)
export const fetchBudgets = async () => {
  try {
    setAuthToken();
    const response = await api.get("/budgets/");
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return fetchBudgets(); // Retry after refreshing token
    }
    throw new Error(error.response?.data?.message || "Failed to fetch budgets");
  }
};