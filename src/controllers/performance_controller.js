class PerformanceController {
  constructor() {}

  testLogs = async (req, res) => {
    req.logger.warning(
      `${req.method} en modo "${
        process.env.MODE
      }" - ${new Date().toLocaleString()}`
    );
    req.logger.error(
      `${req.method} en modo "${
        process.env.MODE
      }" - ${new Date().toLocaleString()}`
    );
    req.logger.http(
      `${req.method} en modo "${
        process.env.MODE
      }" - ${new Date().toLocaleString()}`
    );
    req.logger.fatal(
      `${req.method} en modo "${
        process.env.MODE
      }" - ${new Date().toLocaleString()}`
    );

    res.send("Testing Logger!");
  };
}

module.exports = PerformanceController;
