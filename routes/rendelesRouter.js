import express from "express";
import * as rendelesModel from "../model/rendelesModel.js";

const rendelesRouter = express.Router();

rendelesRouter.get("/", async (req, res) => {
  try {
    const rendeles = await rendelesModel.getAllRendeles();
    res.status(200).send(rendeles);
  } catch (error) {
    console.error("Error in GET /rendeles:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

rendelesRouter.get("/:razon", async (req, res) => {
  try {
    const razon = req.params.razon;

    if (isNaN(razon) || razon <= 0) {
      return res
        .status(400)
        .send("Invalid order ID (razon). Must be a positive number");
    }

    const rendeles = await rendelesModel.getRendelesByRazon(razon);
    if (rendeles) {
      res.status(200).send(rendeles);
    } else {
      res.status(404).send(`Order not found with ID ${razon}`);
    }
  } catch (error) {
    console.error("Error in GET /rendeles/:razon:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

rendelesRouter.post("/", async (req, res) => {
  try {
    const rendelesData = req.body;

    if (!rendelesData || Object.keys(rendelesData).length === 0) {
      return res.status(400).send("Request body is empty or invalid");
    }

    const missingFields = [];
    if (!rendelesData.vazon) missingFields.push("vazon");
    if (!rendelesData.fazon) missingFields.push("fazon");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .send(`Missing required fields: ${missingFields.join(", ")}`);
    }

    if (isNaN(rendelesData.vazon) || isNaN(rendelesData.fazon)) {
      return res
        .status(400)
        .send("Fields vazon and fazon must be valid numbers");
    }

    if (rendelesData.vazon <= 0 || rendelesData.fazon <= 0) {
      return res
        .status(400)
        .send("Fields vazon and fazon must be positive numbers");
    }

    const result = await rendelesModel.createRendeles(rendelesData);
    res
      .status(201)
      .send("Order created successfully with razon: " + result.insertId);
  } catch (error) {
    console.error("Error in POST /rendeles:", error.message);
    if (error.message && error.message.includes("does not exist")) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});

rendelesRouter.put("/:razon", async (req, res) => {
  try {
    const razon = req.params.razon;
    const rendelesData = req.body;

    if (isNaN(razon) || razon <= 0) {
      return res
        .status(400)
        .send("Invalid order ID (razon). Must be a positive number");
    }

    if (!rendelesData || Object.keys(rendelesData).length === 0) {
      return res.status(400).send("Request body is empty or invalid");
    }

    const result = await rendelesModel.updateRendeles(razon, rendelesData);

    if (result.affectedRows === 0) {
      return res.status(404).send(`Order not found with ID ${razon}`);
    }

    res.status(200).send("Order updated successfully with razon: " + razon);
  } catch (error) {
    console.error("Error in PUT /rendeles/:razon:", error.message);
    if (error.message && error.message.includes("does not exist")) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});

rendelesRouter.delete("/:razon", async (req, res) => {
  try {
    const razon = req.params.razon;

    if (isNaN(razon) || razon <= 0) {
      return res
        .status(400)
        .send("Invalid order ID (razon). Must be a positive number");
    }

    const result = await rendelesModel.deleteRendeles(razon);

    if (result.affectedRows === 0) {
      return res.status(404).send(`Order not found with ID ${razon}`);
    }

    res.status(200).send("Order deleted successfully with razon: " + razon);
  } catch (error) {
    console.error("Error in DELETE /rendeles/:razon:", error.message);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      res
        .status(409)
        .send(
          "Cannot delete order: it has associated items. Delete the items first."
        );
    } else {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});

export default rendelesRouter;
