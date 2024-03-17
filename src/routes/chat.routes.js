const express = require("express"),
  MessageManager = require("../dao/db/managers/message_manager.js");

const routerChat = express.Router(),
  messageManager = new MessageManager();

routerChat.post("/", async (req, res) => {
  try {
    const io = require("../app.js");

    const message = await messageManager.saveMessage(req.body);

    if (message.status) {
      io.sockets.emit("new message", req.body);
      res.status(201).send(req.body);
    } else {
      throw new Error(message.error);
    }
  } catch (err) {
    res.status(400).send("An error has occurred: " + err);
  }
});

module.exports = routerChat;
