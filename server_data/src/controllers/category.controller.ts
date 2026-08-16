import { Request, Response, NextFunction } from "express";
import Category from "../models/category.model";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, note } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Category name is required",
      });
    }

    const newDoc = await Category.create({ name, note });
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
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const search = req.query.search ? String(req.query.search) : "";

    const docs = await Category.findAll({ page, limit, search });
    const totalItem = await Category.countAll(search);
    const totalPage = limit ? Math.ceil(totalItem / limit) : 1;

    res.status(200).json({
      success: true,
      totalItem,
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
    const id = String(req.params.id);
    const doc = await Category.findById(id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Category not found with that ID!",
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
    const id = String(req.params.id);
    const doc = await Category.update(id, req.body);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Category not found with that ID!",
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
    const id = String(req.params.id);
    const deleted = await Category.remove(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Category not found with that ID!",
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

export default {
  create,
  findAll,
  findOne,
  update,
  remove,
};
