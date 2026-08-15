import { Response, NextFunction } from "express";
import User from "../models/user.model";
import bcryptjs from "bcryptjs";
import { AuthRequest } from "../types";

export const findAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const querySearch: any = {};

    if (req.query.search) {
      querySearch["$or"] = [
        { username: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const docs = await User.find({
      ...querySearch,
      role: { $ne: "super" },
      email: { $ne: req.user?.email },
    })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .exec();

    const totalItems = await User.find({
      ...querySearch,
      role: { $ne: "super" },
      email: { $ne: req.user?.email },
    }).countDocuments();
    const totalPage = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      totalPage,
      result: docs,
    });
  } catch (error) {
    next(error);
  }
};

export const findOne = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const doc = await User.findById(id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Document not found with that ID!",
      });
    }
    res.status(200).json({
      success: true,
      result: doc,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { role, password } = req.body;

    if (!role) {
      return res.status(403).json({
        success: false,
        error: "Please provide role!",
      });
    }

    if (req.user?.role !== "super" && role === "admin") {
      return res.status(403).json({
        success: false,
        error: "Only super users can update admin accounts",
      });
    }

    if (password) {
      const hashed = await bcryptjs.hash(password, 10);
      req.body.password = hashed;
    }

    const doc = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      result: doc,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const role = req.user?.role;

    const doc = await User.findById(id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Document not found with that ID!",
      });
    }

    if (doc.role === "super") {
      return res.status(400).json({
        success: false,
        error: "You can't delete this user!",
      });
    }

    if (doc.role === "admin" && role !== "super") {
      return res.status(400).json({
        success: false,
        error: "You don't have permission to delete this user!",
      });
    }

    await doc.deleteOne();

    res.status(200).json({
      success: true,
      result: "User deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
