import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handles the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!username.trim() || !password.trim()) {
      setMessage("Username and password are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // Send login request to the backend API
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store authentication token and user ID in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/blogs"), 1500);
    } catch (error) {
      console.error("Login error:", error);
      setMessage(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Login</h1>

      {/* Login form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            id="username"
            type="text"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            id="password"
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Display success or error message */}
      {message && (
        <p className={`text-${message.includes("failed") || message.includes("Failed") ? "red" : "green"}-600 text-center`}>
          {message}
        </p>
      )}

      {/* Link to signup page */}
      <p className="text-center">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/signup")}
          className="text-blue-600 hover:underline"
          disabled={loading}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
