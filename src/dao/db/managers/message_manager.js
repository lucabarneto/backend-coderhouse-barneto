const Message = require("../models/message.model.js");

module.exports = {
  saveMessage: async (body) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!body) {
        throw new Error("Body not provided");
      }

      const message = await Message.create(body);

      return message;
    } catch (err) {
      console.error("An error has occurred: ", err);
    }
  },
};
