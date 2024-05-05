const MessageService = require("../services/message_service.js"),
  CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

const messageService = new MessageService();

class MessageController {
  addMessage = async (req, res) => {
    try {
      const io = require("../app.js");

      if (!req.body) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("addMessage", [req.body]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const message = await messageService.saveMessage(req.body);

      if (message.status) {
        io.sockets.emit("new message", req.body);
        return res.sendCreatedSuccess(req.body);
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("addMessage", message.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      CustomError.handleError(err, res);
    }
  };
}

module.exports = MessageController;
