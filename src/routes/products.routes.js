//Importo las dependencias
const express = require("express"),
  productManager = require("../dao/db/managers/product_manager");

const routerProducts = express.Router();

//Muestro los productos
routerProducts.get("/", async (req, res) => {
  try {
    let limit = req.query.limit,
      page = req.query.page,
      sort = req.query.sort,
      queries = req.query;

    const queryProducts = await productManager.getProducts(
      limit,
      page,
      sort,
      queries
    );

    if (queryProducts.status) {
      res.status(200).send(queryProducts.payload);
    } else {
      throw new Error(queryProducts.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Muestro el producto con el id específico
routerProducts.get("/:pid", async (req, res) => {
  try {
    let pid = req.params.pid;
    const product = await productManager.getProductById(pid);

    if (product.status) {
      res.status(200).send(product.payload);
    } else {
      throw new Error(product.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Agrego un producto
routerProducts.post("/", async (req, res) => {
  try {
    const product = await productManager.addProduct(req.body);

    if (product.status) {
      res.status(201).send("Product created successfully");
    } else {
      throw new Error(product.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Actualizo un producto
routerProducts.put("/:pid", async (req, res) => {
  try {
    let pid = req.params.pid;

    const product = await productManager.updateProduct(pid, req.body);
    if (product.status) {
      res.status(201).send("Product updated successfully");
    } else {
      throw new Error(product.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Elimino un producto
routerProducts.delete("/:pid", async (req, res) => {
  try {
    let pid = req.params.pid;
    const product = await productManager.deleteProduct(pid);

    if (product.status) {
      res.status(200).send("Product deleted successfully");
    } else {
      throw new Error(product.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

//Exporto routerProducts
module.exports = routerProducts;
