import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser'; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MongoDB_URL;

app.use(cors({
  origin : process.env.Client_URL,
  methods : ['GET', 'POST','DELETE','PUT'],
  allowedHeaders : [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Expires",
    "Pragma"
  ],
  credentials : true
}));

app.use(cookieParser());
app.use(express.json());

//database connection
mongoose.connect(MONGODB_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



