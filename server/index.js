
// import express from 'express'
// import dotenv from "dotenv"
// import cors from 'cors'
// import userRouter from "./routes/user.route.js"
// import database from './db/database.js'
// import cookieParser from 'cookie-parser'
// import { configurePassport } from './config/passport.config.js';
// // import { createAdapter } from '@socket.io/redis-adapter';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

// const app = express()
// dotenv.config();
// database()
// configurePassport()

// const corsOptions = {
//   origin: [
//     process.env.FRONTEND_URL || "http://localhost:3000",
//   ],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   optionsSuccessStatus: 200,
// };

// // Middleware
// app.use(cors(corsOptions));
// app.use(express.json())
// app.use(cookieParser())
// app.use(express.urlencoded({ extended: false })); 
// app.use("/api/v1/auth", userRouter)

// const port = process.env.PORT || 5000;

// // Create HTTP server
// const httpServer = createServer(app);

// // Initialize Socket.io
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// // Socket.io connection handler
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Example: Handle chat messages
//   socket.on('chatMessage', (message) => {
//     console.log('Message received:', message);
//     io.emit('newMessage', message); // Broadcast to all clients
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Basic route to test server
// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Server is running</h1>
//     <p>Socket.io is ready for real-time communication</p>
//   `);
// });

// // Start server
// httpServer.listen(port, () => {
//   console.log(`Server running on port ${port}`);
//   console.log(`Socket.io is listening for connections`);
// });


// import express from 'express';
// import dotenv from "dotenv";
// import cors from 'cors';
// import userRouter from "./routes/user.route.js";
// import chatRouter from "./routes/chat.route.js";
// import database from './db/database.js';
// import cookieParser from 'cookie-parser';
// import { configurePassport } from './config/passport.config.js';
// import { createClient } from 'redis';
// import { createAdapter } from '@socket.io/redis-adapter';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import ChatController from './controller/chat.controller.js';

// const app = express();
// dotenv.config();
// database();
// configurePassport();

// const corsOptions = {
//   origin: [
//     process.env.FRONTEND_URL || "http://localhost:3000",
//   ],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   optionsSuccessStatus: 200,
// };

// // Middleware
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: false })); 
// app.use("/api/v1/auth", userRouter);
// const port = process.env.PORT || 5000;

// // Create HTTP server
// const httpServer = createServer(app);

// // Initialize Redis clients with error handlers
// const pubClient = createClient({
//   url: process.env.REDIS_URL || 'redis://localhost:6379'
// });

// const subClient = pubClient.duplicate();

// // Add error handlers for Redis clients
// pubClient.on('error', (err) => {
//   console.error('Redis PubClient Error:', err);
// });

// subClient.on('error', (err) => {
//   console.error('Redis SubClient Error:', err);
// });

// // Initialize Socket.io with Redis adapter
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   adapter: createAdapter(pubClient, subClient)
// });

// // Add error handler for Socket.io
// io.on('error', (err) => {
//   console.error('Socket.io Error:', err);
// });



// // Connect to Redis with error handling
// const initializeRedis = async () => {
//   try {
//     await Promise.all([pubClient.connect(), subClient.connect()]);
//     console.log('Redis connected successfully');
    
//     // Start server
//     httpServer.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//       console.log(`Socket.io is listening for connections`);
//     });
//   } catch (err) {
//     console.error('Redis connection failed:', err);
//     process.exit(1);
//   }
// };

// initializeRedis();

// // Basic route to test server
// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Server is running</h1>
//     <p>Socket.io is ready for real-time communication</p>
//     <p>Redis Status: ${pubClient.isOpen ? 'Connected' : 'Disconnected'}</p>
//   `);
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Internal Server Error' });
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.error('Unhandled Rejection:', err);
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.error('Uncaught Exception:', err);
//   process.exit(1);
// });





import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import database from './db/database.js';
import cookieParser from 'cookie-parser';
import { configurePassport } from './config/passport.config.js';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ChatController from './controller/chat.controller.js';

const app = express();
dotenv.config();
database();
configurePassport();

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
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); 
app.use("/api/v1/auth", userRouter);

const port = process.env.PORT || 5000;
const httpServer = createServer(app);

// Redis Configuration with Enhanced Error Handling
const redisConfig = {
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Redis connection attempt ${retries}`);
      if (retries > 10) {
        console.error('Max Redis connection attempts reached');
        return new Error('Redis connection failed');
      }
      return Math.min(retries * 200, 5000);
    }
  }
};

const pubClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  ...redisConfig
});

const subClient = pubClient.duplicate();

// Redis Error Handlers
pubClient.on('error', (err) => {
  console.error('Redis PubClient Error:', err.message);
  if (err.code === 'ECONNREFUSED') {
    console.error('Redis server not running. Please start Redis:');
    console.error('Linux/Mac: redis-server');
    console.error('Windows (WSL): sudo service redis-server start');
  }
});

subClient.on('error', (err) => {
  console.error('Redis SubClient Error:', err.message);
});

// Initialize Socket.io with Redis Adapter
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  adapter: createAdapter(pubClient, subClient)
});

// Initialize Chat Controller with Shared Redis Clients
const chatController = new ChatController(io, pubClient, subClient);
chatRouter.setController(chatController);
app.use('/api/v1/chat', chatRouter.router);

// Connect to Redis and Start Server
const startServer = async () => {
  try {
    await pubClient.connect();
    await subClient.connect();
    console.log('✅ Redis connected successfully');
    
    httpServer.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🔌 Socket.io ready for connections`);
      console.log(`💾 Redis status: ${pubClient.isOpen ? 'Connected' : 'Disconnected'}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to Redis:', err.message);
    console.log('⚠️ Running in limited mode without Redis');
    
    httpServer.listen(port, () => {
      console.log(`🚀 Server running on port ${port} (without Redis)`);
    });
  }
};

startServer();

// Health Check Endpoint
app.get('/', (req, res) => {
  const redisStatus = pubClient.isOpen ? '✅ Connected' : '❌ Disconnected';
  res.json({
    status: 'running',
    redis: redisStatus,
    socketIo: 'active',
    timestamp: new Date().toISOString()
  });
});

// Error Handling Middleware
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