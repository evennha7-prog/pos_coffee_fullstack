import dotenv from "dotenv";
import app from "./app";
import { connectToDatabase } from "./database/db";

// Config dotenv
dotenv.config();

// Connect to MySQL Database
connectToDatabase();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
