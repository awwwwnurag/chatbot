// server/configs/db.js
import mongoose from "mongoose";

const connectDB = async () => {
    // 1 = connected, 2 = connecting
    const state = mongoose.connection.readyState;
    if (state >= 1) {
        return;
    }

    try {
        console.log('Attempting to connect to MongoDB...');
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing');
        }

        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB ERROR:', error.message);
        throw error;
    } 
};
  

export default connectDB;