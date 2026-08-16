import pool from "../database/db";

export const getNextSequence = async (id: string): Promise<number> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO counters (id, sequence_value) 
       VALUES (?, 1) 
       ON DUPLICATE KEY UPDATE sequence_value = sequence_value + 1`,
      [id]
    );

    const [rows]: any = await connection.query(
      `SELECT sequence_value FROM counters WHERE id = ?`,
      [id]
    );

    await connection.commit();
    return rows[0]?.sequence_value || 1;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const generateProductCode = async (): Promise<string> => {
  const seq = await getNextSequence("product_code");
  return String(seq).padStart(6, "0");
};

export const generateInvoiceNumber = async (): Promise<string> => {
  const seq = await getNextSequence("invoice_number");
  return String(seq).padStart(6, "0");
};

export default {
  getNextSequence,
  generateProductCode,
  generateInvoiceNumber,
};
