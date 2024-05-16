const { devLogger, prodLogger } = require("../utils/logger.js"),
  config = require("../config/config.js");

const addLogger = (req, res, next) => {
  if (config.mode === "development") {
    req.logger = devLogger;
  } else {
    req.logger = prodLogger;
  }
  next();
};

module.exports = addLogger;
