//Importo las dependencias
const Router = require("./custom_router.js"),
  ProductController = require("../controllers/product_controller.js");

const productController = new ProductController();

class ProductRouter extends Router {
  init() {
    //Manipulo el pid pasado como parámetro
    this.router.param("pid", productController.handlePid);

    this.get("/", ["PUBLIC"], productController.getProducts);

    this.get("/:pid", ["PUBLIC"], productController.getProductById);

    this.post("/", ["PUBLIC"], productController.addProduct);

    this.put("/:pid", ["PUBLIC"], productController.updateProduct);

    this.delete("/:pid", ["PUBLIC"], productController.deleteProduct);
  }
}

module.exports = ProductRouter;
