import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BlogList from "./pages/BlogList";
import BlogEditor from "./pages/BlogEditor";
import BlogView from "./pages/BlogView";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Pages */}
        <Route path="/blogs" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
        <Route path="/blog/:id" element={<ProtectedRoute><BlogView /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
