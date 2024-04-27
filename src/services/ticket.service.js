const TicketDAO = require("../dao/mongo/ticket.mongo");

const ticketDAO = new TicketDAO();

class TicketService {
  constructor() {}

  createTicket = async (data) => {
    try {
      if (!data) throw new Error("Body not provided");
      if (!(data instanceof Object)) throw new Error("Body must be an object");

      let ticket = await ticketDAO.create(data);
      return ticket;
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = TicketService;
