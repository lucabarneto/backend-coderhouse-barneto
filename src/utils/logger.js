const Winston = require("winston");

const customLoggerOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "brightRed",
    warning: "yellow",
    info: "blue",
    http: "magenta",
    debug: "grey",
  },
};

Winston.addColors(customLoggerOptions.colors);

const devLogger = Winston.createLogger({
  levels: customLoggerOptions.levels,
  transports: [
    new Winston.transports.Console({
      level: "debug",
      format: Winston.format.combine(
        Winston.format.colorize(customLoggerOptions.colors),
        Winston.format.simple()
      ),
    }),
  ],
});

const prodLogger = Winston.createLogger({
  levels: customLoggerOptions.levels,
  transports: [
    new Winston.transports.Console({
      level: "info",
      format: Winston.format.combine(
        Winston.format.colorize(customLoggerOptions.colors),
        Winston.format.simple()
      ),
    }),
    new Winston.transports.File({
      level: "error",
      filename: "./errors.log",
      format: Winston.format.simple(),
    }),
  ],
});

module.exports = { devLogger, prodLogger };
