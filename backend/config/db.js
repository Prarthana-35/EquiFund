// require('dotenv').config();
require('dotenv').config({ path: __dirname + '/.env' });
console.log("MONGODB_URI from .env:", process.env.MONGODB_URI);

const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("Mongo URI:", process.env.MONGODB_URI); // Log the URI
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;

