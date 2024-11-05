import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dot } from 'node:test/reporters';

dotenv.config();

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB====', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;
