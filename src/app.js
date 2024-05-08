const express = require("express"),
  ProductRouter = require("./routes/products.routes"),
  CartRouter = require("./routes/carts.routes"),
  ViewRouter = require("./routes/views.routes"),
  MessageRouter = require("./routes/chat.routes.js"),
  SessionRouter = require("./routes/sessions.routes.js"),
  http = require("http"),
  { Server } = require("socket.io"),
  Database = require("./config/connection.config.js"),
  cookieparser = require("cookie-parser"),
  intilializePassport = require("./config/passport.config.js"),
  handlebars = require("express-handlebars"),
  passport = require("passport"),
  config = require("./config/config.js"),
  compression = require("express-compression");

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer);

const productRouter = new ProductRouter(),
  cartRouter = new CartRouter(),
  sessionRouter = new SessionRouter(),
  viewRouter = new ViewRouter(),
  messageRouter = new MessageRouter();

//Configuro handlebars
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    extname: "handlebars",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Configuro carpeta public
app.use(express.static(__dirname + "/public"));

//Configuro middlewares de cookies
app.use(cookieparser());

// Agrego middleware de passport
intilializePassport();
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use("/api/products", productRouter.getRouter);
app.use("/api/carts", cartRouter.getRouter);
app.use("/", viewRouter.getRouter);
app.use("/api/chat", messageRouter.getRouter);
app.use("/api/sessions", sessionRouter.getRouter);

//Implemento el socket del lado del server

//Creo el .listen
httpServer.listen(Number(config.port), () => {
  console.log("Server running on port", config.port);
  //Me conecto a la base de datos
  Database.getInstance();
});

module.exports = io;
