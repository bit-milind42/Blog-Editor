import express from 'express';
import Blog from '../models/Blog.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Save or update a blog draft
 * @route POST /api/blogs/save-draft
 * @access Private
 */
router.post('/save-draft', verifyToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const existing = await Blog.findOne({ title, status: 'draft' });

    if (existing) {
      existing.content = content;
      existing.tags = tags?.split(',').filter(Boolean);
      await existing.save();
      return res.status(200).json({ message: "Draft updated" });
    }

    const blog = new Blog({
      title,
      content,
      tags: tags?.split(',').filter(Boolean),
      status: 'draft'
    });
    
    await blog.save();
    res.status(201).json({ message: "Draft saved" });
  } catch (error) {
    console.error("Save draft error:", error);
    res.status(500).json({ message: "Failed to save draft", error: error.message });
  }
});

/**
 * Publish a blog post
 * @route POST /api/blogs/publish
 * @access Private
 */
router.post('/publish', verifyToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const blog = await Blog.findOneAndUpdate(
      { title },
      {
        content,
        tags: tags?.split(',').filter(Boolean),
        status: 'published',
        publishedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Blog published", blog });
  } catch (error) {
    console.error("Publish error:", error);
    res.status(500).json({ message: "Failed to publish blog", error: error.message });
  }
});

/**
 * Get all published blogs
 * @route GET /api/blogs
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .select('-__v');
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
  }
});

/**
 * Get a blog by ID
 * @route GET /api/blogs/:id
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    const blog = await Blog.findById(id).select('-__v');
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Get blog error:", error);
    res.status(500).json({ message: "Failed to fetch blog", error: error.message });
  }
});

/**
 * Delete a blog by ID
 * @route DELETE /api/blogs/:id
 * @access Private
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    const blog = await Blog.findByIdAndDelete(id);
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Failed to delete blog", error: error.message });
  }
});

export default router;
