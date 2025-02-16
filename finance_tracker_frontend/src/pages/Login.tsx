import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// 🔹 Define Validation Schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 🔹 Define Login Form Type
type LoginFormData = {
  username: string;
  password: string;
};

export default function Login({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 🔹 Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
  }, [setIsAuthenticated]);

  // 🔹 Handle Form Submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Sending login request with data:", data); // Debugging
      const response = await loginUser(data);
      console.log("Login response:", response); // Debugging
  
      if (!response || !response.access) {
        throw new Error("Invalid login response: No token received");
      }
  
      localStorage.setItem("token", response.access);
      setIsAuthenticated(true);
      alert("Login successful!");
      navigate("/transactions");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || "Login failed. Please try again.";
      alert(errorMessage);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("username")}
              placeholder="Username"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}