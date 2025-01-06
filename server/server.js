import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from './config/connectdb.js';
import friendrouter from './routes/FriendsRoutes.js';
import userAuth from './routes/userAuth.js';


const app = express();
// cors policy
app.use(cors());
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || "";


// JSON 
app.use(express.json());//sort data into json format

// Connect Database
connectDB(DATABASE_URL);


// Routes
app.use("/api/friend",friendrouter)//for security purposes change the path to /api/users
app.use("/api/user",userAuth)//for security purposes change the path to /api/users

app.get("/",async (req,res)=>{
    res.send("Running");
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});