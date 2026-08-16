import pool from "../database/db";

export interface ISupplier {
  id?: number;
  business_name: string;
  name: string;
  phone?: string;
  address?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export const create = async (supplier: ISupplier): Promise<ISupplier> => {
  const [result]: any = await pool.query(
    "INSERT INTO suppliers (business_name, name, phone, address, note) VALUES (?, ?, ?, ?, ?)",
    [supplier.business_name, supplier.name, supplier.phone || null, supplier.address || null, supplier.note || null]
  );
  return { id: result.insertId, ...supplier };
};

export const findById = async (id: number | string): Promise<ISupplier | null> => {
  const [rows]: any = await pool.query("SELECT * FROM suppliers WHERE id = ?", [id]);
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
} = {}): Promise<ISupplier[]> => {
  let sql = "SELECT * FROM suppliers";
  const params: any[] = [];

  if (search) {
    sql += " WHERE business_name LIKE ? OR name LIKE ? OR phone LIKE ?";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
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
  let sql = "SELECT COUNT(*) as total FROM suppliers";
  const params: any[] = [];

  if (search) {
    sql += " WHERE business_name LIKE ? OR name LIKE ? OR phone LIKE ?";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [rows]: any = await pool.query(sql, params);
  return rows[0]?.total || 0;
};

export const update = async (id: number | string, data: Partial<ISupplier>): Promise<ISupplier | null> => {
  const fields: string[] = [];
  const params: any[] = [];

  if (data.business_name !== undefined) {
    fields.push("business_name = ?");
    params.push(data.business_name);
  }
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
  await pool.query(`UPDATE suppliers SET ${fields.join(", ")} WHERE id = ?`, params);
  return findById(id);
};

export const remove = async (id: number | string): Promise<boolean> => {
  const [result]: any = await pool.query("DELETE FROM suppliers WHERE id = ?", [id]);
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
