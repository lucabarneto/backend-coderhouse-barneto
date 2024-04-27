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

  get = async (data) => {
    try {
      const ticket = await Ticket.find(data);

      if (ticket.length !== 0) {
        return { status: true, payload: ticket[0] };
      } else {
        return { status: false, payload: null };
      }
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = TicketMongo;
