import mongoose from 'mongoose';

// Define the schema for a blog post
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  content: { type: String, required: true }, 
  tags: { type: [String] },
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'draft' 
  },
}, { 
  timestamps: true 
});

export default mongoose.model('Blog', blogSchema);
