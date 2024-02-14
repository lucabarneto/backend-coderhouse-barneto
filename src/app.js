const express = require("express"),
  routerProducts = require("./routes/products.routes"),
  routerCarts = require("./routes/carts.routes"),
  routerViews = require("./routes/views.routes"),
  handlebars = require("express-handlebars"),
  productManager = require("./product_manager"),
  http = require("http"),
  { Server } = require("socket.io");

const pm = new productManager();

const app = express();

const PORT = 8080;

const httpServer = http.createServer(app);

const io = new Server(httpServer);

//Configuro handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Configuro carpeta public
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/", routerViews);

//Implemento el socket del lado del server
io.on("connection", (socket) => {
  console.log("New user connected");

  // Añado producto
  socket.on("addProduct", async (data) => {
    await pm.addProducts(data);

    socket.emit("updatedAddProducts", await pm.getProducts());
  });

  //Elimino producto
  socket.on("delProduct", async (data) => {
    await pm.deleteProduct(data);

    socket.emit("updatedDelProducts", await pm.getProducts());
  });
});

//Creo el .listen
httpServer.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
