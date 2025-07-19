
import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import userRouter from "./routes/user.route.js"
import database from './db/database.js'
import cookieParser from 'cookie-parser'
import { configurePassport } from './config/passport.config.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express()
dotenv.config();
database()
configurePassport()

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false })); 
app.use("/api/v1/auth", userRouter)

const port = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Example: Handle chat messages
  socket.on('chatMessage', (message) => {
    console.log('Message received:', message);
    io.emit('newMessage', message); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic route to test server
app.get('/', (req, res) => {
  res.send(`
    <h1>Server is running</h1>
    <p>Socket.io is ready for real-time communication</p>
  `);
});

// Start server
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Socket.io is listening for connections`);
});