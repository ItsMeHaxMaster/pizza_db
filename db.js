import mysql from "mysql2/promise";
import "dotenv/config";

export default mysql.createPool({
  host: process.env.HOST || "localhost",
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "",
  database: process.env.DATABASE || "pizza",
  port: process.env.PORT || 3306,
});
