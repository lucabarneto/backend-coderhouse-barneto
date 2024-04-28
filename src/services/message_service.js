const MessageDAO = require("../dao/mongo/message.mongo.js");

const messageDAO = new MessageDAO();

class MessageService {
  constructor() {}

  saveMessage = async (data) => {
    try {
      const message = await messageDAO.create(data);
      return message;
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = MessageService;
