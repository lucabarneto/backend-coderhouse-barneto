const express = require("express"),
  mm = require("../dao/db/managers/message_manager.js");

const routerChat = express.Router();

routerChat.post("/", async (req, res) => {
  const io = require("../app.js");

  console.log(req.body);

  // await mm.saveMessage(req.body);

  io.sockets.emit("new message", req.body);
  res.status(201).send(req.body);
});

module.exports = routerChat;
