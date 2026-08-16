import { Response, NextFunction } from "express";
import Sale from "../models/sale.model";
import Product from "../models/product.model";
import { AuthRequest } from "../types";

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { items, totalCost, paidAmount, customer_id, customer } = req.body;
    const customerId = customer_id || customer || null;
    const userId = req.user?.id || 1;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Items array is required to process sale",
      });
    }

    if (totalCost === undefined || totalCost === null) {
      return res.status(400).json({
        success: false,
        error: "Total cost is required",
      });
    }

    const formattedItems = items.map((it: any) => ({
      product_id: Number(it.product_id || it.product || it.id),
      quantity: Number(it.quantity || it.qty || 1),
      unit_price: Number(it.unit_price || it.price || 0),
      total_price: Number(it.total_price || (it.unit_price || it.price || 0) * (it.quantity || it.qty || 1)),
    }));

    const newSale = await Sale.create({
      userId,
      customerId: customerId ? Number(customerId) : null,
      totalCost: Number(totalCost),
      paidAmount: Number(paidAmount) || 0,
      items: formattedItems,
    });

    res.status(201).json({
      success: true,
      result: newSale,
    });
  } catch (error: any) {
    next(error);
  }
};

export const findAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const search = req.query.search ? String(req.query.search) : "";

    const docs = await Sale.findAll({ page, limit, search });
    const totalItem = await Sale.countAll(search);
    const totalPage = Math.ceil(totalItem / limit);

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
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const doc = await Sale.findById(id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Sale transaction not found with that ID!",
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

export const checkStock = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const stock = Number(req.query.stock);
    const productId = String(req.query.product);

    if (!stock || !productId) {
      return res.status(400).json({
        success: false,
        error: "Please provide stock quantity and product ID",
      });
    }

    const doc = await Product.findById(productId);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Product not found!",
      });
    }

    if (doc.current_stock < stock) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock for product: ${doc.name}. Available: ${doc.current_stock}`,
      });
    }

    res.status(200).json({
      success: true,
      result: { availableStock: doc.current_stock },
    });
  } catch (error) {
    next(error);
  }
};

export const addPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const paidAmount = Number(req.body?.paidAmount);

    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid paid amount!",
      });
    }

    const updatedSale = await Sale.addPayment(id, paidAmount);
    if (!updatedSale) {
      return res.status(404).json({
        success: false,
        error: "Sale transaction not found with that ID!",
      });
    }

    res.status(200).json({
      success: true,
      result: updatedSale,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  findAll,
  findOne,
  checkStock,
  addPayment,
};
