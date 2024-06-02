const TicketDAO = require("../dao/mongo/ticket.mongo"),
  ParamValidation = require("../utils/validations.js"),
  CustomError = require("../services/errors/custom_error.js"),
  EErrors = require("../services/errors/enum_error.js"),
  infoError = require("../services/errors/info_error.js");

const ticketDAO = new TicketDAO();

class TicketService {
  constructor() {}

  createTicket = async (ticket) => {
    try {
      let { code, purchase_datetime, amount, purchaser } = ticket;

      ParamValidation.isProvided(
        "createTicket",
        ["code", code],
        ["purchase_datetime", purchase_datetime],
        ["amount", amount],
        ["purchaser", purchaser]
      );

      ParamValidation.validatePattern("createTicket", /^(?!0)\d{4,5}$/, [
        ["code", code],
      ]);
      ParamValidation.validatePattern("createTicket", /^(?!0)\d+$/, [
        ["amount", amount],
      ]);
      ParamValidation.validatePattern(
        "createTicket",
        /^(([a-zñ\d]+(.[_a-zñ\d]+)*@[a-zñ\d-]+(.[a-zñ\d-]+)*(.[a-zñ]{2,15}))|(https:\/\/github\.com\/[a-z\d]+))$/i,
        [["purchaser", purchaser]]
      );

      const result = await ticketDAO.create(ticket);
      if (result.status === "error")
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.unhandledDatabase("ticketDAO.create", result.error),
          message: "There was an error trying to consult the database",
          code: EErrors.UNHANDLED_DATABASE,
        });

      return result;
    } catch (err) {
      return { status: "error", error: err };
    }
  };

  getTicketById = async (tid) => {
    try {
      ParamValidation.isProvided("getTicketById", ["tid", tid]);
      ParamValidation.validatePattern("getTicketById", /^[a-f\d]{24}$/i, [
        ["tid", tid],
      ]);

      const result = await ticketDAO.getById(tid);
      if (result.status === "error")
        CustomError.createCustomError({
          name: "Not Found Error",
          cause: infoError.idNotFound(tid, "tickets"),
          message: "There was an error while searching for the given id",
          code: EErrors.NOT_FOUND,
        });

      return result;
    } catch (err) {
      return { status: "error", error: err };
    }
  };
}

module.exports = TicketService;
