import pool from "../db.js";

export const getTetelById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT t.razon, p.pnev, t.db FROM `tetel` t JOIN pizza p ON t.pazon = p.pazon WHERE t.razon = ? ORDER BY t.razon;",
    [id]
  );
  return rows[0];
};

export const createTetel = async (tetelData) => {
  const { razon, pazon, db } = tetelData;
  const [result] = await pool.execute(
    "INSERT INTO tetel (razon, pazon, db) VALUES (?, ?, ?)",
    [razon, pazon, db]
  );
  return result;
};

export const updateTetel = async (id, tetelData) => {
  const { pazon, db } = tetelData;
  const [result] = await pool.execute(
    "UPDATE tetel SET pazon = ?, db = ? WHERE razon = ?",
    [pazon, db, id]
  );
  return result;
};

export const deleteTetel = async (razon, pazon) => {
  const [result] = await pool.execute(
    "DELETE FROM tetel WHERE razon = ? AND pazon = ?",
    [razon, pazon]
  );
  return result;
};
