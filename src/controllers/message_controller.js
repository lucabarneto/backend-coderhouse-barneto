const MessageService = require("../services/message_service.js"),
  CustomError = require("../services/errors/custom_error.js");

const messageService = new MessageService();

class MessageController {
  addMessage = async (req, res) => {
    try {
      const io = require("../app.js");

      const message = await messageService.saveMessage(req.body);

      if (message.status === "success") {
        io.sockets.emit("new message", req.body);
        return res.sendCreatedSuccess(req.body);
      } else {
        throw message.error;
      }
    } catch (err) {
      CustomError.handleError(err, req, res);
    }
  };
}

module.exports = MessageController;
