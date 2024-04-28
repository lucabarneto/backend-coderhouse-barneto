const Message = require("../../models/message.model");

class MessageMongo {
  constructor() {}

  create = async (data) => {
    try {
      const message = await Message.create(data);
      return { status: true, payload: message };
    } catch (err) {
      return { status: false, error: err.message };
    }
  };
}

module.exports = MessageMongo;
