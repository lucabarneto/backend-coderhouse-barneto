const express = require("express"),
  ProductManager = require("./product_manager.js");

const product = new ProductManager();

const PORT = 8080;

const app = express();

//Creo el .listen
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

//Mensaje que se ve en la página principal
app.get("/", (req, res) => {
  res.send("Bienvenidos a la página principal");
});

app.get("/products", async (req, res) => {
  //Recibo los productos
  const products = await product.getProducts();

  const limit = req.query.limit;
  console.log(limit);

  //Array que se enviará si limit != 0
  const queryProducts = [];

  if (!limit) {
    //Envía todos los productos
    res.send(products);
  } else {
    //Pushea productos hasta que i = limit
    for (let i = 0; i < limit; i++) {
      queryProducts.push(products[i]);
    }
    res.send(queryProducts);
  }
});

app.get("/product/:pid", async (req, res) => {
  //Recibo los productos
  const pid = req.params.pid;

  //Encuentro el producto que matchea con el pid
  const requestedProduct = await product.getProductById(Number(pid));

  res.send(requestedProduct);
});
