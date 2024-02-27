const messageModel = require("../models/message.model.js");

module.exports = {
  saveMessage: async (body) => {
    try {
      const message = await messageModel.create(body);

      return message;
    } catch (err) {
      console.log("An error has occurred: ", err);
    }
  },
};
