const mongoose = require("mongoose");

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
  },
  purchaser: {
    type: String,
    require: true,
  },
});

const TicketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = TicketModel;
