import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AuthRequest } from "../types";

const authGuard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication Invalid: No token provided!",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Authentication Invalid: User not found!",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Authentication Invalid: Token verification failed!",
    });
  }
};

export default authGuard;
