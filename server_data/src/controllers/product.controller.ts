import { Request, Response, NextFunction } from "express";
import Product from "../models/product.model";
import { generateProductCode } from "../models/counter.model";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { name, category_id, code, image_url, cost_price, sale_price, current_stock, note } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Product name is required",
      });
    }

    if (!code) {
      code = await generateProductCode();
    }

    const newDoc = await Product.create({
      name,
      category_id: category_id ? Number(category_id) : null,
      code,
      image_url: image_url || "",
      cost_price: Number(cost_price) || 0,
      sale_price: Number(sale_price) || 0,
      current_stock: Number(current_stock) || 0,
      note: note || null,
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
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const search = req.query.search ? String(req.query.search) : "";
    const categoryId = req.query.category_id ? String(req.query.category_id) : undefined;
    const sort = req.query.sort ? String(req.query.sort) : undefined;

    const docs = await Product.findAll({ page, limit, search, categoryId, sort });
    const totalItem = await Product.countAll({ search, categoryId });
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
    const doc = await Product.findById(id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Product not found with that ID!",
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
    const code = String(req.params.code);
    const doc = await Product.findByCode(code);

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Product not found with that code!",
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
    const doc = await Product.update(id, req.body);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Product not found with that ID!",
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
    const deleted = await Product.remove(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Product not found with that ID!",
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
  findOneByCode,
  update,
  remove,
};
