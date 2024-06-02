const { devLogger, prodLogger } = require("../utils/logger.js"),
  config = require("../config/config.js");

const addLogger = (req, res, next) => {
  config.mode === "development"
    ? (req.logger = devLogger)
    : (req.logger = prodLogger);

  next();
};

module.exports = addLogger;
