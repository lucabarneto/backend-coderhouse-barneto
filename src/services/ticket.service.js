const TicketDAO = require("../dao/mongo/ticket.mongo"),
  CustomError = require("../services/errors/custom_error.js"),
  EErrors = require("../services/errors/enum_error.js"),
  infoError = require("../services/errors/info_error.js");

const ticketDAO = new TicketDAO();

class TicketService {
  constructor() {}

  createTicket = async (data) => {
    try {
      if (!data) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo("Ticket", "createTicket", [
            data,
          ]),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const ticket = await ticketDAO.create(data);
      if (ticket.status) {
        return ticket;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("createTicket", ticket.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };

  getTicketById = async (data) => {
    try {
      if (!data) {
        CustomError.createCustomError({
          name: "Param not provided",
          cause: infoError.notProvidedParamErrorInfo(
            "Ticket",
            "getTicketById",
            [data]
          ),
          message: "There was an error reading certain parameters",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }

      const ticket = await ticketDAO.getById(data);
      if (ticket.status) {
        return ticket;
      } else {
        CustomError.createCustomError({
          name: "Database error",
          cause: infoError.databaseErrorInfo("getTicketById", ticket.error),
          message: "There was an error trying to consult the database",
          code: EErrors.DATABASE_ERROR,
        });
      }
    } catch (err) {
      return { status: false, error: err };
    }
  };
}

module.exports = TicketService;
