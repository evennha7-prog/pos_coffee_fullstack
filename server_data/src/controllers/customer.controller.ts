import { Request, Response, NextFunction } from "express";
import Customer from "../models/customer.model";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newDoc = await Customer.create(req.body);
    res.status(201).json({
      success: true,
      result: newDoc,
    });
  } catch (error) {
    next(error);
  }
};

export const findAll = async (
  req: Request,
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
        { name: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const docs = await Customer.find(querySearch)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .exec();

    const totalItems = await Customer.find(querySearch).countDocuments();
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const doc = await Customer.findById(id);
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const doc = await Customer.findByIdAndUpdate(id, req.body, { new: true });
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

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const doc = await Customer.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Document not found with that ID!",
      });
    }
    res.status(200).json({
      success: true,
      result: "Deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
