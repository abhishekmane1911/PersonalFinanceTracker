import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type SignupFormData = {
  username: string;
  email: string;
  password: string;
};

export default function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await registerUser(data);
      alert("Signup successful! You can now log in.");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || error.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("username")}
            placeholder="Username"
            className={`w-full p-2 border rounded ${errors.username ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}

          <input
            {...register("email")}
            placeholder="Email"
            className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className={`w-full p-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Sign Up</button>
        </form>
      </div>
    </div>
  );
}