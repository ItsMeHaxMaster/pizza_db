import express from "express";
import * as vevoModel from "../model/vevoModel.js";

const vevoRouter = express.Router();

vevoRouter.get("/", async (req, res) => {
  try {
    const vevos = await vevoModel.getAllVevo();
    res.status(200).send(vevos);
  } catch (error) {
    console.error("Error in GET /vevo:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

vevoRouter.get("/:vazon", async (req, res) => {
  try {
    const vazon = req.params.vazon;

    if (isNaN(vazon) || vazon <= 0) {
      return res
        .status(400)
        .send("Invalid customer ID (vazon). Must be a positive number");
    }

    const vevo = await vevoModel.getVevoById(vazon);
    if (vevo) {
      res.status(200).send(vevo);
    } else {
      res.status(404).send(`Customer not found with ID ${vazon}`);
    }
  } catch (error) {
    console.error("Error in GET /vevo/:vazon:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

vevoRouter.post("/", async (req, res) => {
  try {
    const vevoData = req.body;

    if (!vevoData || Object.keys(vevoData).length === 0) {
      return res.status(400).send("Request body is empty or invalid");
    }

    const missingFields = [];
    if (!vevoData.vnev) missingFields.push("vnev");
    if (!vevoData.vcim) missingFields.push("vcim");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .send(`Missing required fields: ${missingFields.join(", ")}`);
    }

    if (vevoData.vnev.trim().length < 3) {
      return res
        .status(400)
        .send("Field vnev must be at least 3 characters long");
    }

    if (vevoData.vcim.trim().length === 0) {
      return res.status(400).send("Field vcim cannot be empty");
    }

    const result = await vevoModel.createVevo(vevoData);
    res
      .status(201)
      .send("Customer created successfully with id: " + result.insertId);
  } catch (error) {
    console.error("Error in POST /vevo:", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).send("Customer with this information already exists");
    } else {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});

vevoRouter.put("/:vazon", async (req, res) => {
  try {
    const vazon = req.params.vazon;
    const vevoData = req.body;

    if (isNaN(vazon) || vazon <= 0) {
      return res
        .status(400)
        .send("Invalid customer ID (vazon). Must be a positive number");
    }

    if (!vevoData || Object.keys(vevoData).length === 0) {
      return res.status(400).send("Request body is empty or invalid");
    }

    if (vevoData.vnev !== undefined && vevoData.vnev.trim().length < 3) {
      return res
        .status(400)
        .send("Field vnev must be at least 3 characters long");
    }

    if (vevoData.vcim !== undefined && vevoData.vcim.trim().length === 0) {
      return res.status(400).send("Field vcim cannot be empty");
    }

    const result = await vevoModel.updateVevo(vazon, vevoData);

    if (result.affectedRows === 0) {
      return res.status(404).send(`Customer not found with ID ${vazon}`);
    }

    res.status(200).send("Customer updated successfully with id: " + vazon);
  } catch (error) {
    console.error("Error in PUT /vevo/:vazon:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

vevoRouter.delete("/:vazon", async (req, res) => {
  try {
    const vazon = req.params.vazon;

    if (isNaN(vazon) || vazon <= 0) {
      return res
        .status(400)
        .send("Invalid customer ID (vazon). Must be a positive number");
    }

    const result = await vevoModel.deleteVevo(vazon);

    if (result.affectedRows === 0) {
      return res.status(404).send(`Customer not found with ID ${vazon}`);
    }

    res.status(200).send("Customer deleted successfully with id: " + vazon);
  } catch (error) {
    console.error("Error in DELETE /vevo/:vazon:", error.message);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      res.status(409).send("Cannot delete customer: it has associated orders");
    } else {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});

export default vevoRouter;
