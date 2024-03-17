const jwt = require("../utils/jwt.js");

const auth = (req, res, next) => {
  try {
    let tokenHeader = req.headers["authorization"];
    if (!tokenHeader) {
      throw new Error("Unauthenticated user");
    }

    let token = tokenHeader.split(" ")[1];

    let user = jwt.validateToken(token);
    if (!user) {
      throw new Error("Invalid Token");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(400).send("An error has occurred: " + err);
  }
};

module.exports = auth;
