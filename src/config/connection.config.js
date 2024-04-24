const mongoose = require("mongoose"),
  config = require("./config.js");

class MongoConnect {
  static #instance;
  constructor() {
    mongoose.connect(config.mongoUrl).catch((err) => {
      console.log("Cannot connect to database: ", err);
      process.exit();
    });
  }

  static getInstance() {
    if (this.#instance) {
      console.log("Already connected to DB");
      return this.#instance;
    }

    this.#instance = new MongoConnect();
    console.log("Connected to DB");
    return this.#instance;
  }
}

module.exports = MongoConnect;
