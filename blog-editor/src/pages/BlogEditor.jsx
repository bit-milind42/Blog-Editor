import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

/**
 * BlogEditor component for creating and editing blog posts
 * Includes auto-save functionality and draft/publish capabilities
 */
export default function BlogEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [message, setMessage] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /**
   * Load existing blog data when editing
   */
  useEffect(() => {
    if (id) {
      fetchBlogData(id);
    }
  }, [id]);

  /**
   * Auto-save functionality after 5 seconds of inactivity
   */
  useEffect(() => {
    if (!title && !content) return;

    if (timeoutId) clearTimeout(timeoutId);

    const newTimeout = setTimeout(() => {
      autoSaveDraft();
    }, 5000);

    setTimeoutId(newTimeout);
    return () => clearTimeout(newTimeout);
  }, [title, content, tags]);

  /**
   * Fetch blog data for editing
   */
  const fetchBlogData = async (blogId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`);
      const data = await response.json();
      setTitle(data.title);
      setContent(data.content);
      setTags(data.tags.join(','));
      setStatus(data.status);
    } catch (error) {
      console.error("Failed to load blog:", error);
      setMessage("Failed to load blog data");
    }
  };

  /**
   * Auto-save current content as draft
   */
  const autoSaveDraft = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/save-draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tags, status: "draft" }),
      });

      setMessage(response.ok ? "Auto-saved" : "Auto-save failed");
    } catch (error) {
      console.error("Auto-save failed:", error);
      setMessage("Auto-save failed");
    }
  };

  /**
   * Publish the blog post
   */
  const handlePublish = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tags, status: "published" }),
      });

      if (response.ok) {
        setMessage("Published successfully");
        resetForm();
        navigate("/");
      } else {
        setMessage("Failed to publish");
      }
    } catch (error) {
      console.error("Publish failed:", error);
      setMessage("Failed to publish");
    }
  };

  /**
   * Reset form fields after successful publish
   */
  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-4">
      <h1 className="text-3xl font-bold text-center">
        📝 {id ? "Edit Blog" : "Create Blog"}
      </h1>

      <input
        className="w-full p-2 border rounded"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-2 border rounded h-48"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded"
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={autoSaveDraft}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Save Draft
        </button>

        <button
          onClick={handlePublish}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Publish
        </button>
      </div>

      {message && (
        <p className={`text-${message.includes("failed") ? "red" : "green"}-600`}>
          {message}
        </p>
      )}
    </div>
  );
}
