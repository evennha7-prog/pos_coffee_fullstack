import { Response, NextFunction } from "express";
import calculatePaymentStatus from "../helpers/calculatePaymentStatus";
import Product from "../models/product.model";
import Sale from "../models/sale.model";
import { generateInvoiceNumber } from "./counter.controller";
import { AuthRequest } from "../types";

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { items, totalCost, paidAmount, customer } = req.body;
    if (!paidAmount) {
      paidAmount = 0;
    }

    // Step 1: Fetch all products to validate stock
    const productIds = items.map((it: any) => it.product);
    const products = await Product.find({ _id: { $in: productIds } });

    // Step 2: Validate stock for each product
    const productUpdates: any[] = [];
    for (const item of items) {
      const product = products.find(
        (p) => p._id.toString() === item.product.toString()
      );
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product not found with ID: ${item.product}`,
        });
      }
      if (product.currentStock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for product: ${product.name}`,
        });
      }

      productUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { currentStock: -item.quantity } },
        },
      });
    }

    // Step 3: Execute stock updates in bulk
    await Product.bulkWrite(productUpdates);

    // Step 4: Calculate payment status
    const paymentStatus = calculatePaymentStatus(totalCost, paidAmount);

    // Step 5: Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Step 6: Calculate due & change amounts
    const dueAmount = Math.max(0, totalCost - paidAmount);
    const changeAmount = Math.max(0, paidAmount - totalCost);

    // Step 7: Create new Sale
    const newSale = await Sale.create({
      user: req.user?._id,
      customer,
      invoiceNumber,
      paymentStatus,
      dueAmount,
      changeAmount,
      paidAmount,
      totalCost,
      items,
    });

    res.status(201).json({
      success: true,
      result: newSale,
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

    const docs = await Sale.find(querySearch)
      .populate("user", "username role")
      .populate("customer", "name phone")
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

    const totalItems = await Sale.find(querySearch).countDocuments();
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
    const doc = await Sale.findById(id)
      .populate("user", "username role")
      .populate("customer", "name phone")
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

export const checkStock = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const stock = Number(req.query.stock);
    const product = req.query.product as string;

    if (!stock || !product) {
      return res.status(400).json({
        success: false,
        error: "Please provide stock and product",
      });
    }

    const doc = await Product.findById(product);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Product not found!",
      });
    }

    if (doc.currentStock < stock) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock for product: ${doc.name}`,
      });
    }

    res.status(200).json({
      success: true,
      result: {},
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

    const doc = await Sale.findById(id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Sale not found with that ID!",
      });
    }

    const totalCost = doc.totalCost;
    const newPaidAmount = (doc.paidAmount || 0) + paidAmount;
    const newDueAmount = Math.max(0, totalCost - newPaidAmount);
    const changeAmount = Math.max(0, newPaidAmount - totalCost);
    const paymentStatus = calculatePaymentStatus(totalCost, newPaidAmount);

    const updatedSale = await Sale.findByIdAndUpdate(
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
      result: updatedSale,
    });
  } catch (error) {
    next(error);
  }
};
