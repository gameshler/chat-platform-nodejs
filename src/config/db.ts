import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log(`Connected to database: ${connection.connection.host}`);
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
};

export default connectDb;
