//Importo las dependencias
const express = require("express"),
  productModel = require("../dao/db/models/product.model.js");

const routerProducts = express.Router();

//Muestro los productos
routerProducts.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit);

    if (!limit) {
      //Envía todos los productos
      const products = await productModel.find();
      res.status(200).send(products);
    } else {
      const queryProducts = await productModel.find().limit(limit);
      res.status(200).send(queryProducts);
    }
  } catch (err) {
    console.log(err);
  }
});

//Muestro el producto con el id específico
routerProducts.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productModel.findById(pid);
    res.status(200).send(product);
  } catch (err) {
    console.log(err);
    console.log("Product not found");
    res.status(404).send("Product not found");
  }
});

//Agrego un producto
routerProducts.post("/", async (req, res) => {
  try {
    await productModel.create(req.body);
    res.status(201).send("Product created succesfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("An error ocurred");
  }
});

//Actualizo un producto
routerProducts.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    await productModel.updateOne({ _id: pid }, req.body);
    res.status(200).send("Product updated sucesfully");
  } catch (err) {
    console.log(err);
    res.status(404).send("An error ocurred");
  }
});

//Elimino un producto
routerProducts.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    await productModel.deleteOne({ _id: pid });
    res.status(200).send("Product deleted sucesfully");
  } catch (err) {
    console.log(err);
    res.status(404).send("An error ocurred");
  }
});

//Exporto routerProducts
module.exports = routerProducts;
