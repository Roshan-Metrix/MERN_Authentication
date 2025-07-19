import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';


const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

app.get('/',(req,res) => {
    res.send('hello');
})

connectDB();

app.listen(port,() => {
    console.log(`Server is running at ${port}`)
})