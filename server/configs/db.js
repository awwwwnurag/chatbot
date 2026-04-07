// server/configs/db.js
import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        mongoose.connection.on('connected', () => {
            isConnected = true;
            console.log('MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error; // Rethrow to let the caller handle it
    } 
};  

export default connectDB;