import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Create MySQL Connection Pool
export const pool = mysql.createPool(
  process.env.DB_URL
    ? {
        uri: process.env.DB_URL,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "pos_system",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: {
          rejectUnauthorized: false,
        },
      }
);

// Helper to test database connection
export const connectToDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL Database successfully!");
    connection.release();
  } catch (error: any) {
    console.error("MySQL Connection Error:", error.message);
  }
};

export default pool;
