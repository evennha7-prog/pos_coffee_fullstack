import { Response, NextFunction } from "express";
import calculatePaymentStatus from "../helpers/calculatePaymentStatus";
import Product from "../models/product.model";
import Purchase from "../models/purchase.model";
import { AuthRequest } from "../types";

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { items, totalCost, purchaseStatus } = req.body;
    const paymentStatus = calculatePaymentStatus(totalCost, 0);

    // 1). update stock product if purchase status equal received
    if (purchaseStatus === "received" && Array.isArray(items)) {
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({
            success: false,
            error: `Product with ID ${item.product} not found!`,
          });
        }
        product.currentStock = (product.currentStock || 0) + item.quantity;
        await product.save();
      }
    }

    // 2). Insert purchase record into the database
    const newDoc = await Purchase.create({
      ...req.body,
      paymentStatus,
      dueAmount: totalCost,
      user: req.user?._id,
      items,
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
        { invoiceNumber: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const docs = await Purchase.find(querySearch)
      .populate("user", "username role")
      .populate("supplier", "businessName phone")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name imageUrl salePrice costPrice currentStock",
        },
      })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .exec();

    const totalItems = await Purchase.find(querySearch).countDocuments();
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
    const doc = await Purchase.findById(id)
      .populate("user", "username role")
      .populate("supplier", "businessName phone")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name imageUrl salePrice costPrice currentStock",
        },
      });

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

export const updatePurchaseStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { purchaseStatus } = req.body;

    const doc = await Purchase.findById(id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "No document found with that ID",
      });
    }

    // 1. check if purchase status is already received
    if (doc.purchaseStatus === "received") {
      return res.status(400).json({
        success: false,
        error: "Purchase status is already received",
      });
    }

    // 2. update stock
    if (purchaseStatus === "received" && Array.isArray(doc.items)) {
      for (const item of doc.items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({
            success: false,
            error: `Product with ID ${item.product} not found!`,
          });
        }
        product.currentStock = (product.currentStock || 0) + item.quantity;
        await product.save();
      }
    }

    const newDoc = await Purchase.findByIdAndUpdate(
      id,
      { purchaseStatus },
      { new: true }
    );

    res.status(200).json({
      success: true,
      result: newDoc,
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
    const id = req.params.id;
    const paidAmount = Number(req.body?.paidAmount);

    if (!paidAmount) {
      return res.status(400).json({
        success: false,
        error: "Please provide paid amount!",
      });
    }

    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: "Purchase not found with that ID!",
      });
    }

    const totalCost = purchase.totalCost;
    const newPaidAmount = (purchase.paidAmount || 0) + paidAmount;
    const newDueAmount = Math.max(0, totalCost - newPaidAmount);
    const changeAmount = Math.max(0, newPaidAmount - totalCost);
    const paymentStatus = calculatePaymentStatus(totalCost, newPaidAmount);

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      id,
      {
        paidAmount: newPaidAmount,
        paymentStatus: paymentStatus,
        dueAmount: newDueAmount,
        changeAmount: changeAmount,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      result: updatedPurchase,
    });
  } catch (error) {
    next(error);
  }
};
