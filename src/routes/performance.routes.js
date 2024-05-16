const Router = require("./custom_router.js"),
  PerformanceController = require("../controllers/performance_controller.js");

const performanceController = new PerformanceController();

class PerformanceRouter extends Router {
  init() {
    this.get("/loggertest", ["PUBLIC"], performanceController.testLogs);
  }
}

module.exports = PerformanceRouter;
