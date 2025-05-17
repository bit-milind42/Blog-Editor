import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = "http://localhost:5000/api";

// Returns authentication headers for API requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [authMessage, setAuthMessage] = useState("");

  // Fetch all blogs (published and drafts) on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetches blogs from the API and updates state
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/all`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error(`Failed to fetch blogs: ${response.status}`);
      const blogsData = await response.json();
      setBlogs(blogsData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Deletes a blog by ID and updates local state
  const deleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setDeletingId(id); 
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAuthMessage("You must be logged in to delete blogs");
          setTimeout(() => setAuthMessage(""), 3000);
          return;
        }
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unknown error occurred" }));
          throw new Error(errorData.message || `Failed with status: ${response.status}`);
        }
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        alert('Failed to delete blog: ' + err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Separate blogs by status
  const publishedBlogs = blogs.filter(blog => blog.status === "published");
  const draftBlogs = blogs.filter(blog => blog.status === "draft");

  // Renders a list of blog cards
  const renderList = (blogs) =>
    blogs.map(blog => (
      <div
        key={blog._id}
        className="bg-white shadow-md rounded-lg p-6 mb-5 hover:shadow-xl transition-shadow"
      >
        <Link to={`/blog/${blog._id}`}>
          <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            {blog.title}
          </h2>
        </Link>
        <p className="text-sm text-gray-500 mt-1 italic">
          Tags: {blog.tags?.join(', ') || 'No tags'}
        </p>
        {blog.content && (
          <p className="mt-3 text-gray-700 line-clamp-3">
            {blog.content}
          </p>
        )}
        <div className="mt-4 flex space-x-6">
          <Link
            to={`/blog/${blog._id}`}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Read More
          </Link>
          <Link
            to={`/edit/${blog._id}`}
            className="text-green-600 hover:underline text-sm font-medium"
          >
            Edit
          </Link>
          <button
            onClick={() => deleteBlog(blog._id)}
            disabled={deletingId === blog._id}
            className={`text-red-600 hover:underline text-sm font-medium ${
              deletingId === blog._id ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            {deletingId === blog._id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    ));

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading blogs...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {authMessage && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p>{authMessage}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">📝 All Blogs</h1>
          <Link
            to="/create"
            className="bg-green-600 text-white px-5 py-3 rounded-lg shadow hover:bg-green-700 transition"
          >
            + New Blog
          </Link>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Published</h2>
          {publishedBlogs.length > 0 ? renderList(publishedBlogs) : <p className="text-gray-600">No published blogs yet.</p>}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Drafts</h2>
          {draftBlogs.length > 0 ? renderList(draftBlogs) : <p className="text-gray-600">No drafts yet.</p>}
        </section>
      </div>
    </div>
  );
}
