import pool from "../database/db";

export interface IProduct {
  id?: number;
  name: string;
  category_id?: number | null;
  categoryName?: string;
  code: string;
  image_url: string;
  cost_price: number;
  sale_price: number;
  current_stock: number;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export const create = async (product: IProduct): Promise<IProduct> => {
  const [result]: any = await pool.query(
    `INSERT INTO products 
     (name, category_id, code, image_url, cost_price, sale_price, current_stock, note) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      product.name,
      product.category_id || null,
      product.code,
      product.image_url || "",
      product.cost_price || 0,
      product.sale_price || 0,
      product.current_stock || 0,
      product.note || null,
    ]
  );
  return (await findById(result.insertId))!;
};

export const findById = async (id: number | string): Promise<IProduct | null> => {
  const [rows]: any = await pool.query(
    `SELECT p.*, c.name as categoryName 
     FROM products p 
     LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.id = ?`,
    [id]
  );
  return rows[0] || null;
};

export const findByCode = async (code: string): Promise<IProduct | null> => {
  const [rows]: any = await pool.query(
    `SELECT p.*, c.name as categoryName 
     FROM products p 
     LEFT JOIN categories c ON p.category_id = c.id 
     WHERE p.code = ?`,
    [code]
  );
  return rows[0] || null;
};

export const findAll = async ({
  page,
  limit,
  search = "",
  categoryId,
  sort = "p.id DESC",
}: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number | string;
  sort?: string;
} = {}): Promise<IProduct[]> => {
  let sql = `
    SELECT p.*, c.name as categoryName 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
  `;
  const conditions: string[] = [];
  const params: any[] = [];

  if (search) {
    conditions.push("(p.name LIKE ? OR p.code LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (categoryId && categoryId !== "All") {
    conditions.push("p.category_id = ?");
    params.push(categoryId);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Safe sorting
  sql += ` ORDER BY ${sort.includes("ASC") ? "p.id ASC" : "p.id DESC"}`;

  if (page && limit) {
    const offset = (page - 1) * limit;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }

  const [rows]: any = await pool.query(sql, params);
  return rows;
};

export const countAll = async ({
  search = "",
  categoryId,
}: {
  search?: string;
  categoryId?: number | string;
} = {}): Promise<number> => {
  let sql = "SELECT COUNT(*) as total FROM products p";
  const conditions: string[] = [];
  const params: any[] = [];

  if (search) {
    conditions.push("(p.name LIKE ? OR p.code LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (categoryId && categoryId !== "All") {
    conditions.push("p.category_id = ?");
    params.push(categoryId);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  const [rows]: any = await pool.query(sql, params);
  return rows[0]?.total || 0;
};

export const update = async (id: number | string, data: Partial<IProduct>): Promise<IProduct | null> => {
  const fields: string[] = [];
  const params: any[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    params.push(data.name);
  }
  if (data.category_id !== undefined) {
    fields.push("category_id = ?");
    params.push(data.category_id || null);
  }
  if (data.code !== undefined) {
    fields.push("code = ?");
    params.push(data.code);
  }
  if (data.image_url !== undefined) {
    fields.push("image_url = ?");
    params.push(data.image_url);
  }
  if (data.cost_price !== undefined) {
    fields.push("cost_price = ?");
    params.push(data.cost_price);
  }
  if (data.sale_price !== undefined) {
    fields.push("sale_price = ?");
    params.push(data.sale_price);
  }
  if (data.current_stock !== undefined) {
    fields.push("current_stock = ?");
    params.push(data.current_stock);
  }
  if (data.note !== undefined) {
    fields.push("note = ?");
    params.push(data.note);
  }

  if (fields.length === 0) return findById(id);

  params.push(id);
  await pool.query(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`, params);
  return findById(id);
};

export const updateStock = async (id: number | string, delta: number): Promise<boolean> => {
  const [result]: any = await pool.query(
    "UPDATE products SET current_stock = current_stock + ? WHERE id = ?",
    [delta, id]
  );
  return result.affectedRows > 0;
};

export const remove = async (id: number | string): Promise<boolean> => {
  const [result]: any = await pool.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

export default {
  create,
  findById,
  findByCode,
  findAll,
  countAll,
  update,
  updateStock,
  remove,
};
