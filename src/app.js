const express = require("express"),
  routerProducts = require("./routes/products.routes"),
  routerCarts = require("./routes/carts.routes"),
  routerViews = require("./routes/views.routes"),
  handlebars = require("express-handlebars"),
  http = require("http"),
  { Server } = require("socket.io");

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

//Implemento socket
io.on("connection", (socket) => {
  console.log("New user connected");
});

//Creo el .listen
httpServer.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
