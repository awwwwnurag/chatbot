// server/configs/db.js
import mongoose from "mongoose";

const connectDB = async () => {
    // 1 = connected, 2 = connecting
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error;
    } 
};
  

export default connectDB;