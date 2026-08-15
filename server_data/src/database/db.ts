import mongoose from "mongoose";

export const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/coffee_pos";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully");
  } catch (error: any) {
    console.error("MongoDB Connection Error:", error.message);
  }
};
