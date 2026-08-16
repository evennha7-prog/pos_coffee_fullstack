import { Response, NextFunction } from "express";
import Purchase from "../models/purchase.model";
import { AuthRequest } from "../types";

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { supplier_id, supplier, invoice_number, invoiceNumber, purchase_date, purchaseDate, total_cost, totalCost, paid_amount, paidAmount, purchase_status, purchaseStatus, items } = req.body;
    const userId = req.user?.id || 1;

    const finalSupplierId = Number(supplier_id || supplier);
    const finalInvoiceNumber = invoice_number || invoiceNumber;
    const finalTotalCost = Number(total_cost !== undefined ? total_cost : totalCost);
    const finalPaidAmount = Number(paid_amount !== undefined ? paid_amount : paidAmount || 0);
    const finalPurchaseStatus = purchase_status || purchaseStatus || "pending";

    if (!finalSupplierId || !finalInvoiceNumber || finalTotalCost === undefined) {
      return res.status(400).json({
        success: false,
        error: "Supplier, invoice number, and total cost are required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Purchase must contain at least one item",
      });
    }

    const formattedItems = items.map((it: any) => ({
      product_id: Number(it.product_id || it.product || it.id),
      quantity: Number(it.quantity || it.qty || 1),
      unit_price: Number(it.unit_price || it.price || 0),
      total_price: Number(it.total_price || (it.unit_price || it.price || 0) * (it.quantity || it.qty || 1)),
    }));

    const newPurchase = await Purchase.create({
      userId,
      supplierId: finalSupplierId,
      invoiceNumber: finalInvoiceNumber,
      purchaseDate: purchase_date || purchaseDate,
      totalCost: finalTotalCost,
      paidAmount: finalPaidAmount,
      purchaseStatus: finalPurchaseStatus,
      items: formattedItems,
    });

    res.status(201).json({
      success: true,
      result: newPurchase,
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

    const docs = await Purchase.findAll({ page, limit, search });
    const totalItem = await Purchase.countAll(search);
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
    const doc = await Purchase.findById(id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Purchase order not found with that ID!",
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
    const id = String(req.params.id);
    const { purchaseStatus, purchase_status } = req.body;
    const status = purchaseStatus || purchase_status;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "New purchase status is required",
      });
    }

    const updated = await Purchase.updatePurchaseStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Purchase order not found with that ID!",
      });
    }

    res.status(200).json({
      success: true,
      result: updated,
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
    const paidAmount = Number(req.body?.paidAmount || req.body?.paid_amount);

    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid paid amount!",
      });
    }

    const updated = await Purchase.addPayment(id, paidAmount);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Purchase order not found with that ID!",
      });
    }

    res.status(200).json({
      success: true,
      result: updated,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  findAll,
  findOne,
  updatePurchaseStatus,
  addPayment,
};
