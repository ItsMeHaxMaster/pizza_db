import express from "express";
import * as futarModel from "../model/futarModel.js";

const futarRouter = express.Router();

futarRouter.get("/", async (req, res) => {
  try {
    const futars = await futarModel.getAllFutars();
    res.status(200).send(futars);
  } catch (error) {
    console.error("Error in GET /futar:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

futarRouter.get("/:fazon", async (req, res) => {
  try {
    const fazon = req.params.fazon;

    if (isNaN(fazon) || fazon <= 0) {
      return res
        .status(400)
        .send("Invalid carrier ID (fazon). Must be a positive number");
    }

    const futar = await futarModel.getFutarById(fazon);
    if (futar) {
      res.status(200).send(futar);
    } else {
      res.status(404).send(`Carrier not found with ID ${fazon}`);
    }
  } catch (error) {
    console.error("Error in GET /futar/:fazon:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

futarRouter.post("/", async (req, res) => {
  try {
    const futarData = req.body;

    if (!futarData || Object.keys(futarData).length === 0) {
      return res.status(400).send("Request body is empty or invalid");
    }

    const missingFields = [];
    if (!futarData.fnev) missingFields.push("fnev");
    if (!futarData.ftel) missingFields.push("ftel");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .send(`Missing required fields: ${missingFields.join(", ")}`);
    }

    if (futarData.fnev.trim().length < 3) {
      return res
        .status(400)
        .send("Field fnev must be at least 3 characters long");
    }

    if (futarData.ftel.trim().length === 0) {
      return res.status(400).send("Field ftel cannot be empty");
    }

    const result = await futarModel.createFutar(futarData);
    res
      .status(201)
      .send("Carrier created successfully with id: " + result.insertId);
  } catch (error) {
    console.error("Error in POST /futar:", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).send("Carrier with this information already exists");
    } else {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});

futarRouter.put("/:fazon", async (req, res) => {
  try {
    const fazon = req.params.fazon;
    const futarData = req.body;

    if (isNaN(fazon) || fazon <= 0) {
      return res
        .status(400)
        .send("Invalid carrier ID (fazon). Must be a positive number");
    }

    if (!futarData || Object.keys(futarData).length === 0) {
      return res.status(400).send("Request body is empty or invalid");
    }

    if (futarData.fnev !== undefined && futarData.fnev.trim().length < 3) {
      return res
        .status(400)
        .send("Field fnev must be at least 3 characters long");
    }

    if (futarData.ftel !== undefined && futarData.ftel.trim().length === 0) {
      return res.status(400).send("Field ftel cannot be empty");
    }

    const result = await futarModel.updateFutar(fazon, futarData);

    if (result.affectedRows === 0) {
      return res.status(404).send(`Carrier not found with ID ${fazon}`);
    }

    res.status(200).send("Carrier updated successfully with id: " + fazon);
  } catch (error) {
    console.error("Error in PUT /futar/:fazon:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

futarRouter.delete("/:fazon", async (req, res) => {
  try {
    const fazon = req.params.fazon;

    if (isNaN(fazon) || fazon <= 0) {
      return res
        .status(400)
        .send("Invalid carrier ID (fazon). Must be a positive number");
    }

    const result = await futarModel.deleteFutar(fazon);

    if (result.affectedRows === 0) {
      return res.status(404).send(`Carrier not found with ID ${fazon}`);
    }

    res.status(200).send("Carrier deleted successfully with id: " + fazon);
  } catch (error) {
    console.error("Error in DELETE /futar/:fazon:", error.message);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      res.status(409).send("Cannot delete carrier: it has associated orders");
    } else {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});

export default futarRouter;
