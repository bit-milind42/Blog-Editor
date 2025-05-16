import { Link, useNavigate } from "react-router-dom";

/**
 * Navbar component that displays the main navigation bar
 * Handles authentication state and navigation
 */
export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold italic">📝 Blog Editor</Link>

      <div className="flex gap-4">
        {isLoggedIn ? (
          <>
            <Link to="/create" className="hover:underline">New Blog</Link>
            <button onClick={handleLogout} className="text-red-400 hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
