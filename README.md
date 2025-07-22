# 🎬 YouTube Shorts Chat Application

A real-time chat application inspired by YouTube Shorts. Users can sign up, post short video content, and engage in live conversations. Built using the powerful MERN stack (MongoDB, Express, React, Node.js) and WebSocket for real-time messaging.

---

## 🚀 Features

- 🔐 User Authentication (JWT-based)
- 🎥 Upload and watch short videos
- 💬 Real-time chat (Socket.IO)
- 🖼️ Profile customization with avatars
- 🧾 MongoDB for persistent storage
- 🔧 Backend API with Express
- ⚛️ Responsive UI using React.js

---

## 🛠️ Tech Stack

- **Frontend**: React, Axios, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO, redis
- **Database**: MongoDB with Mongoose
- **Storage**: Cloudinary (for video & images)
- **Authentication**: JWT, bcrypt
- **Dev Tools**: Nodemon, Postman, Vercel (optional for frontend), Render (optional for backend)

---

## 📁 Project Structure

root/
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── context/
│ └── App.js
├── server/ # Node.js backend
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── config/
│ └── index.js
├── .env
├── README.md

yaml
Copy
Edit

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/suman021999/Youtube-shorts
cd youtube-shorts-chat
2. Set Up the Server
bash
Copy
Edit
cd server
npm install
Create a .env file in server/:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Start the server:

bash
Copy
Edit
npm run dev
3. Set Up the Client
bash
Copy
Edit
cd ../client
npm install
npm start
🔧 API Endpoints
Auth
POST /api/auth/register – Register user

POST /api/auth/login – Login user

Shorts
POST /api/shorts/upload – Upload short video

GET /api/shorts – Fetch all videos

Chat
POST /api/chat/message – Send message

GET /api/chat/:id – Get chat history

💬 Socket.IO Events
connect – User connects to socket

joinRoom – Join a video’s chat room

sendMessage – Emit chat message

receiveMessage – Listen for messages

✅ To-Do / Future Enhancements
📱 Mobile responsiveness

🔔 Notifications

🗂️ Chat history search

👥 Follow/like features

🛡️ Rate-limiting & security middleware

📸 Screenshots
(Include screenshots of chat UI, video upload, user profile, etc. if available)



🙌 Acknowledgements
MERN Stack Docs

Socket.IO
Redis
Cloudinary

yaml
Copy
Edit
