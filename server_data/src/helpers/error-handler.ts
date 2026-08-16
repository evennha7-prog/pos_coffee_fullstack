import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let errMessage: any = err.message || "Server Error!";

  // MySQL Duplicate entry (code: ER_DUP_ENTRY or errno 1062)
  if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) {
    statusCode = 409;
    errMessage = err.sqlMessage || "A record with this unique value already exists!";
  }

  // MySQL Foreign Key Constraint (code: ER_NO_REFERENCED_ROW_2 or errno 1452)
  if (err.code === "ER_NO_REFERENCED_ROW_2" || err.errno === 1452) {
    statusCode = 400;
    errMessage = "Referenced category, supplier, customer or user does not exist.";
  }

  // Mongoose / Custom Validation
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((el: any) => ({
      path: el.path,
      message: el.message,
    }));
    statusCode = 400;
    errMessage = errors.length > 0 ? errors : err.message;
  }

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      success: false,
      name: err.name,
      error: errMessage,
      stack: err.stack,
    });
  } else {
    res.status(statusCode).json({
      success: false,
      error: errMessage,
    });
  }
};

export default errorHandler;
