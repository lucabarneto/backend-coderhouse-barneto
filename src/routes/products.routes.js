//Importo las dependencias
const Router = require("./custom_router.js"),
  ProductController = require("../controllers/product_controller.js"),
  authenticate = require("../middleware/authentication.js"),
  authorize = require("../middleware/authorization.js");

const productController = new ProductController();

class ProductRouter extends Router {
  init() {
    //Manipulo el pid pasado como parámetro
    this.router.param("pid", productController.handlePid);

    this.get(
      "/",
      ["ADMIN"],
      authenticate("jwt", { session: false }),
      authorize,
      productController.getProducts
    );

    this.get(
      "/mockingproducts",
      ["ADMIN"],
      authenticate("jwt", { session: false }),
      authorize,
      productController.createMockProducts
    );

    this.get(
      "/:pid",
      ["ADMIN"],
      authenticate("jwt", { session: false }),
      authorize,
      productController.getProductById
    );

    this.post(
      "/",
      ["ADMIN", "PREMIUM"],
      authenticate("jwt", { session: false }),
      authorize,
      productController.addProduct
    );

    this.put(
      "/:pid",
      ["ADMIN", "PREMIUM"],
      authenticate("jwt", { session: false }),
      authorize,
      productController.updateProduct
    );

    this.delete(
      "/:pid",
      ["ADMIN", "PREMIUM"],
      authenticate("jwt", { session: false }),
      authorize,
      productController.deleteProduct
    );
  }
}

module.exports = ProductRouter;
