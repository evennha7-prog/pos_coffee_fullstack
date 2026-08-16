import pool from "../database/db";

export interface ICategory {
  id?: number;
  name: string;
  note?: string;
  itemCount?: number;
  created_at?: string;
  updated_at?: string;
}

export const create = async (category: ICategory): Promise<ICategory> => {
  const [result]: any = await pool.query(
    "INSERT INTO categories (name, note) VALUES (?, ?)",
    [category.name, category.note || null]
  );
  return { id: result.insertId, name: category.name, note: category.note };
};

export const findById = async (id: number | string): Promise<ICategory | null> => {
  const [rows]: any = await pool.query(
    `SELECT c.id, c.name, c.note, c.created_at, c.updated_at,
            (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as itemCount
     FROM categories c 
     WHERE c.id = ?`,
    [id]
  );
  return rows[0] || null;
};

export const findAll = async ({
  page,
  limit,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<ICategory[]> => {
  let sql = `
    SELECT c.id, c.name, c.note, c.created_at, c.updated_at,
           (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as itemCount
    FROM categories c
  `;
  const params: any[] = [];

  if (search) {
    sql += " WHERE c.name LIKE ?";
    params.push(`%${search}%`);
  }

  sql += " ORDER BY c.id DESC";

  if (page && limit) {
    const offset = (page - 1) * limit;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }

  const [rows]: any = await pool.query(sql, params);
  return rows;
};

export const countAll = async (search = ""): Promise<number> => {
  let sql = "SELECT COUNT(*) as total FROM categories";
  const params: any[] = [];

  if (search) {
    sql += " WHERE name LIKE ?";
    params.push(`%${search}%`);
  }

  const [rows]: any = await pool.query(sql, params);
  return rows[0]?.total || 0;
};

export const update = async (id: number | string, data: Partial<ICategory>): Promise<ICategory | null> => {
  const fields: string[] = [];
  const params: any[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    params.push(data.name);
  }
  if (data.note !== undefined) {
    fields.push("note = ?");
    params.push(data.note);
  }

  if (fields.length === 0) return findById(id);

  params.push(id);
  await pool.query(`UPDATE categories SET ${fields.join(", ")} WHERE id = ?`, params);
  return findById(id);
};

export const remove = async (id: number | string): Promise<boolean> => {
  const [result]: any = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
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
