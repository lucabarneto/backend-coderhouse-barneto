//Importo las dependencias
const express = require("express"),
  productManager = require("../product_manager.js");

//Guardo las dependencias en constantes
const routerProducts = express.Router(),
  pm = new productManager();

//Muestro los productos
routerProducts.get("/", async (req, res) => {
  //Recibo los productos
  const products = await pm.getProducts();

  const limit = req.query.limit;

  //Array que se enviará si limit != 0
  const queryProducts = [];

  if (!limit) {
    //Envía todos los productos
    res.status(200).send(products);
  } else {
    //Pushea productos hasta que i = limit
    for (let i = 0; i < limit; i++) {
      queryProducts.push(products[i]);
    }
    res.status(200).send(queryProducts);
  }
});

//Muestro el producto con el id específico
routerProducts.get("/:pid", async (req, res) => {
  const pid = req.params.pid;

  //Encuentro el producto que matchea con el pid
  const requestedProduct = await pm.getProductById(Number(pid));

  if (requestedProduct) {
    res.status(200).send(requestedProduct);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

//Agrego un producto
routerProducts.post("/", async (req, res) => {
  const addedProduct = await pm.addProducts(req.body);

  if (addedProduct) {
    res.status(201).send("Producto creado correctamente");
  } else {
    res.status(400).send("Producto ya existente");
  }
});

//Actualizo un producto
routerProducts.put("/:pid", async (req, res) => {
  const pid = req.params.pid;

  const updatedProduct = await pm.updateProduct(Number(pid), req.body);

  if (updatedProduct) {
    res.status(200).send("Producto actualizado correctamente");
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

//Elimino un producto
routerProducts.delete("/:pid", async (req, res) => {
  const pid = req.params.pid;

  const resultingProducts = await pm.deleteProduct(Number(pid));

  if (resultingProducts) {
    res.status(200).send("Producto eliminado correctamente");
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

//Exporto routerProducts
module.exports = routerProducts;
