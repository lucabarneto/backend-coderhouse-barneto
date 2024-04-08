const MessageService = require("../dao/db/services/message_service.js");

const messageService = new MessageService();

class MessageController {
  addMessage = async (req, res) => {
    try {
      const io = require("../app.js");

      const message = await messageService.saveMessage(req.body);

      if (message.status) {
        io.sockets.emit("new message", req.body);
        return res.sendCreatedSuccess(req.body);
      } else {
        return res.sendUserError(message.error);
      }
    } catch (err) {
      return res.sendServerError(err);
    }
  };
}

module.exports = MessageController;
