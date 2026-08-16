import pool from "../database/db";

export interface IPurchaseItemInput {
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price?: number;
}

export interface IPurchaseItem {
  id: number;
  purchase_id: number;
  product_id: number;
  productName?: string;
  productCode?: string;
  imageUrl?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface IPurchase {
  id?: number;
  user_id: number;
  purchasedByName?: string;
  supplier_id: number;
  supplierName?: string;
  supplierPhone?: string;
  invoice_number: string;
  purchase_date: string;
  total_cost: number;
  paid_amount: number;
  due_amount: number;
  change_amount: number;
  payment_status: "paid" | "due" | "partial";
  purchase_status: "received" | "ordered" | "pending" | "cancel";
  items?: IPurchaseItem[];
  created_at?: string;
  updated_at?: string;
}

export const create = async ({
  userId,
  supplierId,
  invoiceNumber,
  purchaseDate,
  totalCost,
  paidAmount = 0,
  purchaseStatus = "pending",
  items = [],
}: {
  userId: number;
  supplierId: number;
  invoiceNumber: string;
  purchaseDate?: string;
  totalCost: number;
  paidAmount?: number;
  purchaseStatus?: "received" | "ordered" | "pending" | "cancel";
  items: IPurchaseItemInput[];
}): Promise<IPurchase> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const dueAmount = Math.max(0, totalCost - paidAmount);
    const changeAmount = Math.max(0, paidAmount - totalCost);
    let paymentStatus: "paid" | "due" | "partial" = "due";
    if (paidAmount >= totalCost && totalCost > 0) {
      paymentStatus = "paid";
    } else if (paidAmount > 0) {
      paymentStatus = "partial";
    }

    const [purchaseResult]: any = await connection.query(
      `INSERT INTO purchases 
       (user_id, supplier_id, invoice_number, purchase_date, total_cost, paid_amount, due_amount, change_amount, payment_status, purchase_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        supplierId,
        invoiceNumber,
        purchaseDate ? new Date(purchaseDate) : new Date(),
        totalCost,
        paidAmount,
        dueAmount,
        changeAmount,
        paymentStatus,
        purchaseStatus,
      ]
    );

    const purchaseId = purchaseResult.insertId;

    // Insert purchase items and update stock if received
    for (const item of items) {
      const totalPrice = item.total_price || item.unit_price * item.quantity;
      await connection.query(
        `INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [purchaseId, item.product_id, item.quantity, item.unit_price, totalPrice]
      );

      if (purchaseStatus === "received") {
        await connection.query(
          "UPDATE products SET current_stock = current_stock + ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }
    }

    await connection.commit();
    return (await findById(purchaseId))!;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const findById = async (id: number | string): Promise<IPurchase | null> => {
  const [purchaseRows]: any = await pool.query(
    `SELECT p.*, 
            u.username as purchasedByName, 
            s.business_name as supplierName, 
            s.phone as supplierPhone
     FROM purchases p
     LEFT JOIN users u ON p.user_id = u.id
     LEFT JOIN suppliers s ON p.supplier_id = s.id
     WHERE p.id = ?`,
    [id]
  );

  if (purchaseRows.length === 0) return null;
  const purchase = purchaseRows[0];

  const [itemRows]: any = await pool.query(
    `SELECT pi.*, 
            prod.name as productName, 
            prod.code as productCode, 
            prod.image_url as imageUrl
     FROM purchase_items pi
     LEFT JOIN products prod ON pi.product_id = prod.id
     WHERE pi.purchase_id = ?`,
    [id]
  );

  purchase.items = itemRows;
  return purchase;
};

export const findAll = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<IPurchase[]> => {
  const offset = (page - 1) * limit;
  let sql = `
    SELECT p.*, 
           u.username as purchasedByName, 
           s.business_name as supplierName, 
           s.phone as supplierPhone
    FROM purchases p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
  `;
  const params: any[] = [];

  if (search) {
    sql += " WHERE p.invoice_number LIKE ? OR s.business_name LIKE ? OR u.username LIKE ?";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY p.id DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [purchaseRows]: any = await pool.query(sql, params);

  for (const purchase of purchaseRows) {
    const [itemRows]: any = await pool.query(
      `SELECT pi.*, prod.name as productName, prod.code as productCode, prod.image_url as imageUrl
       FROM purchase_items pi
       LEFT JOIN products prod ON pi.product_id = prod.id
       WHERE pi.purchase_id = ?`,
      [purchase.id]
    );
    purchase.items = itemRows;
  }

  return purchaseRows;
};

export const countAll = async (search = ""): Promise<number> => {
  let sql = `
    SELECT COUNT(*) as total 
    FROM purchases p 
    LEFT JOIN suppliers s ON p.supplier_id = s.id 
    LEFT JOIN users u ON p.user_id = u.id
  `;
  const params: any[] = [];

  if (search) {
    sql += " WHERE p.invoice_number LIKE ? OR s.business_name LIKE ? OR u.username LIKE ?";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [rows]: any = await pool.query(sql, params);
  return rows[0]?.total || 0;
};

export const updatePurchaseStatus = async (
  id: number | string,
  newStatus: "received" | "ordered" | "pending" | "cancel"
): Promise<IPurchase | null> => {
  const purchase = await findById(id);
  if (!purchase) return null;

  if (purchase.purchase_status === "received" && newStatus === "received") {
    return purchase;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // If changing to received from another status, increase stock
    if (newStatus === "received" && purchase.purchase_status !== "received" && purchase.items) {
      for (const item of purchase.items) {
        await connection.query(
          "UPDATE products SET current_stock = current_stock + ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }
    }

    await connection.query(
      "UPDATE purchases SET purchase_status = ? WHERE id = ?",
      [newStatus, id]
    );

    await connection.commit();
    return await findById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const addPayment = async (
  id: number | string,
  additionalPaid: number
): Promise<IPurchase | null> => {
  const purchase = await findById(id);
  if (!purchase) return null;

  const totalCost = Number(purchase.total_cost);
  const newPaid = Number(purchase.paid_amount) + additionalPaid;
  const dueAmount = Math.max(0, totalCost - newPaid);
  const changeAmount = Math.max(0, newPaid - totalCost);

  let paymentStatus: "paid" | "due" | "partial" = "due";
  if (newPaid >= totalCost && totalCost > 0) {
    paymentStatus = "paid";
  } else if (newPaid > 0) {
    paymentStatus = "partial";
  }

  await pool.query(
    `UPDATE purchases 
     SET paid_amount = ?, due_amount = ?, change_amount = ?, payment_status = ? 
     WHERE id = ?`,
    [newPaid, dueAmount, changeAmount, paymentStatus, id]
  );

  return findById(id);
};

export const remove = async (id: number | string): Promise<boolean> => {
  const [result]: any = await pool.query("DELETE FROM purchases WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

export default {
  create,
  findById,
  findAll,
  countAll,
  updatePurchaseStatus,
  addPayment,
  remove,
};
