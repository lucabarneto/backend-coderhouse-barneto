const CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

class ParamValidation {
  constructor() {}

  static isProvided(method, params) {
    if (
      !method ||
      typeof method !== "string" ||
      !params ||
      !(params instanceof Array) ||
      params.length === 0
    )
      CustomError.createCustomError(EErrors.INTERNAL, {
        message: infoError.ParamValidation("isProvided", { method, params }),
      });

    params.forEach((param) => {
      if (
        !(param instanceof Array) ||
        param.length !== 2 ||
        typeof param[0] !== "string"
      )
        CustomError.createCustomError(EErrors.INTERNAL, {
          message: infoError.ParamValidation("isProvided", { method, param }),
        });

      if (!param[1])
        CustomError.createCustomError(EErrors.UNPROVIDED_PARAM, {
          method,
          message: param[0],
        });
    });
  }

  static validateDatatype(
    method,
    datatype,
    term = undefined,
    customError = ""
  ) {
    if (
      !method ||
      typeof method !== "string" ||
      !datatype ||
      typeof datatype !== "string" ||
      term === undefined
    )
      CustomError.createCustomError(EErrors.INTERNAL, {
        message: infoError.ParamValidation("ValidateDatatype", {
          method,
          datatype,
          term,
        }),
      });

    let result = true;

    switch (datatype) {
      case "string":
        if (typeof term !== "string") result = false;
        break;
      case "number":
        if (typeof term !== "number") result = false;
        break;
      case "boolean":
        if (typeof term !== "boolean") result = false;
        break;
      case "undefined":
        if (typeof term !== "undefined") result = false;
        break;
      case "object":
        if (!(term instanceof Object)) result = false;
        break;
      case "array":
        if (!(term instanceof Array)) result = false;
        break;
      case "date":
        if (!(term instanceof Date)) result = false;
        break;
      case "regex":
        if (!(term instanceof RegExp)) result = false;
        break;
      default:
        CustomError.createCustomError(EErrors.INTERNAL, {
          message: infoError.ParamValidation("validateDatatype", {
            method,
            datatype,
            term,
          }),
        });
        break;
    }

    if (!result)
      CustomError.createCustomError(EErrors.INVALID_PARAM, {
        method,
        message:
          customError + `\nArgument "${term}" must be of datatype ${datatype}.`,
      });
  }

  static validateComparison(
    method,
    operator1 = undefined,
    operand,
    operator2 = undefined,
    customError = ""
  ) {
    if (
      !method ||
      typeof method !== "string" ||
      operator1 === undefined ||
      operator2 === undefined ||
      !operand ||
      typeof operand !== "string"
    )
      CustomError.createCustomError(EErrors.INTERNAL, {
        message: infoError.ParamValidation("validateComparison", {
          method,
          operator1,
          operator2,
          operand,
        }),
      });

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
        CustomError.createCustomError(EErrors.INTERNAL, {
          message: infoError.ParamValidation("validateComparison", {
            method,
            operator1,
            operator2,
            operand,
          }),
        });
        break;
    }

    if (!result)
      CustomError.createCustomError(EErrors.INVALID_PARAM, {
        method,
        message:
          customError +
          `\n"${operator1}" and "${operator2}" failed to pass the comparison "${operand}"`,
      });
  }

  static validatePattern(method, regex, params, customError = "") {
    if (
      !method ||
      typeof method !== "string" ||
      !regex ||
      !(regex instanceof RegExp) ||
      !params ||
      !(params instanceof Array) ||
      params.length === 0
    )
      CustomError.createCustomError(EErrors.INTERNAL, {
        message: infoError.ParamValidation("validatePattern", {
          method,
          regex,
          params,
        }),
      });

    params.forEach((param) => {
      if (
        !(param instanceof Array) ||
        param.length !== 2 ||
        typeof param[0] !== "string"
      )
        CustomError.createCustomError(EErrors.INTERNAL, {
          message: infoError.ParamValidation("validatePattern", {
            method,
            regex,
            param,
          }),
        });

      if (!regex.test(param[1]))
        CustomError.createCustomError(EErrors.INVALID_PARAM, {
          method,
          message:
            customError +
            `\nTerm "${param[0]}" failed to pass pattern validation`,
        });
    });
  }

  static validateAuthorization(
    method,
    userId = undefined,
    objectId = undefined
  ) {
    if (
      !method ||
      typeof method !== "string" ||
      userId === undefined ||
      objectId === undefined
    )
      CustomError.createCustomError(EErrors.INTERNAL, {
        message: infoError.ParamValidation("validateAuthorization", {
          method,
          userId,
          objectId,
        }),
      });

    if (userId !== objectId)
      CustomError.createCustomError(EErrors.FORBIDDEN, {
        message: infoError.notAuthorized(method),
      });
  }
}

module.exports = ParamValidation;
