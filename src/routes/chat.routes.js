const Router = require("./custom_router.js"),
  MessageController = require("../controllers/message_controller.js");

const messageController = new MessageController();

class MessageRouter extends Router {
  init() {
    this.post("/", ["PUBLIC"], messageController.addMessage);
  }
}

module.exports = MessageRouter;
