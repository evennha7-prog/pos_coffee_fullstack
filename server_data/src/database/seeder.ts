import dotenv from "dotenv";
dotenv.config();
import bcryptjs from "bcryptjs";
import { connectToDatabase } from "./db";
import User from "../models/user.model";

const run = async (): Promise<void> => {
  try {
    await connectToDatabase();

    const superEmail = process.env.SUPER_EMAIL || "super@coffee.com";
    const superPassword = process.env.SUPER_PASSWORD || "123456";
    const superUsername = process.env.SUPER_USERNAME || "superadmin";

    const existSuper = await User.findOne({ email: superEmail });
    const hashed = await bcryptjs.hash(superPassword, 10);

    if (!existSuper) {
      await new User({
        username: superUsername,
        email: superEmail,
        password: hashed,
        role: "super",
      }).save();
      console.log("Super user seeded successfully!");
    } else {
      console.log("Super user already exists.");
    }

    console.log("Seeding finished successfully!");
    process.exit(0);
  } catch (error: any) {
    console.error("Error during execution:", error.message);
    process.exit(1);
  }
};

run();
