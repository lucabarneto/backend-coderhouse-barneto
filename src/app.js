const express = require("express"),
  ProductRouter = require("./routes/products.routes"),
  CartRouter = require("./routes/carts.routes"),
  ViewRouter = require("./routes/views.routes"),
  MessageRouter = require("./routes/chat.routes.js"),
  SessionRouter = require("./routes/sessions.routes.js"),
  PerformanceRouter = require("./routes/performance.routes.js"),
  http = require("http"),
  { Server } = require("socket.io"),
  Database = require("./config/mongo_connection.config.js"),
  cookieparser = require("cookie-parser"),
  intilializePassport = require("./config/passport.config.js"),
  { create } = require("express-handlebars"),
  passport = require("passport"),
  config = require("./config/config.js"),
  compression = require("express-compression"),
  addLogger = require("./middleware/logger.js"),
  swaggerUIExpress = require("swagger-ui-express"),
  swaggerSpecs = require("./config/swagger.config.js");

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer);

const productRouter = new ProductRouter(),
  cartRouter = new CartRouter(),
  sessionRouter = new SessionRouter(),
  viewRouter = new ViewRouter(),
  messageRouter = new MessageRouter(),
  performanceRouter = new PerformanceRouter();

//Configuro Logger
app.use(addLogger);

//Configuro handlebars
const handlebars = create({
  helpers: {
    ifEqual(arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
  },
});

app.engine("handlebars", handlebars.engine);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Configuro carpeta public
app.use(express.static(__dirname + "/public"));

// Configuro documentación con Swagger
app.use(
  "/apidocs",
  swaggerUIExpress.serve,
  swaggerUIExpress.setup(swaggerSpecs)
);

//Configuro middlewares de cookies
app.use(cookieparser()); // AGREGAR SECRETO

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
app.use("/api/performance", performanceRouter.getRouter);

//Creo el .listen
httpServer.listen(Number(config.port), () => {
  console.log(`Working on ${config.mode.toUpperCase()} environment`);
  console.log("Server running on port", config.port);
  //Me conecto a la base de datos
  Database.getInstance();
});

module.exports = io;
