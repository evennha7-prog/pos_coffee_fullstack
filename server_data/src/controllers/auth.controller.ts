import { Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AuthRequest } from "../types";

export const signup = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({
        success: false,
        error: "Password is required",
      });
    }

    if (req.user?.role !== "super" && req.body.role === "admin") {
      return res.status(403).json({
        success: false,
        error: "Only super users can create admin account!",
      });
    }

    const hashed = await bcryptjs.hash(req.body.password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashed,
    });

    const userObj = newUser.toObject ? newUser.toObject() : { ...newUser };
    delete (userObj as any).password;

    res.status(201).json({
      success: true,
      result: userObj,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid credentials",
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Password does not match!",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      (process.env.JWT_SECRET as string) || "secret",
      {
        expiresIn: (process.env.JWT_LIFETIME as any) || "7d",
      }
    );

    const cookieExpire = Number(process.env.COOKIE_EXPIRE) || 7;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: cookieExpire * 24 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN ? process.env.COOKIE_DOMAIN : "localhost",
      sameSite: (process.env.COOKIE_SAMESITE as any) || "lax",
    });

    res.status(200).json({
      success: true,
      result: {
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const cookieExpire = Number(process.env.COOKIE_EXPIRE) || 7;

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: cookieExpire * 24 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN ? process.env.COOKIE_DOMAIN : "localhost",
      sameSite: (process.env.COOKIE_SAMESITE as any) || "lax",
    });

    res.status(200).json({
      success: true,
      result: "Signout successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      result: req.user,
    });
  } catch (error) {
    next(error);
  }
};
