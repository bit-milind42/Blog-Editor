import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  // State for form fields and messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Redirect to blogs if already authenticated
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/blogs");
    }
  }, [navigate]);

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      // Redirect to login on successful signup
      navigate("/login");
    } else {
      // Show error message
      setMessage(data.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">🔐 Sign Up</h1>
        <form onSubmit={handleSignup} className="space-y-5">
          {/* Username input */}
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
          {/* Display error or status message */}
          {message && <p className="text-red-600 text-center">{message}</p>}
          {/* Link to login page */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
