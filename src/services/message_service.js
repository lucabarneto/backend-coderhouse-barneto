const MessageDAO = require("../dao/mongo/message.mongo.js"),
  CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

const messageDAO = new MessageDAO();

class MessageService {
  constructor() {}

  saveMessage = async (data) => {
    try {
      if (!data) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("Message", "addMessage", [
            data,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const message = await messageDAO.create(data);

      if (message.status) {
        return message;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("saveMessage", message.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };
}

module.exports = MessageService;
