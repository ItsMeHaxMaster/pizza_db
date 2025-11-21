import express from "express";
import * as tetelModel from "../model/tetelModel.js";

const tetelRouter = express.Router();

tetelRouter.get("/:razon", async (req, res) => {
  try {
    const razon = req.params.razon;

    if (isNaN(razon) || razon <= 0) {
      return res
        .status(400)
        .send("Invalid order ID (razon). Must be a positive number");
    }

    const tetel = await tetelModel.getTetelById(razon);
    if (tetel) {
      res.status(200).send(tetel);
    } else {
      res.status(404).send(`No items found for order ID ${razon}`);
    }
  } catch (error) {
    console.error("Error in GET /tetel/:razon:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

tetelRouter.post("/", async (req, res) => {
  try {
    const tetelData = req.body;

    if (!tetelData || Object.keys(tetelData).length === 0) {
      return res.status(400).send("Request body is empty or invalid");
    }

    const missingFields = [];
    if (!tetelData.razon) missingFields.push("razon");
    if (!tetelData.pazon) missingFields.push("pazon");
    if (!tetelData.db) missingFields.push("db");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .send(`Missing required fields: ${missingFields.join(", ")}`);
    }

    if (
      isNaN(tetelData.razon) ||
      isNaN(tetelData.pazon) ||
      isNaN(tetelData.db)
    ) {
      return res
        .status(400)
        .send("Fields razon, pazon, and db must be valid numbers");
    }

    if (
      tetelData.razon <= 0 ||
      tetelData.pazon <= 0 ||
      tetelData.db < 1 ||
      tetelData.db > 20
    ) {
      return res
        .status(400)
        .send(
          "Fields razon and pazon must be positive numbers, and db must be between 1 and 20"
        );
    }

    const result = await tetelModel.createTetel(tetelData);
    res.status(201).send("Item created successfully");
  } catch (error) {
    console.error("Error in POST /tetel:", error.message);
    if (error.message && error.message.includes("does not exist")) {
      res.status(400).send(error.message);
    } else if (error.code === "ER_DUP_ENTRY") {
      res.status(409).send("This item already exists in the order");
    } else {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});

tetelRouter.put("/:razon/:pazon", async (req, res) => {
  try {
    const razon = req.params.razon;
    const pazon = req.params.pazon;
    const tetelData = req.body;

    if (isNaN(razon) || razon < 1 || razon > 20) {
      return res
        .status(400)
        .send("Invalid order ID (razon). Must be between 1 and 20");
    }

    if (!tetelData || Object.keys(tetelData).length === 0) {
      return res.status(400).send("Request body is empty or invalid");
    }

    if (!tetelData.db) {
      return res.status(400).send("Missing required field: db");
    }

    if (isNaN(tetelData.db) || tetelData.db < 1 || tetelData.db > 20) {
      return res.status(400).send("Field db must be a number between 1 and 20");
    }

    const result = await tetelModel.updateTetel(tetelData, razon, pazon);

    if (result.affectedRows === 0) {
      return res.status(404).send(`No item found with order ID ${razon}`);
    }

    res.status(200).send("Item updated successfully with razon: " + razon);
  } catch (error) {
    console.error("Error in PUT /tetel/:razon:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

tetelRouter.delete("/:razon", async (req, res) => {
  return res
    .status(400)
    .send(
      "Missing pizza ID (pazon). DELETE requires both razon and pazon. Use: /api/tetel/:razon/:pazon"
    );
});

tetelRouter.delete("/:razon/:pazon", async (req, res) => {
  try {
    const razon = req.params.razon;
    const pazon = req.params.pazon;

    if (isNaN(razon) || razon <= 0) {
      return res
        .status(400)
        .send("Invalid order ID (razon). Must be a positive number");
    }

    if (isNaN(pazon) || pazon <= 0) {
      return res
        .status(400)
        .send("Invalid pizza ID (pazon). Must be a positive number");
    }

    const result = await tetelModel.deleteTetel(razon, pazon);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send(`Item not found with razon: ${razon} and pazon: ${pazon}`);
    }

    res
      .status(200)
      .send(
        `Item deleted successfully with razon: ${razon} and pazon: ${pazon}`
      );
  } catch (error) {
    console.error("Error in DELETE /tetel/:razon/:pazon:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

export default tetelRouter;
