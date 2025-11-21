import pool from "../db.js";

export const getAllPizzas = async () => {
  const [rows] = await pool.query("SELECT * FROM pizza");
  return rows;
};

export const getPizzaById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM pizza WHERE pazon = ?", [
    id,
  ]);
  return rows[0];
};

export const createPizza = async (pizzaData) => {
  const { name, price } = pizzaData;
  const [result] = await pool.execute(
    "INSERT INTO pizza (pazon, pnev, par) VALUES (Null, ?, ?)",
    [name, price]
  );
  return result;
};

export const updatePizza = async (id, pizzaData) => {
  const { name, price } = pizzaData;
  const [result] = await pool.execute(
    "UPDATE pizza SET pnev = ?, par = ? WHERE pazon = ?",
    [name, price, id]
  );
  return result;
};

export const deletePizza = async (id) => {
  const [result] = await pool.execute("DELETE FROM pizza WHERE pazon = ?", [
    id,
  ]);
  return result;
};
