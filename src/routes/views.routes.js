//Importo las dependencias
const express = require("express"),
  productModel = require("../dao/db/models/product.model.js");

//Guardo las dependencias en constantes
const routerViews = express.Router();

routerViews.get("/", async (req, res) => {
  try {
    const products = await productModel.find();
    res.render("home", {
      products: products,
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Page not found");
  }
});

routerViews.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productModel.find();
    res.render("realTimeProducts", {
      products: products,
    });
  } catch (err) {
    console.log(err);
    res.status(404).send("Page not found");
  }
});

routerViews.get("/chat", (req, res) => {
  res.render("chat");
});

// exporto routerViews
module.exports = routerViews;
