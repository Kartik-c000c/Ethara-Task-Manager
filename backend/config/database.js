const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';
  
  const connectWithRetry = async () => {
    try {
      const conn = await mongoose.connect(mongoURI, {
        autoIndex: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`MongoDB connection error: ${error.message}. Retrying in 5 seconds...`);
      setTimeout(connectWithRetry, 5000);
    }
  };

  await connectWithRetry();
};

module.exports = connectDB;
