const infoError = {
  productQuantity: (
    quantity,
    stock
  ) => `Product's quantity provided was invalid. Quantity must be a positive Number, lesser to equal than the product's stock
    * product's stock: ${stock}.
    * quantity provided: ${quantity}.`,

  productsInserted: () => `One or more products to insert provided were invalid.
  List of requirements:
    * All the products must be inside an array.
    * Products passed inside the array must follow the pattern: {product: <id>, quantity: <number>}.
  `,

  productPagination: ({ limit, page, sort, plength }) =>
    `One or more pagination options were invalid.
    List of pagination options:
      * limit: optional (default = 10). If present, it must be a positive Number. Received: ${limit}.
      * page: optional (default = 1). If present, it must be a positive Number, representing an existing page (1-${plength}). Received: ${page}.
      * sort: optional (default = 0). If present, it must be a Number, either -1 or 1. Received: ${sort}.`,

  noProductsProcessed: () =>
    `None of the products in the cart were processed. Each product's quantity must be lesser to equal than the product's stock.`,

  noAuthStrategy: (strategy, options) =>
    `One or more authentication arguments were invalid:
    List of authentication arguments:
      * strategy: required. Must be a String representing a valid passport strategy (register, login, github, jwt). Received: ${strategy}.
      * options: optional. Must be an Object containing valid passport additional configurations. Received: ${JSON.stringify(
        options
      )}.`,

  IncorrectUserRole: (userRole, policy) =>
    `Access to the page was forbidden for the user.\n* role: ${userRole}.\n* required role(s): ${policy}.`,

  notAuthorized: (method) =>
    `User tried to execute the method ${method}() with an object that was not theirs`,

  incorrectPolicy: () =>
    `One or more policies were invalid. Policies are required and must be inside an Array. Each policy must be written in upper case
      * List of allowed policies: PUBLIC, USER, ADMIN, PREMIUM`,

  ParamValidation: (
    paramMethod,
    {
      method,
      params = "",
      param = "",
      datatype = "",
      term = "",
      operand = "",
      operator1 = "",
      operator2 = "",
      regex = "",
      userId = "",
      objectId = "",
    }
  ) =>
    `One or more parameters in the param validation method: ${paramMethod}() did not pass their own respective validations while validating the ${method}() method.
  List of Possible parameters:
    * method: String, contains information about the method where the error occurred. Received: ${method}

    * params: Array, appears in the following methods: isProvided(), validateParameter(). Contains subarrays with each parameter's name (string) and value. Check whether "params" is, indeed, an array, and if each parameter is a subarray holding its name and value. Received: ${params}, and parameter ${param}

    * datatype: String, appears in the following methods: valiateDatatype(). Contains the datatype to compare a term against. Check whether it is a string and if its value is one of the following: string, number, boolean, undefined, object, array, date, regex. Received: ${datatype}

    * term: It appears in the following method: validateDatatype(). Contains the value to check its datatype. It is required for the method to work. Received: ${term}

    * operand: String, appears in the following methods: validateComparison(). Contains a valid operand to compare both operators. Check whether it is a string and if its value is one of the following: ===, ==, !==, >, >=, <, <=. Received: ${operand}

    * operators: They appear in the following methods: validateComparison() and contain the values to compare. Both operator are required for the method to work. Received: ${operator1} & ${operator2}

    * regex: RegExp, appears in the following methods: validatePattern(). Contains the regular expression that the parameter must pass. Received: ${regex}

    * userId & objectId. Strings, they appear in the following methods: validateAuthorization(). Both are required and contain an id in mongo format. Received: userId: ${userId} & objectId: ${objectId}
    `,

  CustomError: (code, method, message) =>
    `One or more parameters did not pass their respective validations in the following method: CustomError().
  Possible Parameters:
    * code: Number, must be an enumerated error (1-9). Received: ${code} 
    * method: String, contains information about the method where the error occurred. Must be inside an object. Received: ${method}
    * message: String, contains additional and personalized information regarding the error's nature. Must be inside an object. Received: ${message}`,
};

module.exports = infoError;
