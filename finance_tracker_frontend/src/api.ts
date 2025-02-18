import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";
const API_URL_AUTH = "http://127.0.0.1:8000/accounts";

// Axios instance for API calls
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔹 Validate JWT token
const isTokenValid = (token: string): boolean => {
  if (!token || token.split(".").length !== 3) {
    return false;
  }
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

// 🔹 Set auth token in API headers
export const setAuthToken = (token: string | null = null): boolean => {
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
export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL_AUTH}/login/`, credentials);
    const { access_token, refresh_token } = response.data;
    if (!access_token || !refresh_token) {
      throw new Error("Invalid login response: No tokens received");
    }
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    setAuthToken(access_token);
    return { access_token, refresh_token };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail ||
        error.response?.data?.message ||
        "Login failed"
    );
  }
};

// 🔹 Logout User
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  delete api.defaults.headers.common["Authorization"];
};

// 🔹 Fetch Transactions (with type conversion)
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    if (!setAuthToken()) {
      await refreshAccessToken();
    }
    const response = await api.get("/transactions/");
    return response.data.map((tx: any) => ({
      ...tx,
      amount: parseFloat(tx.amount), // Convert to number
      transaction_date: new Date(tx.transaction_date).toISOString(),
    }));
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return fetchTransactions();
    }
    throw new Error(
      error.response?.data?.message || "Failed to fetch transactions"
    );
  }
};

// 🔹 Fetch Budgets
export const fetchBudgets = async () => {
  try {
    if (!setAuthToken()) {
      await refreshAccessToken();
    }
    const response = await api.get("/budgets/");
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return fetchBudgets();
    }
    throw new Error(error.response?.data?.message || "Failed to fetch budgets");
  }
};

// 🔹 Fetch Monthly Summary (Dashboard)
export const fetchMonthlySummary = async (month: string) => {
  try {
    if (!setAuthToken()) {
      await refreshAccessToken();
    }
    const response = await api.get("/monthly-summary/", { params: { month } });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch monthly summary"
    );
  }
};

// 🔹 Fetch Spending Analysis
export const fetchSpendingAnalysis = async (params: {
  start_date?: string;
  end_date?: string;
  category?: string;
}) => {
  try {
    if (!setAuthToken()) {
      await refreshAccessToken();
    }
    const response = await api.get("/spending-analysis/", { params });
    console.log(response)
    return response.data; // Ensure this returns { monthly_trend, category_breakdown, recent_transactions }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch spending analysis");
  }
};

// 🔹 Convert Currency using external API
export const convertCurrency = async (
  amount: number,
  from_currency: string,
  to_currency: string
) => {
  try {
    if (!setAuthToken()) {
      await refreshAccessToken();
    }
    const response = await api.get("/currency-conversion/", {
      params: { amount, from_currency, to_currency },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Currency conversion failed"
    );
  }
};

// 🔹 Export Transactions as CSV
export const exportTransactions = async (): Promise<Blob> => {
  try {
    // Handle token refresh
    if (!localStorage.getItem("access_token")) {
      await refreshAccessToken();
    }

    const response = await api.get("/export-transactions/", {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    // Verify CSV content
    const text = await new Response(response.data).text();
    if (text.includes("No transactions found") || text.includes("Error")) {
      throw new Error(text.split("\n")[0]);
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return exportTransactions();
    }

    // Handle CSV error messages
    if (error.message.includes("No transactions")) {
      throw new Error("No transactions to export");
    }

    throw new Error(error.message || "Export failed. Please try again.");
  }
};

// 🔹 Create Budget (with retry on 401)
export const createBudget = async (budgetData: {
  month: string;
  limit: number;
}) => {
  try {
    if (!setAuthToken()) {
      await refreshAccessToken();
    }
    const response = await api.post("/budgets/", budgetData);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return createBudget(budgetData); // Retry the request after refresh
    }
    throw new Error(error.response?.data?.message || "Failed to create budget");
  }
};

// 🔹 Create Transaction (with retry on 401)
export const createTransaction = async (transactionData: {
  transaction_date: string;
  amount: number;
  category: string;
  transaction_type: "income" | "expense";
  description?: string;
}) => {
  try {
    if (!setAuthToken()) {
      await refreshAccessToken();
    }
    const response = await api.post("/transactions/", transactionData);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return createTransaction(transactionData); // Retry after refresh
    }
    throw new Error(
      error.response?.data?.message || "Failed to create transaction"
    );
  }
};

// 🔹 Delete Transaction
export const deleteTransaction = async (id: number) => {
  try {
    if (!setAuthToken()) {
      await refreshAccessToken();
    }
    await api.delete(`/transactions/${id}/`);
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return deleteTransaction(id);
    }
    throw new Error(error.response?.data?.message || "Failed to delete transaction");
  }
};