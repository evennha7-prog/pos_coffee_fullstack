import { Request, Response, NextFunction } from "express";
import Customer from "../models/customer.model";
import Product from "../models/product.model";
import Purchase from "../models/purchase.model";
import Sale from "../models/sale.model";
import Supplier from "../models/supplier.model";

export const generalReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. find revenue today
    const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));
    const todaySales = await Sale.find(
      {
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      },
      {
        totalCost: 1,
      }
    );

    const totalSaleToday = todaySales.reduce((sum, sale) => {
      return sum + (sale.totalCost || 0);
    }, 0);

    // 2. total due amount sale
    const dueSales = await Sale.find(
      {
        paymentStatus: "due",
      },
      {
        totalCost: 1,
      }
    );

    const totalDueAmountSale = dueSales.reduce((sum, sale) => {
      return sum + (sale.totalCost || 0);
    }, 0);

    // 3. total due amount purchase
    const duePurchases = await Purchase.find(
      {
        paymentStatus: "due",
      },
      { totalCost: 1 }
    );
    const totalDueAmountPurchase = duePurchases.reduce((sum, purchase) => {
      return sum + (purchase.totalCost || 0);
    }, 0);

    // 4. monthly sale
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    const monthlySales = await Sale.find(
      {
        createdAt: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      },
      { totalCost: 1 }
    );

    const totalMonthlySale = monthlySales.reduce((sum, sale) => {
      return sum + (sale.totalCost || 0);
    }, 0);

    // count metrics
    const totalCustomers = await Customer.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();
    const totalPurchaseDue = await Purchase.find({
      paymentStatus: "due",
    }).countDocuments();
    const totalSaleDue = await Sale.find({
      paymentStatus: "due",
    }).countDocuments();

    res.status(200).json({
      success: true,
      result: {
        totalSaleToday,
        totalDueAmountSale,
        totalDueAmountPurchase,
        totalMonthlySale,
        totalCustomers,
        totalSuppliers,
        totalPurchaseDue,
        totalSaleDue,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const saleReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.query?.startDate || !req.query?.endDate) {
      return res.status(400).json({
        success: false,
        error: "Start date and End date are required",
      });
    }

    const startDate = new Date(req.query.startDate as string);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(req.query.endDate as string);
    endDate.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("customer", "name phone")
      .populate("user", "username email role");

    const totalAmount = sales.reduce((sum, sale) => {
      return sum + (sale.totalCost || 0);
    }, 0);

    res.status(200).json({
      success: true,
      totalAmount,
      result: sales,
    });
  } catch (error) {
    next(error);
  }
};

export const stockReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.query?.stockQty) {
      return res.status(400).json({
        success: false,
        error: "Please provide stock qty",
      });
    }

    const docs = await Product.find({
      currentStock: {
        $lte: Number(req.query.stockQty),
      },
    }).populate("category", "name");

    res.status(200).json({
      success: true,
      result: docs,
    });
  } catch (error) {
    next(error);
  }
};

export const salereportIn30Days = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sales = await Sale.find(
      {
        createdAt: {
          $gte: thirtyDaysAgo,
        },
      },
      {
        createdAt: 1,
        totalCost: 1,
      }
    );

    res.status(200).json({
      success: true,
      result: sales,
    });
  } catch (error) {
    next(error);
  }
};
