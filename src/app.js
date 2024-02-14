const express = require("express"),
  routerProducts = require("./routes/products.routes"),
  routerCarts = require("./routes/carts.routes"),
  routerViews = require("./routes/views.routes"),
  handlebars = require("express-handlebars"),
  productModel = require("./dao/db/models/product.model.js"),
  messageModel = require("./dao/db/models/message.model.js"),
  productManager = require("./dao/fs/product_manager"),
  http = require("http"),
  { Server } = require("socket.io"),
  Database = require("./dao/db/index.js");

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

let users = [];

let chat = [];

let connections = 0;

//Implemento el socket del lado del server
io.on("connection", (socket) => {
  console.log("New user connected");
  connections++;

  //::RealTimeProducts View::
  // Añado producto
  socket.on("addProduct", async (data) => {
    await productModel.create(data);

    socket.emit("updatedAddProducts", await productModel.find());
  });

  //Elimino producto
  socket.on("delProduct", async (data) => {
    await productModel.deleteOne(data);

    socket.emit("updatedDelProducts", await productModel.find());
  });
});

//Creo el .listen
httpServer.listen(PORT, () => {
  console.log("Server running on port", PORT);
  //Me conecto a la base de datos
  Database.connect();
});
