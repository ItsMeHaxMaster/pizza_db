import pool from "../db.js";

export const getAllRendeles = async () => {
  const [rows] = await pool.query(
    "SELECT t.razon AS Order_Id,  vnev AS Customer, f.fnev AS Carrier, v.vcim AS Address,SUM(t.db * p.par) AS Total, Date(r.idopont) AS Date FROM `tetel` t JOIN pizza p ON t.pazon = p.pazon JOIN rendeles r ON r.razon = t.razon JOIN vevo v ON r.vazon = v.vazon JOIN futar f ON f.fazon = r.fazon GROUP BY r.razon"
  );
  return rows;
};

export const getRendelesByRazon = async (razon) => {
  const [rows] = await pool.execute(
    "SELECT t.razon AS Order_Id,  vnev AS Customer, f.fnev AS Carrier, v.vcim AS Address,SUM(t.db * p.par) AS Total, Date(r.idopont) AS Date FROM `tetel` t JOIN pizza p ON t.pazon = p.pazon JOIN rendeles r ON r.razon = t.razon JOIN vevo v ON r.vazon = v.vazon JOIN futar f ON f.fazon = r.fazon WHERE r.razon = ? GROUP BY r.razon",
    [razon]
  );
  return rows[0];
};

export const createRendeles = async (rendelesData) => {
  const { vazon, fazon } = rendelesData;

  const [vevoExists] = await pool.execute(
    "SELECT vazon FROM vevo WHERE vazon = ?",
    [vazon]
  );

  if (vevoExists.length === 0) {
    throw new Error(`Customer with vazon ${vazon} does not exist`);
  }

  const [futarExists] = await pool.execute(
    "SELECT fazon FROM futar WHERE fazon = ?",
    [fazon]
  );

  if (futarExists.length === 0) {
    throw new Error(`Carrier with fazon ${fazon} does not exist`);
  }

  const [result] = await pool.execute(
    "INSERT INTO rendeles (razon, vazon, fazon, idopont) VALUES (Null, ?, ?, NOW())",
    [vazon, fazon]
  );
  return result;
};

export const deleteRendeles = async (razon) => {
  const [result] = await pool.execute("DELETE FROM rendeles WHERE razon = ?", [
    razon,
  ]);
  return result;
};
