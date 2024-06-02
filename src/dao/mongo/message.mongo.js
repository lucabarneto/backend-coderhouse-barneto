const Message = require("../../models/message.model");

class MessageMongo {
  constructor() {}

  create = async (data) => {
    try {
      const message = await Message.create(data);
      return { status: "success", payload: message };
    } catch (err) {
      return { status: "error", error: err.message };
    }
  };
}

module.exports = MessageMongo;
