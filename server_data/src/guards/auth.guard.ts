import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AuthRequest } from "../types";

const authGuard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.token;

    // Support Bearer token header if cookie is not present
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication Invalid: No token provided!",
      });
    }

    const payload = jwt.verify(
      token,
      (process.env.JWT_SECRET as string) || "supersecretjwtkey_coffeepos_2026"
    ) as {
      userId: number | string;
    };

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Authentication Invalid: User not found!",
      });
    }

    req.user = {
      id: user.id!,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Authentication Invalid: Token verification failed!",
    });
  }
};

export default authGuard;
