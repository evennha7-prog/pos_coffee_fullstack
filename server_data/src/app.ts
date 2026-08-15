import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import qs from "qs";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

import errorHandler from "./helpers/error-handler";
import categoryRouter from "./routes/category.route";
import customerRouter from "./routes/customer.route";
import supplierRouter from "./routes/supplier.route";
import uploadRouter from "./routes/upload.route";
import productRouter from "./routes/product.route";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import purchaseRouter from "./routes/purchase.route";
import saleRouter from "./routes/sale.route";
import reportRouter from "./routes/report.route";
import authGuard from "./guards/auth.guard";

const app = express();

const allowedOrigins: (string | undefined)[] = [
  process.env.LOCAL_DOMAIN || "http://localhost:3000",
  process.env.CLIENT_DOMAIN,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie", "Authorization"],
  })
);

app.set("query parser", (queryString: string) => {
  return qs.parse(queryString, {
    decoder: (value) => {
      const num = Number(value);
      return isNaN(num) ? value : num;
    },
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again!",
  },
});
app.use(limiter);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/v1/categories", authGuard, categoryRouter);
app.use("/api/v1/customers", authGuard, customerRouter);
app.use("/api/v1/suppliers", authGuard, supplierRouter);
app.use("/api/v1/upload", authGuard, uploadRouter);
app.use("/api/v1/products", authGuard, productRouter);
app.use("/api/v1/purchase", authGuard, purchaseRouter);
app.use("/api/v1/users", authGuard, userRouter);
app.use("/api/v1/sale", authGuard, saleRouter);
app.use("/api/v1/report", authGuard, reportRouter);
app.use("/api/v1/auth", authRouter);
app.use("/upload", express.static("upload"));

// Error Handler Middleware
app.use(errorHandler);

export default app;
