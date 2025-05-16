import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String] },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
