//Importo las dependencias
const express = require("express"),
  pm = require("../dao/db/managers/product_manager");

const routerProducts = express.Router();

//Muestro los productos
routerProducts.get("/", async (req, res) => {
  try {
    const queries = {};

    const limit = Number(req.query.limit) || 2,
      page = Number(req.query.page) || 1,
      sort = Number(req.query.sort) || 0;
    entries = Object.entries(req.query);

    entries.forEach((q) => {
      queries[q[0]] = q[1];
    });
    delete queries.limit;
    delete queries.page;
    delete queries.sort;

    const queryProducts = await pm.getProducts(limit, page, queries, sort);
    res.status(200).send(queryProducts);
  } catch (err) {
    console.log(err);
  }
});

//Muestro el producto con el id específico
routerProducts.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await pm.getProductById(pid);
    res.status(200).send(product);
  } catch (err) {
    console.log(err);
    res.status(404).send("Product not found");
  }
});

//Agrego un producto
routerProducts.post("/", async (req, res) => {
  try {
    await pm.addProduct(req.body);
    res.status(201).send("Product created successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("An error has occurred");
  }
});

//Actualizo un producto
routerProducts.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    await pm.updateProduct(pid, req.body);
    res.status(200).send("Product updated successfully");
  } catch (err) {
    console.log(err);
    res.status(404).send("An error has occurred");
  }
});

//Elimino un producto
routerProducts.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    await pm.deleteProduct(pid);
    res.status(200).send("Product deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(404).send("An error has occurred");
  }
});

//Exporto routerProducts
module.exports = routerProducts;
