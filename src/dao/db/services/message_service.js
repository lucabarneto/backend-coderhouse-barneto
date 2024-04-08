const Message = require("../models/message.model.js");

class MessageService {
  constructor() {}

  saveMessage = async (message) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!message) {
        throw new Error("Message not provided");
      }

      const newMessage = await Message.create(message);

      return { status: true, payload: newMessage };
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
    }
  };
}

module.exports = MessageService;
