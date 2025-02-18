import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginUser  } from "../api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BackgroundLines } from "../components/ui/BackgroundLines.tsx"; // Import the BackgroundLines component

// 🔹 Define Validation Schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 🔹 Define Login Form Type
type LoginFormData = z.infer<typeof loginSchema>;

export default function Login({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (auth: boolean) => void;
}) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
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
          navigate("/transactions");
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthenticated(false);
      }
    }
  }, [setIsAuthenticated, navigate]);

  // 🔹 Handle Form Submission
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginUser (data);
      setIsAuthenticated(true);
      navigate("/transactions");
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundLines svgOptions={{ duration: 10 }} className="relative">
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative z-10 hover:shadow-indigo-500/50 hover:t-5">
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
            Login
          </h2>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                {...register("username")}
                placeholder="Username"
                className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BackgroundLines>
  );
}