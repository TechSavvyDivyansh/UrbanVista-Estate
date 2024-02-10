import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';



import UserRouter from './routes/user.route.js';
import AuthRouter from './routes/auth.route.js'
import listingRoute from './routes/listing.route.js'

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err)
})

const app=express();
app.use(express.json());
app.use(cookieParser());


const port=3000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})




app.use("/api/user",UserRouter)
app.use('/api/auth',AuthRouter)
app.use('/api/listing',listingRoute)


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message || 'Internal server error😔'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
        
    })
})