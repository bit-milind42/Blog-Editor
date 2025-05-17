import mongoose from 'mongoose';

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true }, // Unique username for each user
    password: { type: String, required: true }, // Hashed password
  },
  { timestamps: true } 
);


export default mongoose.model('User', userSchema);
