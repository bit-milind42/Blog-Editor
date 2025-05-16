import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BlogList() {
  const [drafts, setDrafts] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    setLoading(true);
    setError(null);
    
    fetch('http://localhost:5000/api/blogs')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch blogs: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const drafts = data.filter(blog => blog.status === "draft");
        const published = data.filter(blog => blog.status === "published");
        setDrafts(drafts);
        setPublished(published);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const deleteBlog = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setDeletingId(id); 
      
      fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => {
              try {
                const json = JSON.parse(text);
                throw new Error(json.message || `Failed with status: ${res.status}`);
              } catch {
                throw new Error(`Failed with status: ${res.status}`);
              }
            });
          }
          return res.text().then(text => text ? JSON.parse(text) : { success: true });
        })
        .then(() => {
          fetchBlogs(); // Refresh after delete
        })
        .catch(err => {
          alert('Failed to delete blog: ' + err.message);
        })
        .finally(() => {
          setDeletingId(null);
        });
    }
  };

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
          {published.length > 0 ? renderList(published) : <p className="text-gray-600">No published blogs yet.</p>}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Drafts</h2>
          {drafts.length > 0 ? renderList(drafts) : <p className="text-gray-600">No drafts yet.</p>}
        </section>
      </div>
    </div>
  );
}
