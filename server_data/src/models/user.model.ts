import pool from "../database/db";

export interface IUser {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role: "super" | "admin" | "cashier";
  created_at?: string;
  updated_at?: string;
}

export const create = async (user: IUser): Promise<IUser> => {
  const [result]: any = await pool.query(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [user.username, user.email, user.password, user.role || "cashier"]
  );
  return { id: result.insertId, username: user.username, email: user.email, role: user.role };
};

export const findById = async (id: number | string): Promise<IUser | null> => {
  const [rows]: any = await pool.query(
    "SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

export const findByEmail = async (email: string, includePassword = false): Promise<IUser | null> => {
  const fields = includePassword
    ? "id, username, email, password, role, created_at, updated_at"
    : "id, username, email, role, created_at, updated_at";
  const [rows]: any = await pool.query(
    `SELECT ${fields} FROM users WHERE email = ?`,
    [email]
  );
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
}): Promise<IUser[]> => {
  const offset = (page - 1) * limit;
  let sql = "SELECT id, username, email, role, created_at, updated_at FROM users";
  const params: any[] = [];

  if (search) {
    sql += " WHERE username LIKE ? OR email LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY id DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [rows]: any = await pool.query(sql, params);
  return rows;
};

export const countAll = async (search = ""): Promise<number> => {
  let sql = "SELECT COUNT(*) as total FROM users";
  const params: any[] = [];

  if (search) {
    sql += " WHERE username LIKE ? OR email LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }

  const [rows]: any = await pool.query(sql, params);
  return rows[0]?.total || 0;
};

export const update = async (id: number | string, user: Partial<IUser>): Promise<IUser | null> => {
  const fields: string[] = [];
  const params: any[] = [];

  if (user.username !== undefined) {
    fields.push("username = ?");
    params.push(user.username);
  }
  if (user.email !== undefined) {
    fields.push("email = ?");
    params.push(user.email);
  }
  if (user.password !== undefined) {
    fields.push("password = ?");
    params.push(user.password);
  }
  if (user.role !== undefined) {
    fields.push("role = ?");
    params.push(user.role);
  }

  if (fields.length === 0) return findById(id);

  params.push(id);
  await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, params);
  return findById(id);
};

export const remove = async (id: number | string): Promise<boolean> => {
  const [result]: any = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

export default {
  create,
  findById,
  findByEmail,
  findAll,
  countAll,
  update,
  remove,
};
