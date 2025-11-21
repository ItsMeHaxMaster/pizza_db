import pool from "../db.js";

export const getAllVevo = async () => {
  const [rows] = await pool.query("SELECT * FROM vevo");
  return rows;
};

export const getVevoById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM vevo WHERE vazon = ?", [id]);
  return rows[0];
};

export const createVevo = async (vevoData) => {
  const { name, address } = vevoData;
  const [result] = await pool.execute(
    "INSERT INTO vevo (vazon, vnev, vcim) VALUES (Null, ?, ?)",
    [name, address]
  );
  return result;
};

export const updateVevo = async (id, vevoData) => {
  const { name, address } = vevoData;
  const [result] = await pool.execute(
    "UPDATE vevo SET vnev = ?, vcim = ? WHERE vazon = ?",
    [name, address, id]
  );
  return result;
};

export const deleteVevo = async (id) => {
  const [result] = await pool.execute("DELETE FROM vevo WHERE vazon = ?", [id]);
  return result;
};
