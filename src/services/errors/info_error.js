const infoError = {
  notFoundIDErrorInfo: (id, collection) =>
    `The given ID was not found in the database's ${collection} collection.
    ID searched: ${id}.`,

  notProvidedParamErrorInfo: (service, method, params) =>
    `One or more parameters were not provided in the ${service} service's following function: ${method}().
    Unprovided parameters: ${JSON.stringify(params.join(" - "))}.`,

  productQuantityErrorInfo: (
    quantity,
    stock
  ) => `Product's quantity provided was invalid. Quantity must be a positive Number, lesser to equal than the product's stock
    * product's stock: ${stock}.
    * quantity provided: ${quantity}.`,

  productsInsertedErrorInfo:
    () => `One or more products to insert provided were invalid.
  List of requirements:
    * All the products must be inside an array.
    * Products passed inside the array must follow the pattern: {product: <id>, quantity: <number>}.
  `,

  productPaginationErrorInfo: ({ limit, page, sort, plength }) =>
    `One or more pagination options were invalid.
    List of pagination options:
      * limit: optional (default = 10). If present, it must be a positive Number. Received: ${limit}.
      * page: optional (default = 1). If present, it must be a positive Number, representing an existing page (1-${plength}). Received: ${page}.
      * sort: optional (default = 0). If present, it must be a Number, either -1 or 1. Received: ${sort}.`,

  databaseErrorInfo: (method, cause) =>
    `An error occurred while trying to execute the ${method}() service method.
    The error's cause: ${cause}.`,

  noProductsProcessedErrorInfo: () =>
    `None of the products in the cart were processed. Each product's quantity must be lesser to equal than the product's stock.`,

  noAuthStrategyErrorInfo: (argument) =>
    `One or more authentication arguments were invalid:
    List of authentication arguments:
      * strategy: required. Must be a String representing a valid passport strategy (register, login, github, jwt). Received: ${
        argument.strategy
      }.
      * options: optional. Must be an Object containing valid passport additional configurations. Received: ${JSON.stringify(
        argument.options
      )}.`,

  notAuthenticatedErrorInfo: () =>
    `User was not authenticated and tried to enter a page that required authentication. User was automatically redirected to /login.`,

  notAuthorizedErrorInfo: (data) =>
    `Access to the page was forbidden for the user.
      * user role: ${data.userRole}.
      * required user role: ${data.policy}.`,

  incorrectPolicyErrorInfo: (policies) =>
    `One or more policies were invalid. Policies are required and must be inside an Array. Each policy must be written in upper case
      * List of allowed policies: PUBLIC, USER, ADMIN
      * Received policies: ${JSON.stringify(policies.join(" - "))}`,
};

module.exports = infoError;
