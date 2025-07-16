import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import userRouter from "./routes/user.route.js"
import database from './db/database.js'
import cookieParser from 'cookie-parser'
import  {configurePassport}  from './config/passport.config.js';


const app = express()
dotenv.config();
database()
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
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false })); 
app.use("/api/v1/auth",userRouter)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));