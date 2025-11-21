import express from "express";
import * as pizzaModel from "../model/pizzaModel.js";

const pizzaRouter = express.Router();

pizzaRouter.get("/", async (req, res) => {
  try {
    const pizzas = await pizzaModel.getAllPizzas();
    res.status(200).send(pizzas);
  } catch (error) {
    console.error("Error in GET /pizza:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

pizzaRouter.get("/:pazon", async (req, res) => {
  try {
    const pazon = req.params.pazon;

    if (isNaN(pazon) || pazon <= 0) {
      return res
        .status(400)
        .send("Invalid pizza ID (pazon). Must be a positive number");
    }

    const pizza = await pizzaModel.getPizzaById(pazon);
    if (pizza) {
      res.status(200).send(pizza);
    } else {
      res.status(404).send(`Pizza not found with ID ${pazon}`);
    }
  } catch (error) {
    console.error("Error in GET /pizza/:pazon:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

pizzaRouter.post("/", async (req, res) => {
  try {
    const pizzaData = req.body;

    if (!pizzaData || Object.keys(pizzaData).length === 0) {
      return res.status(400).send("Request body is empty or invalid");
    }

    const missingFields = [];
    if (!pizzaData.pnev) missingFields.push("pnev");
    if (pizzaData.par === undefined || pizzaData.par === null)
      missingFields.push("par");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .send(`Missing required fields: ${missingFields.join(", ")}`);
    }

    if (pizzaData.pnev.trim().length < 3) {
      return res
        .status(400)
        .send("Field pnev must be at least 3 characters long");
    }

    if (isNaN(pizzaData.par) || pizzaData.par < 100) {
      return res
        .status(400)
        .send("Field par must be a positive number greater than 100");
    }

    const result = await pizzaModel.createPizza(pizzaData);
    res
      .status(201)
      .send("Pizza created successfully with id: " + result.insertId);
  } catch (error) {
    console.error("Error in POST /pizza:", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).send("Pizza with this name already exists");
    } else {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});

pizzaRouter.put("/:pazon", async (req, res) => {
  try {
    const pazon = req.params.pazon;
    const pizzaData = req.body;

    if (isNaN(pazon) || pazon <= 0) {
      return res
        .status(400)
        .send("Invalid pizza ID (pazon). Must be a positive number");
    }

    if (!pizzaData || Object.keys(pizzaData).length === 0) {
      return res.status(400).send("Request body is empty or invalid");
    }

    if (pizzaData.pnev !== undefined && pizzaData.pnev.trim().length < 3) {
      return res
        .status(400)
        .send("Field pnev must be at least 3 characters long");
    }

    if (
      pizzaData.par !== undefined &&
      (isNaN(pizzaData.par) || pizzaData.par < 100)
    ) {
      return res
        .status(400)
        .send("Field par must be a positive number greater than 100");
    }

    const result = await pizzaModel.updatePizza(pazon, pizzaData);

    if (result.affectedRows === 0) {
      return res.status(404).send(`Pizza not found with ID ${pazon}`);
    }

    res.status(200).send("Pizza updated successfully with id: " + pazon);
  } catch (error) {
    console.error("Error in PUT /pizza/:pazon:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

pizzaRouter.delete("/:pazon", async (req, res) => {
  try {
    const pazon = req.params.pazon;

    if (isNaN(pazon) || pazon <= 0) {
      return res
        .status(400)
        .send("Invalid pizza ID (pazon). Must be a positive number");
    }

    const result = await pizzaModel.deletePizza(pazon);

    if (result.affectedRows === 0) {
      return res.status(404).send(`Pizza not found with ID ${pazon}`);
    }

    res.status(200).send("Pizza deleted successfully with id: " + pazon);
  } catch (error) {
    console.error("Error in DELETE /pizza/:pazon:", error.message);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      res
        .status(409)
        .send("Cannot delete pizza: it has associated order items");
    } else {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
});

export default pizzaRouter;
