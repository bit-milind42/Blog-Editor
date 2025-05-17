import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * Protects routes by checking authentication status.
 * Redirects unauthenticated users to the login page.
 */
export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Retrieve authentication token from localStorage
    const token = localStorage.getItem("token");

    // Validate token presence and format
    if (!token || typeof token !== 'string' || token.trim() === '') {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      return;
    }

    // Token exists and is valid; user is authenticated
    setIsAuthenticated(true);
  }, []);

  // Display loading indicator while authentication status is being determined
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected content for authenticated users
  return children;
}
