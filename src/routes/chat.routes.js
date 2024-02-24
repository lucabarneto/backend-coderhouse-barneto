const express = require("express"),
  socket = require("../app.js");

const routerChat = express.Router();

routerChat.get("/realChat", (req, res) => {
  res.render("realChat");
});

routerChat.post("/realChat", async (req, res) => {
  socket.emit("Message", req.body);
  res.status(201).send(req.body);
});

module.exports = routerChat;
