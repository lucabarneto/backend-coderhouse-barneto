const mongoose = require("mongoose");
// USAR CUSTOM ERROR

class MongoConnect {
  static #instance;
  constructor() {
    mongoose.connect(process.env.MONGO_URL).catch((err) => {
      console.log("Cannot connect to database: ", err);
      process.exit();
    });
  }

  static getInstance() {
    if (this.#instance) {
      console.log("Already connected to DB"); // USAR LOGGER
      return this.#instance;
    }

    this.#instance = new MongoConnect();
    console.log("Connected to DB"); // USAR LOGGER
    return this.#instance;
  }
}

module.exports = MongoConnect;
