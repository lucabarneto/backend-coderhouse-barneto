const TicketDAO = require("../dao/mongo/ticket.mongo");

const ticketDAO = new TicketDAO();

class TicketService {
  constructor() {}

  createTicket = async (data) => {
    try {
      let ticket = await ticketDAO.create(data);
      return ticket;
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = TicketService;
