import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from './routes/blogRoutes.js';
import authRoutes from './routes/authRoutes.js';




dotenv.config();
const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
}));

// Important: Place body parser middleware before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set common headers for API responses
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);


// Error handling middleware - must be after routes
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  if (req.path.startsWith('/api')) {
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
  } else {
    res.status(500).send('Server Error');
  }
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));