//index.js
import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import userRouter from "./routes/user.route.js";
import vedioRouter from "./routes/vedio.route.js";
import database from './db/database.js';
import cookieParser from 'cookie-parser';
import { configurePassport } from './config/passport.config.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { chatRouter } from './routes/chat.route.js';
import ChatController from './controller/chat.controller.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Database connection
database();
configurePassport();

// CORS Configuration
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
// app.use(express.json());
// app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());


app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/vedio", vedioRouter);


const port = process.env.PORT || 5000;
const httpServer = createServer(app);
// httpServer.setTimeout(0)

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// // Initialize Chat Controller (will handle its own Redis connections)
// const chatController = new ChatController(io);
// chatRouter.setController(chatController);
// app.use('/api/v1/chat', chatRouter.router);

// Initialize Chat Controller
const chatController = new ChatController(io);
chatRouter.setController(chatController); // Now this will work
app.use('/api/v1/chat', chatRouter.router);

// Server Startup
const startServer = async () => {
  httpServer.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🔌 Socket.io ready for connections`);
  });
};

startServer();

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    socketIo: 'active',
    timestamp: new Date().toISOString()
  });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
