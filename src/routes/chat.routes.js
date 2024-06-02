const Router = require("./custom_router.js"),
  MessageController = require("../controllers/message_controller.js"),
  authenticate = require("../middleware/authentication.js"),
  authorize = require("../middleware/authorization.js");

const messageController = new MessageController();

class MessageRouter extends Router {
  init() {
    this.post(
      "/",
      ["USER", "ADMIN", "PREMIUM"],
      authenticate("jwt", { session: false }),
      authorize,
      messageController.addMessage
    );
  }
}

module.exports = MessageRouter;
