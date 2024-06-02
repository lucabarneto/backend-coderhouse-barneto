const MessageDAO = require("../dao/mongo/message.mongo.js"),
  ParamValidation = require("../utils/validations.js"),
  CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

const messageDAO = new MessageDAO();

class MessageService {
  constructor() {}

  saveMessage = async (data) => {
    try {
      let { user, message } = data;
      ParamValidation.isProvided(
        "saveMessage",
        ["user", user],
        ["message", message]
      );

      const result = await messageDAO.create(data);
      if (result.status === "error")
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.unhandledDatabase("messageDAO.create", result.error),
          result: "There was an error trying to consult the database",
          code: EErrors.UNHANDLED_DATABASE,
        });

      return result;
    } catch (err) {
      return { status: "error", error: err };
    }
  };
}

module.exports = MessageService;
