const express = require("express"),
  routerProducts = require("./routes/products.routes"),
  routerCarts = require("./routes/carts.routes"),
  routerViews = require("./routes/views.routes"),
  routerChat = require("./routes/chat.routes.js"),
  handlebars = require("express-handlebars"),
  http = require("http"),
  { Server } = require("socket.io"),
  Database = require("./dao/db/index.js");

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
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/", routerViews);
app.use("/api/chat", routerChat);

//Implemento el socket del lado del server

//Creo el .listen
httpServer.listen(PORT, () => {
  console.log("Server running on port", PORT);
  //Me conecto a la base de datos
  Database.connect();
});

module.exports = io;
