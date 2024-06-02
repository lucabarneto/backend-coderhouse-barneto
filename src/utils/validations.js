const CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

class ParamValidation {
  constructor() {}

  static isProvided(method, ...params) {
    params.forEach((param) => {
      if (!param[1])
        CustomError.createCustomError({
          name: "Unprovided parameter Error",
          cause: infoError.unprovidedParam(method, param[0]),
          message: "One or more parameters were not provided",
          code: EErrors.UNPROVIDED_PARAM,
        });
    });
  }

  static validateDatatype(method, datatype, param, customError = "") {
    let result = true;

    switch (datatype) {
      case "string":
        if (typeof param !== "string") result = false;
        break;
      case "number":
        if (typeof param !== "number") result = false;
        break;
      case "boolean":
        if (typeof param !== "boolean") result = false;
        break;
      case "undefined":
        if (typeof param !== "undefined") result = false;
        break;
      case "object":
        if (!(param instanceof Object)) result = false;
        break;
      case "array":
        if (!(param instanceof Array)) result = false;
        break;
      case "date":
        if (!(param instanceof Date)) result = false;
        break;
      case "regex":
        if (!(param instanceof RegExp)) result = false;
        break;
      default:
        CustomError.createCustomError({
          name: "Invalid parameter Error",
          cause: infoError.invalidParam({
            message: `"${datatype}" is not a valid datatype`,
            method: "validateDatatype",
          }),
          message: `One or more parameters did not pass their respective validations.`,
          code: EErrors.INVALID_PARAM,
        });
        break;
    }

    if (!result)
      CustomError.createCustomError({
        name: "Invalid parameter Error",
        cause: infoError.invalidParam({
          message:
            customError +
            `\nArgument "${param}" must be of datatype ${datatype}.`,
          method,
        }),
        message: `One or more parameters did not pass their respective validations.`,
        code: EErrors.INVALID_PARAM,
      });
  }

  static validateComparison(
    method,
    operator1,
    operand,
    operator2,
    customError = ""
  ) {
    let result = true;

    switch (operand) {
      case "===":
        if (!(operator1 === operator2)) result = false;
        break;
      case "==":
        if (!(operator1 == operator2)) result = false;
        break;
      case "!==":
        if (!(operator1 !== operator2)) result = false;
        break;
      case ">":
        if (!(operator1 > operator2)) result = false;
        break;
      case ">=":
        if (!(operator1 >= operator2)) result = false;
        break;
      case "<":
        if (!(operator1 < operator2)) result = false;
        break;
      case "<=":
        if (!(operator1 <= operator2)) result = false;
        break;
      default:
        CustomError.createCustomError({
          name: "Invalid parameter Error",
          cause: infoError.invalidParam({
            message: `"${operand}" is not a valid operand`,
            method: "validateComparison",
          }),
          message: `One or more parameters did not pass their respective validations.`,
          code: EErrors.INVALID_PARAM,
        });
        break;
    }

    if (!result)
      CustomError.createCustomError({
        name: "Invalid parameter Error",
        cause: infoError.invalidParam({
          message:
            customError +
            `\n"${operator1}" and "${operator2}" failed to pass the comparison "${operand}"`,
          method,
        }),
        message: `One or more parameters did not pass their respective validations.`,
        code: EErrors.INVALID_PARAM,
      });
  }

  static validatePattern(method, regex, terms, customError = "") {
    this.isProvided(
      "validatePattern",
      ["method", method],
      ["regex", regex],
      ["terms", terms]
    );
    this.validateDatatype("validatePattern", "string", method);
    this.validateDatatype("validatePattern", "array", terms);
    this.validateDatatype("validatePattern", "regex", regex);

    terms.forEach((term) => {
      this.validateDatatype("validatePattern", "array", term);
      if (!regex.test(term[1]))
        CustomError.createCustomError({
          name: "Invalid parameter Error",
          cause: infoError.invalidParam({
            message:
              customError +
              `\nTerm "${term[0]}" failed to pass pattern validation`,
            method,
          }),
          message: `One or more parameters did not pass their respective validations.`,
          code: EErrors.INVALID_PARAM,
        });
    });
  }
}

module.exports = ParamValidation;
