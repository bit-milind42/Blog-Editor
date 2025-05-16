import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute component that wraps protected pages
 * Redirects to login page if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} Protected route component
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
