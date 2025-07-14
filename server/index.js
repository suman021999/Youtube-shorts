import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import database from './db/database'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'





const app = express()
dotenv.config()
database()


app.use(
    cors({
      origin:  "http://localhost:5174", //process.env.Frontend_URL ||
      credentials: true,
    })
  );

// Middleware
app.use(express.json())
app.use(cookieParser())

app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json())

Port=process.env.PORT || 5000

app.listen(PORT, () => console.log(`server run on ${PORT}`))