const Ticket = require("../../models/ticket.model.js");

class TicketMongo {
  constructor() {}

  create = async (data) => {
    try {
      let ticket = await Ticket.create(data);
      return { status: true, payload: ticket };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };

  getById = async (data) => {
    try {
      const ticket = await Ticket.findById(data);

      if (ticket.length !== 0) {
        return { status: true, payload: ticket };
      } else {
        return { status: false, payload: null };
      }
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = TicketMongo;
