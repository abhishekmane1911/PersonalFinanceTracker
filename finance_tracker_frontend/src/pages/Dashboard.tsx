import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
    } else {
      setUser("Abhishek"); // Placeholder for now
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">Welcome, {user} 🎉</h2>
      <button className="ml-4 p-2 bg-red-500 text-white rounded" onClick={() => { localStorage.removeItem("access_token"); navigate("/"); }}>
        Logout
      </button>
    </div>
  );
}