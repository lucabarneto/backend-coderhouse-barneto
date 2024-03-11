//Importo las dependencias
const express = require("express"),
  productManager = require("../dao/db/managers/product_manager");

const routerProducts = express.Router();

//Muestro los productos
routerProducts.get("/", async (req, res) => {
  try {
    //Verifico que las queries sean del tipo de dato correcto y que sort sea del número correcto
    if (req.query.limit) {
      if (isNaN(req.query.limit)) {
        throw new TypeError("Limit must be a number");
      }
    }
    if (req.query.page) {
      if (isNaN(req.query.page)) {
        throw new TypeError("Page must be a number");
      }
    }
    if (req.query.sort) {
      if (isNaN(req.query.sort)) {
        throw new TypeError("Sort must be a number");
      }
      if (req.query.sort !== "1" && req.query.sort !== "-1") {
        throw new Error("Sort must be either 1 or -1");
      }
    }

    const queries = {};

    let limit = parseInt(req.query.limit) || 10,
      page = parseInt(req.query.page) || 1,
      sort = parseInt(req.query.sort) || 0,
      entries = Object.entries(req.query);

    //Dejo en el objeto queries las propiedades que van como filtro en la paginación
    entries.forEach((q) => {
      queries[q[0]] = q[1];
    });
    delete queries.limit;
    delete queries.page;
    delete queries.sort;

    const queryProducts = await productManager.getProducts(
      limit,
      page,
      sort,
      queries
    );

    //Valido que el valor de page exista dentro de los valores de la paginación
    if (page > Math.ceil(queryProducts.products.length / limit)) {
      throw new RangeError("Page doesn't exist");
    }

    res.status(200).send(queryProducts.paginated);
  } catch (err) {
    console.error("An error has occurred: ", err);
    res.status(400).send(`An error has occurred: ${err}`);
  }
});

//Muestro el producto con el id específico
routerProducts.get("/:pid", async (req, res) => {
  try {
    let pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    res.status(200).send(product);
  } catch (err) {
    console.log(err);
    res.status(404).send("Product not found");
  }
});

//Agrego un producto
routerProducts.post("/", async (req, res) => {
  try {
    await productManager.addProduct(req.body);
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
    await productManager.updateProduct(pid, req.body);
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
    await productManager.deleteProduct(pid);
    res.status(200).send("Product deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(404).send("An error has occurred");
  }
});

//Exporto routerProducts
module.exports = routerProducts;
