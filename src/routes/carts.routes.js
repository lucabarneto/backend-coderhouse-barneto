const Router = require("./custom_router.js"),
  CartController = require("../controllers/cart_controller.js"),
  authenticate = require("../middleware/authentication.js"),
  authorize = require("../middleware/authorization.js");

const cartController = new CartController();

class CartRouter extends Router {
  init() {
    //Manipulo el cid pasado como parámetro
    this.router.param("cid", cartController.handleCid);

    //Manipulo el pid pasado como parámetro
    this.router.param("pid", cartController.handlePid);

    this.post(
      "/",
      ["USER"],
      authenticate("jwt", { session: false }),
      authorize,
      cartController.createCart
    );

    this.get("/:cid", ["USER"], cartController.getProducts);

    this.post(
      "/:cid/products/:pid",
      ["USER"],
      authenticate("jwt", { session: false }),
      authorize,
      cartController.addProductToCart
    );

    this.delete(
      "/:cid",
      ["USER"],
      authenticate("jwt", { session: false }),
      authorize,
      cartController.deleteAllProducts
    );

    this.delete(
      "/:cid/products/:pid",
      ["USER"],
      authenticate("jwt", { session: false }),
      authorize,
      cartController.deleteProduct
    );

    this.put(
      "/:cid/products/:pid",
      ["USER"],
      authenticate("jwt", { session: false }),
      authorize,
      cartController.updateProduct
    );

    this.put(
      "/:cid",
      ["USER"],
      authenticate("jwt", { session: false }),
      authorize,
      cartController.InsertProducts
    );
  }
}

module.exports = CartRouter;
