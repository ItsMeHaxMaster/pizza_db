import pool from "../db.js";

export const getAllFutars = async () => {
  const [rows] = await pool.query("SELECT * FROM futar");
  return rows;
};

export const getFutarById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM futar WHERE fazon = ?", [
    id,
  ]);
  return rows[0];
};

export const createFutar = async (futarData) => {
  const { name, phone } = futarData;
  const [result] = await pool.execute(
    "INSERT INTO futar (fazon, fnev, ftel) VALUES (Null, ?, ?)",
    [name, phone]
  );
  return result;
};

export const updateFutar = async (id, futarData) => {
  const { name, phone } = futarData;
  const [result] = await pool.execute(
    "UPDATE futar SET fnev = ?, ftel = ? WHERE fazon = ?",
    [name, phone, id]
  );
  return result;
};

export const deleteFutar = async (id) => {
  const [result] = await pool.execute("DELETE FROM futar WHERE fazon = ?", [
    id,
  ]);
  return result;
};
