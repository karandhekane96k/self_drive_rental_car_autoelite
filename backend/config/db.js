import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // This tells Mongoose to connect using the secret URL in your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // This stops the server if the database fails to connect
  }
};

export default connectDB;