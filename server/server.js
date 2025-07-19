import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';

import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js'

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

// API Endpoints
app.get('/',(req,res) => {
    res.send('API Working');
})
app.use('/api/auth',authRouter)

app.listen(port,() => {
    console.log(`Server is running at ${port}`)
})