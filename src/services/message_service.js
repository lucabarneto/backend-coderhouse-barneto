const MessageDAO = require("../dao/mongo/message.mongo.js");

const messageDAO = new MessageDAO();

class MessageService {
  constructor() {}

  saveMessage = async (message) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!message) {
        throw new Error("Message not provided");
      }

      const newMessage = await messageDAO.create(message);

      if (newMessage.status) {
        return { status: true, payload: newMessage.payload };
      } else {
        throw new Error(newMessage.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };
}

module.exports = MessageService;
