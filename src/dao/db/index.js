const mongoose = require("mongoose");

module.exports = {
  connect: () => {
    mongoose
      .connect(
        "mongodb+srv://lucabarneto:Aa4121121205@database-coderhouse-bar.vlphwq8.mongodb.net/eccomerce"
      )
      .then(() => {
        console.log("Connected to database");
      })
      .catch((err) => {
        console.log("Cannot connect to database: ", err);
        process.exit();
      });
  },
};
