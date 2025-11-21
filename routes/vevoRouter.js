import express from "express";
import * as vevoModel from "../model/vevoModel.js";

const vevoRouter = express.Router();

vevoRouter.get("/", async (req, res) => {
  try {
    const vevos = await vevoModel.getAllVevo();
    res.status(201).send(vevos);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

vevoRouter.get("/:razon", async (req, res) => {
  try {
    const id = req.params.id;
    const vevo = await vevoModel.getVevoById(id);
    if (vevo) {
      res.status(201).send(vevo);
    } else {
      res.status(404).send("Customer not found");
    }
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

vevoRouter.post("/", async (req, res) => {
  try {
    const vevoData = req.body;
    const result = await vevoModel.createVevo(vevoData);
    res
      .status(201)
      .send("Customer created successfully with id: " + result.insertId);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

vevoRouter.put("/:razon", async (req, res) => {
  try {
    const id = req.params.id;
    const vevoData = req.body;
    const result = await vevoModel.updateVevo(id, vevoData);
    res.status(201).send("Customer updated successfully with id: " + id);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

vevoRouter.delete("/:razon", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await vevoModel.deleteVevo(id);
    if (result.affectedRows === 0) {
      return res.status(404).send("Customer not found");
    } else {
      res.status(201).send("Customer deleted successfully with id: " + id);
    }
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

export default vevoRouter;
