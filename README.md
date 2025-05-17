# 📝 Blog Editor Application

A modern, full-stack blog editor built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**.  
It allows users to write, edit, auto-save drafts, and publish blog posts — all within a clean, responsive UI and protected authentication system using **JWT**.

---

## ✨ Features

- 🖊️ Create, edit, and auto-save blog drafts 
- 🔐 Secure authentication (signup/login/logout) using JWT
- ✉️ Auto-detect & group **draft** and **published** blogs
- 🔁 Edit & delete blog posts with confirmation
- 🔒 Protected routes and token-based access control
- 💡 Responsive, minimalist UI using Tailwind CSS

---

## 🎥 Demo Video

📺 [Watch the Project Demo on YouTube](https://www.youtube.com/watch?v=Hz4FJSDe1iw)

This short video walks through the key features of the Blog Editor app, including login, auto-saving drafts, publishing blogs, and protecting routes with JWT.

---

## 📸 Screenshots

| Login Form | Blog Dashboard | Blog Editor |
|------------|----------------|-------------|
| ![Login](https://raw.githubusercontent.com/bit-milind42/Blog-Editor/refs/heads/main/Login.png) | ![Homepage](https://raw.githubusercontent.com/bit-milind42/Blog-Editor/refs/heads/main/Home.png) | ![Editor](https://raw.githubusercontent.com/bit-milind42/Blog-Editor/refs/heads/main/Blogs.png) |


---

## 🧱 Tech Stack

| Frontend            | Backend             | Database     | Authentication |
|---------------------|---------------------|--------------|----------------|
| React (Vite)        | Node.js (Express)   | MongoDB      | JWT, bcrypt.js |
| Tailwind CSS        | Mongoose            |              |                |

---

## 🚀 Getting Started (Local Setup)

### ✅ Prerequisites

- Node.js and npm installed  
- MongoDB running locally or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

### ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/bit-milind42/Blog-Editor.git
cd Blog-Editor

🔧 Backend Setup

cd backend
npm install

# Create a .env file in backend/ with:
# MONGO_URI=your_mongodb_uri
# PORT=5000
# JWT_SECRET=your_secret_key

npm start

💻 Frontend Setup
cd blog-editor
npm install
npm run dev

```

### 🧑‍💻 Author
Made with ❤️ by Milind

### 📄 License
This project is licensed under the MIT License.
Feel free to use, fork, or enhance it as needed.
