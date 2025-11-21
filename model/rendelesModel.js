import pool from "../db.js";

export const getAllRendeles = async () => {
  const [rows] = await pool.query(
    "SELECT r.razon, r.vazon, r.fazon, r.idopont, SUM(t.db * p.par) AS total FROM `rendeles` r JOIN tetel t ON t.razon = r.razon JOIN pizza p ON p.pazon = t.pazon GROUP BY r.razon"
  );
  return rows;
};

export const getRendelesByRazon = async (razon) => {
  const [rows] = await pool.execute(
    "SELECT r.razon, r.vazon, r.fazon, r.idopont, SUM(t.db * p.par) AS total FROM `rendeles` r JOIN tetel t ON t.razon = r.razon JOIN pizza p ON p.pazon = t.pazon WHERE r.razon = ? GROUP BY r.razon",
    [razon]
  );
  return rows[0];
};

export const createRendeles = async (rendelesData) => {
  const { name, address } = rendelesData;
  const [result] = await pool.execute(
    "INSERT INTO rendeles (razon, vnev, vcim) VALUES (Null, ?, ?)",
    [name, address]
  );
  return result;
};

export const deleteRendeles = async (razon) => {
  const [result] = await pool.execute("DELETE FROM rendeles WHERE razon = ?", [
    razon,
  ]);
  return result;
};
