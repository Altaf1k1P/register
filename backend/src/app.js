import express from 'express';
import cors from 'cors';
import cookieParser  from "cookie-parser";

const app = express();

// Enable JSON parsing middleware for all routes

app.use(express.json({ limit: '16kb' }));

// Enable CORS for all routes

app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent in requests and responses  // some legacy browsers (IE11, various older browsers) choke on 204
}));

// Enable cookie-parser middleware
app.use(cookieParser());


import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';

app.use('/api/auth', userRouter);
app.use('/api', postRouter);

export default app;