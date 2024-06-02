const mongoose = require("mongoose");

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    match: /^(?!0)\d{4,5}$/,
  },
  purchase_datetime: {
    type: Date,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
    match: /^(?!0)\d+$/,
  },
  purchaser: {
    type: String,
    require: true,
    match:
      /^(([a-zñ\d]+(.[_a-zñ\d]+)*@[a-zñ\d-]+(.[a-zñ\d-]+)*(.[a-zñ]{2,15}))|(https:\/\/github\.com\/[a-z\d]+))$/i,
  },
});

const TicketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = TicketModel;
