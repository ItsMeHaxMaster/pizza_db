import express from "express";
import * as rendelesModel from "../model/rendelesModel.js";

const rendelesRouter = express.Router();

rendelesRouter.get("/", async (req, res) => {
  try {
    const rendeles = await rendelesModel.getAllRendeles();
    res.status(201).send(rendeles);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

rendelesRouter.get("/:razon", async (req, res) => {
  try {
    const razon = req.params.razon;
    const rendeles = await rendelesModel.getRendelesByRazon(razon);
    if (rendeles) {
      res.status(201).send(rendeles);
    } else {
      res.status(404).send("Order not found");
    }
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

rendelesRouter.post("/", async (req, res) => {
  try {
    const rendelesData = req.body;
    const result = await rendelesModel.createRendeles(rendelesData);
    res
      .status(201)
      .send("Order created successfully with razon: " + result.insertId);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

rendelesRouter.put("/:razon", async (req, res) => {
  try {
    const razon = req.params.razon;
    const rendelesData = req.body;
    const result = await rendelesModel.updateRendeles(razon, rendelesData);
    res.status(201).send("Order updated successfully with razon: " + razon);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

rendelesRouter.delete("/:razon", async (req, res) => {
  try {
    const razon = req.params.razon;
    const result = await rendelesModel.deleteRendeles(razon);
    if (result.affectedRows === 0) {
      return res.status(404).send("Order not found");
    } else {
      res.status(201).send("Order deleted successfully with razon: " + razon);
    }
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

export default rendelesRouter;
