const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mess_management';
    if (!process.env.MONGO_URI) {
        console.warn('WARNING: MONGO_URI environment variable is missing!');
    }

    try {
        console.log('Connecting to MongoDB...');
        cachedConnection = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000
        });
        console.log(`MongoDB Connected: ${cachedConnection.connection.host}`);
        return cachedConnection;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
