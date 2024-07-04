const { devLogger, prodLogger } = require("../utils/logger.js");

const addLogger = (req, res, next) => {
  process.env.MODE === "development"
    ? (req.logger = devLogger)
    : (req.logger = prodLogger);

  next();
};

module.exports = addLogger;
