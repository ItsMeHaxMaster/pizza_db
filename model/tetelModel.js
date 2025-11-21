import pool from "../db.js";

export const getTetelById = async (id) => {
  const [rows] = await pool.execute(
    " SELECT v.vnev AS Customer, f.fnev AS Carrier, v.vcim AS Address, t.razon AS Order_ID, p.pnev AS Pizza, t.db AS Pcs FROM `tetel` t JOIN pizza p ON t.pazon = p.pazon JOIN rendeles r ON r.razon = t.razon JOIN vevo v ON r.vazon = v.vazon JOIN futar f ON f.fazon = r.fazon WHERE t.razon = ? GROUP BY p.pazon",
    [id]
  );
  return rows[0];
};

export const createTetel = async (tetelData) => {
  const { razon, pazon, db } = tetelData;

  const [orderExists] = await pool.execute(
    "SELECT razon FROM rendeles WHERE razon = ?",
    [razon]
  );

  if (orderExists.length === 0) {
    throw new Error(`Order with razon ${razon} does not exist`);
  }

  const [pizzaExists] = await pool.execute(
    "SELECT pazon FROM pizza WHERE pazon = ?",
    [pazon]
  );

  if (pizzaExists.length === 0) {
    throw new Error(`Pizza with pazon ${pazon} does not exist`);
  }

  const [result] = await pool.execute(
    "INSERT INTO tetel (razon, pazon, db) VALUES (?, ?, ?)",
    [razon, pazon, db]
  );
  return result;
};

export const updateTetel = async (tetelData, razon, pazon,) => {
  const { db } = tetelData;
  const [result] = await pool.execute(
    "UPDATE tetel SET db = ? WHERE razon = ? AND pazon = ?",
    [db, razon, pazon]
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
