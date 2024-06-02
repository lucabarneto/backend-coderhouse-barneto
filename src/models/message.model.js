const mongoose = require("mongoose");

const MESSAGE_COLLECTION = "messages";

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});

const MessageModel = mongoose.model(MESSAGE_COLLECTION, messageSchema);

module.exports = MessageModel;
