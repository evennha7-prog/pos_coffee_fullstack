import pool from "../database/db";
import { generateInvoiceNumber } from "./counter.model";

export interface ISaleItemInput {
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ISaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  productName?: string;
  productCode?: string;
  imageUrl?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface ISale {
  id?: number;
  user_id: number;
  cashierName?: string;
  customer_id?: number | null;
  customerName?: string;
  customerPhone?: string;
  invoice_number: string;
  total_cost: number;
  paid_amount: number;
  due_amount: number;
  change_amount: number;
  payment_status: "paid" | "due" | "partial";
  items?: ISaleItem[];
  created_at?: string;
  updated_at?: string;
}

export const create = async ({
  userId,
  customerId,
  totalCost,
  paidAmount = 0,
  items,
}: {
  userId: number;
  customerId?: number | null;
  totalCost: number;
  paidAmount?: number;
  items: ISaleItemInput[];
}): Promise<ISale> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Verify and deduct stock for each product
    for (const item of items) {
      const [prodRows]: any = await connection.query(
        "SELECT id, name, current_stock FROM products WHERE id = ? FOR UPDATE",
        [item.product_id]
      );

      if (prodRows.length === 0) {
        throw new Error(`Product with ID ${item.product_id} not found.`);
      }

      const product = prodRows[0];
      if (product.current_stock < item.quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}". Available: ${product.current_stock}, Requested: ${item.quantity}`
        );
      }

      await connection.query(
        "UPDATE products SET current_stock = current_stock - ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    // 2. Generate invoice number
    const [counterRows]: any = await connection.query(
      `INSERT INTO counters (id, sequence_value) 
       VALUES ('invoice_number', 1) 
       ON DUPLICATE KEY UPDATE sequence_value = sequence_value + 1`
    );
    const [seqRows]: any = await connection.query(
      "SELECT sequence_value FROM counters WHERE id = 'invoice_number'"
    );
    const invoiceSeq = seqRows[0]?.sequence_value || 1;
    const invoiceNumber = "INV-" + String(invoiceSeq).padStart(6, "0");

    // 3. Payment amounts & status
    const dueAmount = Math.max(0, totalCost - paidAmount);
    const changeAmount = Math.max(0, paidAmount - totalCost);
    let paymentStatus: "paid" | "due" | "partial" = "paid";
    if (paidAmount === 0) {
      paymentStatus = "due";
    } else if (paidAmount < totalCost) {
      paymentStatus = "partial";
    }

    // 4. Insert into sales table
    const [saleResult]: any = await connection.query(
      `INSERT INTO sales 
       (user_id, customer_id, invoice_number, total_cost, paid_amount, due_amount, change_amount, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        customerId || null,
        invoiceNumber,
        totalCost,
        paidAmount,
        dueAmount,
        changeAmount,
        paymentStatus,
      ]
    );

    const saleId = saleResult.insertId;

    // 5. Insert sale items
    for (const item of items) {
      await connection.query(
        `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [
          saleId,
          item.product_id,
          item.quantity,
          item.unit_price,
          item.total_price || item.unit_price * item.quantity,
        ]
      );
    }

    await connection.commit();

    return (await findById(saleId))!;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const findById = async (id: number | string): Promise<ISale | null> => {
  const [saleRows]: any = await pool.query(
    `SELECT s.*, 
            u.username as cashierName, 
            c.name as customerName, 
            c.phone as customerPhone
     FROM sales s
     LEFT JOIN users u ON s.user_id = u.id
     LEFT JOIN customers c ON s.customer_id = c.id
     WHERE s.id = ?`,
    [id]
  );

  if (saleRows.length === 0) return null;
  const sale = saleRows[0];

  const [itemRows]: any = await pool.query(
    `SELECT si.*, 
            p.name as productName, 
            p.code as productCode, 
            p.image_url as imageUrl
     FROM sale_items si
     LEFT JOIN products p ON si.product_id = p.id
     WHERE si.sale_id = ?`,
    [id]
  );

  sale.items = itemRows;
  return sale;
};

export const findAll = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<ISale[]> => {
  const offset = (page - 1) * limit;
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

  if (search) {
    sql += " WHERE s.invoice_number LIKE ? OR c.name LIKE ? OR u.username LIKE ?";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY s.id DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [saleRows]: any = await pool.query(sql, params);

  // Fetch items for each sale in batch
  for (const sale of saleRows) {
    const [itemRows]: any = await pool.query(
      `SELECT si.*, p.name as productName, p.code as productCode, p.image_url as imageUrl
       FROM sale_items si
       LEFT JOIN products p ON si.product_id = p.id
       WHERE si.sale_id = ?`,
      [sale.id]
    );
    sale.items = itemRows;
  }

  return saleRows;
};

export const countAll = async (search = ""): Promise<number> => {
  let sql = `
    SELECT COUNT(*) as total 
    FROM sales s 
    LEFT JOIN customers c ON s.customer_id = c.id 
    LEFT JOIN users u ON s.user_id = u.id
  `;
  const params: any[] = [];

  if (search) {
    sql += " WHERE s.invoice_number LIKE ? OR c.name LIKE ? OR u.username LIKE ?";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [rows]: any = await pool.query(sql, params);
  return rows[0]?.total || 0;
};

export const addPayment = async (
  id: number | string,
  additionalPaid: number
): Promise<ISale | null> => {
  const sale = await findById(id);
  if (!sale) return null;

  const totalCost = Number(sale.total_cost);
  const newPaid = Number(sale.paid_amount) + additionalPaid;
  const dueAmount = Math.max(0, totalCost - newPaid);
  const changeAmount = Math.max(0, newPaid - totalCost);

  let paymentStatus: "paid" | "due" | "partial" = "paid";
  if (newPaid === 0) {
    paymentStatus = "due";
  } else if (newPaid < totalCost) {
    paymentStatus = "partial";
  }

  await pool.query(
    `UPDATE sales 
     SET paid_amount = ?, due_amount = ?, change_amount = ?, payment_status = ? 
     WHERE id = ?`,
    [newPaid, dueAmount, changeAmount, paymentStatus, id]
  );

  return findById(id);
};

export const remove = async (id: number | string): Promise<boolean> => {
  const [result]: any = await pool.query("DELETE FROM sales WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

export default {
  create,
  findById,
  findAll,
  countAll,
  addPayment,
  remove,
};
