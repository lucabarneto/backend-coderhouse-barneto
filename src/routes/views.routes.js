//Importo las dependencias
const Router = require("./custom_router.js"),
  ViewController = require("../controllers/view_controller.js"),
  authenticate = require("../middleware/authentication.js"),
  authorize = require("../middleware/authorization.js");

//Guardo las dependencias en constantes
const viewController = new ViewController();

class ViewRouter extends Router {
  init() {
    //Muestra todos los productos
    this.get(
      "/",
      ["PUBLIC", "USER", "ADMIN", "PREMIUM"],
      authenticate("jwt", { session: false }),
      authorize,
      viewController.renderProducts
    );

    //Muestra todos los productos en tiempo real
    this.get("/realtimeproducts", ["PUBLIC"], viewController.renderProductsRT);

    //Muestra el chat
    this.get(
      "/chat",
      ["USER", "PREMIUM"],
      authenticate("jwt", { session: false }),
      authorize,
      viewController.renderChat
    );

    //Renderiza el login
    this.get("/login", ["PUBLIC"], viewController.renderLogin);

    //Página por si falla el login
    this.get("/faillogin", ["PUBLIC"], viewController.renderLoginFail);

    //Renderiza el registro
    this.get("/register", ["PUBLIC"], viewController.renderRegister);

    //Página por si falla el registro
    this.get("/failregister", ["PUBLIC"], viewController.renderRegisterFail);

    //Renderiza la sección del perfil del usuario
    this.get(
      "/profile",
      ["USER", "ADMIN", "PREMIUM"],
      authenticate("jwt", { session: false }),
      authorize,
      viewController.renderProfile
    );

    this.get(
      "/product/:id",
      ["PUBLIC", "USER", "ADMIN", "PREMIUM"],
      authenticate("jwt", { session: false }),
      authorize,
      viewController.renderProduct
    );

    this.get(
      "/cart/:id",
      ["USER", "ADMIN", "PREMIUM"],
      authenticate("jwt", { session: false }),
      authorize,
      viewController.renderCart
    );

    this.get(
      "/ticket/:id",
      ["USER", "ADMIN", "PREMIUM"],
      authenticate("jwt", { session: false }),
      authorize,
      viewController.renderTicket
    );
  }
}

module.exports = ViewRouter;
