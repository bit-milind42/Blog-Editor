import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function BlogView() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog data when the component mounts or the id changes
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    fetch(`http://localhost:5000/api/blogs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch blog: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setBlog(data);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center p-4">Loading blog...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  if (!blog) return <div className="text-center p-4">Blog not found</div>;

  // Format the creation date for display
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:underline">
          &larr; Back to Blogs
        </Link>
      </div>

      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
          <div className="text-gray-600 mb-2">
            Published: {formattedDate}
          </div>
          {/* Render tags if available */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag, index) => (
                <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose max-w-none">
          {/* Render each paragraph of content, preserving line breaks */}
          {blog.content.split('\n').map((paragraph, index) => (
            paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
          ))}
        </div>
      </article>

      <div className="mt-8 flex gap-4">
        <Link 
          to={`/edit/${blog._id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Blog
        </Link>
      </div>
    </div>
  );
}