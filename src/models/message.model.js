const mongoose = require("mongoose");

const messageCollection = "messages";

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

const MessageModel = mongoose.model(messageCollection, messageSchema);

module.exports = MessageModel;
