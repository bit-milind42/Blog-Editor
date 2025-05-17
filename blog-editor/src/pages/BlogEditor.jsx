import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

// Helper to get authentication headers for API requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export default function BlogEditor() {
  // State variables for blog fields and UI state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [message, setMessage] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [blogId, setBlogId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch blog data if editing an existing blog
  useEffect(() => {
    if (id) {
      fetchBlogData(id);
      setBlogId(id);
    }
  }, [id]);

  // Auto-save draft when title, content, or tags change
  useEffect(() => {
    if (!title && !content) return;
    if (timeoutId) clearTimeout(timeoutId);

    const newTimeout = setTimeout(() => {
      autoSaveDraft();
    }, 30000); // Auto-save every 30 seconds

    setTimeoutId(newTimeout);
    return () => clearTimeout(newTimeout);
  }, [title, content, tags]);

  // Check if user is authenticated
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to continue");
      setTimeout(() => navigate("/login"), 1500);
      return false;
    }
    return true;
  };

  // Fetch blog data from API for editing
  const fetchBlogData = async (blogId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`);
      if (!response.ok) throw new Error("Failed to load blog");

      const data = await response.json();
      setTitle(data.title || "");
      setContent(data.content || "");
      setTags(Array.isArray(data.tags) ? data.tags.join(",") : data.tags || "");
      setStatus(data.status || "draft");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save draft to API
  const autoSaveDraft = async () => {
    if (!checkAuth()) return;
    if (!title.trim() && !content.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/blogs/save-draft`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: blogId,
          title: title || "Untitled Draft",
          content,
          tags,
          status: "draft",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save draft");
      }

      const data = await response.json();
      if (data.blog && data.blog._id) setBlogId(data.blog._id);
      setMessage("Auto-saved");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Auto-save error:", err);
      setMessage("Auto-save failed: " + err.message);
    }
  };

  // Manually save draft to API
  const handleSaveDraft = async () => {
    if (!checkAuth()) return;
    if (!title.trim()) {
      setMessage("Please provide a title before saving");
      return;
    }

    try {
      setMessage("Saving draft...");
      const response = await fetch(`${API_BASE_URL}/blogs/save-draft`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: blogId,
          title,
          content,
          tags,
          status: "draft",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save draft");
      }

      const data = await response.json();
      setMessage("Draft saved successfully!");
      setTimeout(() => navigate("/blogs"), 1000);
    } catch (err) {
      console.error("Save draft error:", err);
      setMessage("Failed to save draft: " + err.message);
    }
  };

  // Publish blog post to API
  const handlePublish = async () => {
    if (!checkAuth()) return;
    if (!title.trim()) {
      setMessage("Title is required");
      return;
    }

    try {
      setMessage("Publishing...");
      const response = await fetch(`${API_BASE_URL}/blogs/publish`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          id: blogId,
          title,
          content,
          tags,
          status: "published",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to publish");
      }

      setMessage("Blog published successfully!");
      setTimeout(() => navigate("/blogs"), 1000);
    } catch (err) {
      console.error("Publish error:", err);
      setMessage("Failed to publish: " + err.message);
    }
  };

  // Show loading indicator while fetching blog data
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center h-64">
        <p className="text-gray-600">Loading blog content...</p>
      </div>
    );
  }

  // Render blog editor form
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{id ? "Edit Blog" : "Create Blog"}</h1>

      {message && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded">
          {message}
        </div>
      )}

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full h-60 p-2 mb-4 border rounded"
        placeholder="Content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <input
        className="w-full p-2 mb-4 border rounded"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <div className="flex gap-4">
        <button
          onClick={handleSaveDraft}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
        >
          Save Draft
        </button>
        <button
          onClick={handlePublish}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Publish
        </button>
      </div>
    </div>
  );
}