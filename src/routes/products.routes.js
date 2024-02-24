//Importo las dependencias
const express = require("express"),
  pm = require("../dao/db/product_manager");

const routerProducts = express.Router();

//Muestro los productos
routerProducts.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit);

    if (!limit) {
      //Envía todos los productos
      const products = await pm.getProducts();
      res.status(200).send(products);
    } else {
      const queryProducts = await pm.getProducts(null, limit);
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
