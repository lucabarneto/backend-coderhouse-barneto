const express = require("express"),
  routerProducts = require("./routes/products.routes"),
  routerCarts = require("./routes/carts.routes"),
  routerViews = require("./routes/views.routes"),
  routerChat = require("./routes/chat.routes.js"),
  routerSessions = require("./routes/sessions.routes.js"),
  handlebars = require("express-handlebars"),
  http = require("http"),
  { Server } = require("socket.io"),
  Database = require("./dao/db/index.js"),
  session = require("express-session"),
  intilializePassport = require("./config/passport.config.js"),
  passport = require("passport");

const app = express();

const PORT = 8080;

const httpServer = http.createServer(app);

const io = new Server(httpServer);

const SECRET_KEY = "171916265321163164519213115144";

//Configuro handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Configuro carpeta public
app.use(express.static(__dirname + "/public"));

//Configuro middlewares de session
app.use(
  session({
    secret: SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

// Agrego middleware de passport
intilializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/", routerViews);
app.use("/api/chat", routerChat);
app.use("/api/sessions", routerSessions);

//Implemento el socket del lado del server

//Creo el .listen
httpServer.listen(PORT, () => {
  console.log("Server running on port", PORT);
  //Me conecto a la base de datos
  Database.connect();
});

module.exports = io;
