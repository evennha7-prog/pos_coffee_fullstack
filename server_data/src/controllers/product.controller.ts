import { Request, Response, NextFunction } from "express";
import Product from "../models/product.model";
import { generateProductCode } from "./counter.controller";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = await generateProductCode();
    const newDoc = await Product.create({
      ...req.body,
      code,
      currentStock: 0,
    });
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
    let sortOption: any = "-_id";

    // Advanced filtering
    const reservedFields = ["page", "limit", "sort", "search"];
    const queryFilters: any = { ...req.query };
    reservedFields.forEach((field) => delete queryFilters[field]);

    const filterString = JSON.stringify(queryFilters).replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      (match) => `$${match}`
    );
    const filters = JSON.parse(filterString);

    if (req.query.search) {
      querySearch["$or"] = [
        { name: { $regex: req.query.search, $options: "i" } },
        { code: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.sort) {
      sortOption = req.query.sort;
    }

    const docs = await Product.find({ ...querySearch, ...filters })
      .skip(skip)
      .limit(limit)
      .sort(sortOption)
      .populate({
        path: "category",
        select: "name",
      })
      .exec();

    const totalItem = await Product.find(querySearch).countDocuments();
    const totalPage = Math.ceil(totalItem / limit);

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
    const doc = await Product.findById(id).populate("category", "name");

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

export const findOneByCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = req.params.code;
    const doc = await Product.findOne({ code }).populate("category", "name");

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
    const doc = await Product.findByIdAndUpdate(id, req.body, { new: true });
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
    const doc = await Product.findByIdAndDelete(id);
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
