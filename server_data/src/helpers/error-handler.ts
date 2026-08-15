import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let errMessage: any = "Server Error!";

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el: any) => ({
      path: el.path,
      message: el.message,
    }));
    statusCode = 400;
    errMessage = errors;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    errMessage = `Duplicate key error: ${field} must be unique!`;
    statusCode = 409;
  }

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      success: false,
      name: err.name,
      stack: err.stack,
      error: errMessage,
    });
  } else {
    res.status(statusCode).json({
      success: false,
      error: errMessage,
    });
  }
};

export default errorHandler;
