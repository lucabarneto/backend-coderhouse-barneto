const Router = require("./custom_router.js"),
  CartController = require("../controllers/cart_controller.js");

const cartController = new CartController();

class CartRouter extends Router {
  init() {
    //Manipulo el cid pasado como parámetro
    this.router.param("cid", cartController.handleCid);

    //Manipulo el pid pasado como parámetro
    this.router.param("pid", cartController.handlePid);

    this.post("/", ["PUBLIC"], cartController.createCart);

    this.get("/:cid", ["PUBLIC"], cartController.getProducts);

    this.post(
      "/:cid/products/:pid",
      ["PUBLIC"],
      cartController.addProductToCart
    );

    this.delete("/:cid", ["PUBLIC"], cartController.deleteAllProducts);

    this.delete(
      "/:cid/products/:pid",
      ["PUBLIC"],
      cartController.deleteProduct
    );

    this.put("/:cid/products/:pid", ["PUBLIC"], cartController.updateProduct);

    this.put("/:cid", ["PUBLIC"], cartController.InsertProducts);
  }
}

module.exports = CartRouter;
