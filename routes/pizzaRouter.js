import express from "express";
import * as pizzaModel from "../model/pizzaModel.js";

const pizzaRouter = express.Router();

pizzaRouter.get("/", async (req, res) => {
  try {
    const pizzas = await pizzaModel.getAllPizzas();
    res.status(201).send(pizzas);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

pizzaRouter.get("/:razon", async (req, res) => {
  try {
    const id = req.params.id;
    const pizza = await pizzaModel.getPizzaById(id);
    if (pizza) {
      res.status(201).send(pizza);
    } else {
      res.status(404).send("Pizza not found");
    }
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

pizzaRouter.post("/", async (req, res) => {
  try {
    const pizzaData = req.body;
    const result = await pizzaModel.createPizza(pizzaData);
    res
      .status(201)
      .send("Pizza created successfully with id: " + result.insertId);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

pizzaRouter.put("/:razon", async (req, res) => {
  try {
    const id = req.params.id;
    const pizzaData = req.body;
    const result = await pizzaModel.updatePizza(id, pizzaData);
    res.status(201).send("Pizza updated successfully with id: " + id);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

pizzaRouter.delete("/:razon", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pizzaModel.deletePizza(id);
    if (result.affectedRows === 0) {
      return res.status(404).send("Pizza not found");
    } else {
      res.status(201).send("Pizza deleted successfully with id: " + id);
    }
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
});

export default pizzaRouter;
