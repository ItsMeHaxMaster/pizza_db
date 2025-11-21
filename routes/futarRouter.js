import express from "express";
import * as futarModel from "../model/futarModel.js";

const futarRouter = express.Router();

futarRouter.get("/", async (req, res) => {
  try {
    const futars = await futarModel.getAllFutars();
    res.status(201).send(futars);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

futarRouter.get("/:razon", async (req, res) => {
  try {
    const id = req.params.id;
    const futar = await futarModel.getFutarById(id);
    if (futar) {
      res.status(201).send(futar);
    } else {
      res.status(404).send("Carrier not found");
    }
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

futarRouter.post("/", async (req, res) => {
  try {
    const futarData = req.body;
    const result = await futarModel.createFutar(futarData);
    res
      .status(201)
      .send("Carrier created successfully with id: " + result.insertId);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

futarRouter.put("/:razon", async (req, res) => {
  try {
    const id = req.params.id;
    const futarData = req.body;
    const result = await futarModel.updateFutar(id, futarData);
    res.status(201).send("Carrier updated successfully with id: " + id);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

futarRouter.delete("/:razon", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await futarModel.deleteFutar(id);
    if (result.affectedRows === 0) {
      return res.status(404).send("Carrier not found");
    } else {
      res.status(201).send("Carrier deleted successfully with id: " + id);
    }
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

export default futarRouter;
