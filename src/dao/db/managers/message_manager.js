const Message = require("../models/message.model.js");

module.exports = {
  saveMessage: async (body) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!body) {
        throw new Error("Body not provided");
      }

      const message = await Message.create(body);

      return { status: true, payload: message, error: null };
    } catch (err) {
      console.error(err);
      return { status: false, payload: null, error: err };
    }
  },
};
