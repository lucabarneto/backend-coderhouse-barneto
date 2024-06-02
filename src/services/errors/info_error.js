const infoError = {
  unprovidedParam: (method, param) =>
    `One or more parameters were not provided in the following method: ${method}().
    Unprovided parameters: ${param}.`,

  invalidParam: (information) =>
    `One or more parameters did not pass their respective validations in the following method: ${information.method}.
    ${information.message}`,

  idNotFound: (id, collection) =>
    `The given ID was not found in the database's ${collection} collection.
    ID searched: ${id}.`,

  userNotFound: (user) =>
    `The given user was not found in the database's User collection
    User searched: ${user}`,

  objectNotFound: (collection, method) =>
    `The given object in the method: ${method}(), was not found in the database's ${collection} collection`,

  objectAlreadyInDatabase: (method) =>
    `Cannot create a new document in the method: ${method}, because it already exists in the database`,

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

  unhandledDatabase: (method, cause) =>
    `An unhandled error occurred while trying to execute the ${method}() database method.
    The error's cause: ${cause}.`,

  noProductsProcessed: () =>
    `None of the products in the cart were processed. Each product's quantity must be lesser to equal than the product's stock.`,

  noAuthStrategy: (argument) =>
    `One or more authentication arguments were invalid:
    List of authentication arguments:
      * strategy: required. Must be a String representing a valid passport strategy (register, login, github, jwt). Received: ${
        argument.strategy
      }.
      * options: optional. Must be an Object containing valid passport additional configurations. Received: ${JSON.stringify(
        argument.options
      )}.`,

  notAuthenticated: () =>
    `User was not authenticated and tried to enter a page that required authentication. User was automatically redirected to /login.`,

  notAuthorized: (data) =>
    `Access to the page was forbidden for the user.
      * role: ${data.userRole}.
      * required role(s): ${data.policy}.`,

  incorrectPolicyErrorInfo: (policies) =>
    `One or more policies were invalid. Policies are required and must be inside an Array. Each policy must be written in upper case
      * List of allowed policies: PUBLIC, USER, ADMIN, PREMIUM
      * Received policies: ${JSON.stringify(policies.join(" - "))}`,

  ParamValidation: (method, message) =>
    `One or more parameters in the param validation method: ${method}() did not pass their own respective validations.
    ${message}`,
};

module.exports = infoError;
