const Message = require("../../models/message.model");

class MessageMongo {
  constructor() {}

  create = async (message) => {
    try {
      const created = await Message.create(message);
      return { status: true, payload: created };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };
}

module.exports = MessageMongo;
