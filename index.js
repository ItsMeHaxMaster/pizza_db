import express from "express";
import cors from "cors";
import "dotenv/config";
import futarRouter from "./routes/futarRouter.js";
import pizzaRouter from "./routes/pizzaRouter.js";
import rendelesRouter from "./routes/rendelesRouter.js";
import tetelRouter from "./routes/tetelRouter.js";
import vevoRouter from "./routes/vevoRouter.js";

const app = express();
const PORT = process.env.SERVERPORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/futar", futarRouter);
app.use("/api/pizza", pizzaRouter);
app.use("/api/rendeles", rendelesRouter);
app.use("/api/tetel", tetelRouter);
app.use("/api/vevo", vevoRouter);
app.use("/static", express.static("images"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});
