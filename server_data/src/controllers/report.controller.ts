import { Request, Response, NextFunction } from "express";
import pool from "../database/db";
import Product from "../models/product.model";

export const generalReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [todayRows]: any = await pool.query(
      "SELECT COALESCE(SUM(total_cost), 0) as total FROM sales WHERE DATE(created_at) = CURDATE()"
    );
    const totalSaleToday = Number(todayRows[0]?.total || 0);

    const [saleDueRows]: any = await pool.query(
      "SELECT COALESCE(SUM(due_amount), 0) as total, COUNT(*) as count FROM sales WHERE payment_status IN ('due', 'partial')"
    );
    const totalDueAmountSale = Number(saleDueRows[0]?.total || 0);
    const totalSaleDue = Number(saleDueRows[0]?.count || 0);

    const [purchaseDueRows]: any = await pool.query(
      "SELECT COALESCE(SUM(due_amount), 0) as total, COUNT(*) as count FROM purchases WHERE payment_status IN ('due', 'partial')"
    );
    const totalDueAmountPurchase = Number(purchaseDueRows[0]?.total || 0);
    const totalPurchaseDue = Number(purchaseDueRows[0]?.count || 0);

    const [monthlyRows]: any = await pool.query(
      "SELECT COALESCE(SUM(total_cost), 0) as total FROM sales WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())"
    );
    const totalMonthlySale = Number(monthlyRows[0]?.total || 0);

    const [custRows]: any = await pool.query("SELECT COUNT(*) as total FROM customers");
    const totalCustomers = Number(custRows[0]?.total || 0);

    const [supRows]: any = await pool.query("SELECT COUNT(*) as total FROM suppliers");
    const totalSuppliers = Number(supRows[0]?.total || 0);

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
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    let sql = `
      SELECT s.*, 
             u.username as cashierName, 
             c.name as customerName, 
             c.phone as customerPhone
      FROM sales s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN customers c ON s.customer_id = c.id
    `;
    const params: any[] = [];

    if (startDate && endDate) {
      sql += " WHERE s.created_at >= ? AND s.created_at <= ?";
      params.push(new Date(startDate), new Date(endDate + " 23:59:59"));
    }

    sql += " ORDER BY s.id DESC";

    const [sales]: any = await pool.query(sql, params);
    const totalAmount = sales.reduce((sum: number, s: any) => sum + Number(s.total_cost || 0), 0);

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
    const stockQty = req.query.stockQty !== undefined ? Number(req.query.stockQty) : 10;
    const [docs]: any = await pool.query(
      `SELECT p.*, c.name as categoryName
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.current_stock <= ?
       ORDER BY p.current_stock ASC`,
      [stockQty]
    );

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
    const [sales]: any = await pool.query(
      `SELECT DATE(created_at) as saleDate, 
              SUM(total_cost) as totalRevenue, 
              COUNT(*) as totalOrders
       FROM sales
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at) ASC`
    );

    res.status(200).json({
      success: true,
      result: sales,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  generalReport,
  saleReport,
  stockReport,
  salereportIn30Days,
};
