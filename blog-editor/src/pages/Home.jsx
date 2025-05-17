import { Link } from "react-router-dom";

/**
 * Home page component for Blog Editor.
 * Displays hero section, feature highlights, and footer.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-gray-800 space-y-12 py-16">
        
        {/* Hero section with app title, description, and navigation buttons */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Welcome to <span className="text-blue-600">Blog Editor</span> 📝
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Effortlessly create, edit, auto-save, and publish your blogs with a distraction-free writing experience. Built for creators who value speed, simplicity, and control.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-medium shadow"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg text-lg font-medium shadow"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Features section highlighting key functionalities */}
        <div className="grid md:grid-cols-3 gap-8 text-center mt-12">
          <div className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700">Auto-Save</h3>
            <p className="text-gray-600 mt-2">
              Your drafts are automatically saved every few seconds so you never lose your work.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700">Draft & Publish</h3>
            <p className="text-gray-600 mt-2">
              Save drafts to review later, or publish your posts instantly with a single click.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700">Simple & Powerful</h3>
            <p className="text-gray-600 mt-2">
              A minimal editor that gets out of your way, yet powerful enough for serious blogging.
            </p>
          </div>
        </div>

        {/* Footer with copyright */}
        <footer className="pt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Blog Editor. Built with ❤️ by Milind.
        </footer>
      </div>
    </div>
  );
}
