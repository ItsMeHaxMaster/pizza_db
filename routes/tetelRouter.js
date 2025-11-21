import express from "express";
import * as tetelModel from "../model/tetelModel.js";

const tetelRouter = express.Router();

tetelRouter.get("/:razon", async (req, res) => {
  try {
    const id = req.params.id;
    const tetel = await tetelModel.getTetelById(id);
    if (tetel) {
      res.status(201).send(tetel);
    } else {
      res.status(404).send("Item not found");
    }
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

tetelRouter.post("/", async (req, res) => {
  try {
    const tetelData = req.body;
    const result = await tetelModel.createTetel(tetelData);
    res
      .status(201)
      .send("Item created successfully with id: " + result.insertId);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

tetelRouter.put("/:razon", async (req, res) => {
  try {
    const razon = req.params.razon;
    const tetelData = req.body;
    const result = await tetelModel.updateTetel(razon, tetelData);
    res.status(201).send("Item updated successfully with razon: " + razon);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

tetelRouter.delete("/:razon/:pazon", async (req, res) => {
  try {
    const razon = req.params.razon;
    const pazon = req.params.pazon;
    const result = await tetelModel.deleteTetel(razon, pazon);
    if (result.affectedRows === 0) {
      return res.status(404).send("Item not found");
    } else {
      res
        .status(201)
        .send(
          `Item deleted successfully with razon: ${razon} and pazon: ${pazon}`
        );
    }
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

export default tetelRouter;
