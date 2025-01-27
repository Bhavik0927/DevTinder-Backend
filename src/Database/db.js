const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/devTinder';
        await mongoose.connect(mongoURI)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDB;
