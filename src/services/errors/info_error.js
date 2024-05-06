const infoError = {
  notFoundIDErrorInfo: (id, collection) =>
    `ERROR: The given ID was not found in the database's ${collection} collection.
    ID searched: ${id}`,

  notProvidedParamErrorInfo: (controller, method, params) =>
    `ERROR: One or more parameters were not provided in the ${controller} controller's following function: ${method}()
    Unprovided parameters: ${params.join(" - ")}`,

  productQuantityErrorInfo: (
    quantity,
    stock
  ) => `ERROR: Product's quantity provided was invalid. Quantity must be a positive Number, lesser to equal than the product's stock
    * product's stock: ${stock}
    * quantity provided: ${quantity}`,

  productsInsertedErrorInfo:
    () => `ERROR: One or more products to insert provided were invalid.
  List of requirements:
    * All the products must be inside an array
    * Products passed inside the array must follow the pattern: {product: <id>, quantity: <number>}
  `,

  productPaginationErrorInfo: ({ limit, page, sort, plength }) =>
    `ERROR: One or more pagination options were invalid.
    List of pagination options:
      * limit: optional (default = 10). If present, it must be a positive Number. Received: ${limit}
      * page: optional (default = 1). If present, it must be a positive Number, representing an existing page (1-${plength}). Received: ${page}
      * sort: optional (default = 0). If present, it must be a Number, either -1 or 1. Received: ${sort}`,

  databaseErrorInfo: (method, cause) =>
    `ERROR: An error occurred while trying to execute the ${method}() service method.
    The error's cause: ${cause}`,

  noProductsProcessedErrorInfo: () =>
    `ERROR: None of the products in the cart were processed. Each product's quantity must be lesser to equal than the product's stock`,
};

module.exports = infoError;