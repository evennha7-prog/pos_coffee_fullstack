import pool from "../database/db";

export interface ICustomer {
  id?: number;
  name: string;
  phone?: string;
  address?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export const create = async (customer: ICustomer): Promise<ICustomer> => {
  const [result]: any = await pool.query(
    "INSERT INTO customers (name, phone, address, note) VALUES (?, ?, ?, ?)",
    [customer.name, customer.phone || null, customer.address || null, customer.note || null]
  );
  return { id: result.insertId, ...customer };
};

export const findById = async (id: number | string): Promise<ICustomer | null> => {
  const [rows]: any = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
  return rows[0] || null;
};

export const findAll = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<ICustomer[]> => {
  let sql = "SELECT * FROM customers";
  const params: any[] = [];

  if (search) {
    sql += " WHERE name LIKE ? OR phone LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY id DESC";

  if (page && limit) {
    const offset = (page - 1) * limit;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }

  const [rows]: any = await pool.query(sql, params);
  return rows;
};

export const countAll = async (search = ""): Promise<number> => {
  let sql = "SELECT COUNT(*) as total FROM customers";
  const params: any[] = [];

  if (search) {
    sql += " WHERE name LIKE ? OR phone LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }

  const [rows]: any = await pool.query(sql, params);
  return rows[0]?.total || 0;
};

export const update = async (id: number | string, data: Partial<ICustomer>): Promise<ICustomer | null> => {
  const fields: string[] = [];
  const params: any[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    params.push(data.name);
  }
  if (data.phone !== undefined) {
    fields.push("phone = ?");
    params.push(data.phone);
  }
  if (data.address !== undefined) {
    fields.push("address = ?");
    params.push(data.address);
  }
  if (data.note !== undefined) {
    fields.push("note = ?");
    params.push(data.note);
  }

  if (fields.length === 0) return findById(id);

  params.push(id);
  await pool.query(`UPDATE customers SET ${fields.join(", ")} WHERE id = ?`, params);
  return findById(id);
};

export const remove = async (id: number | string): Promise<boolean> => {
  const [result]: any = await pool.query("DELETE FROM customers WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

export default {
  create,
  findById,
  findAll,
  countAll,
  update,
  remove,
};
