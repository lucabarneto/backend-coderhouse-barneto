const express = require("express"),
  routerProducts = require("./routes/products.routes"),
  routerCarts = require("./routes/carts.routes");

const app = express();

const PORT = 8080;

//Creo el .listen
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

app.use(express.json());
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

//Mensaje que se ve en la página principal
app.get("/", (req, res) => {
  res.send("Bienvenidos a la página principal");
});
