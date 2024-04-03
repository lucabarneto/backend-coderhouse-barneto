//Importo las dependencias
const Router = require("./custom_router.js"),
  ProductManager = require("../dao/db/managers/product_manager.js"),
  passportCall = require("../middlewares/auth.js");

//Guardo las dependencias en constantes
const productManager = new ProductManager();

class ViewRouter extends Router {
  init() {
    //Muestra todos los productos
    this.get("/", ["PUBLIC"], async (req, res) => {
      try {
        const products = await productManager.getProducts();

        if (products.status) {
          console.log(products.payload.docs);
          return res.render("home", {
            products: products.payload.docs,
          });
        } else {
          return res.sendUserError(products.error);
        }
      } catch (err) {
        console.error(err);
        return res.sendServerError(err);
      }
    });

    //Muestra todos los productos en tiempo real
    this.get("/realtimeproducts", ["PUBLIC"], async (req, res) => {
      try {
        const products = await productManager.getProducts();

        if (products.status) {
          return res.render("realTimeProducts", {
            products: products.payload.docs,
          });
        } else {
          return res.sendUserError(products.error);
        }
      } catch (err) {
        console.error(err);
        return res.sendServerError(err);
      }
    });

    //Muestra el chat
    this.get("/chat", ["USER", "ADMIN"], (req, res) => {
      res.render("chat");
    });

    //Renderiza el login
    this.get("/login", ["PUBLIC"], (req, res) => {
      res.render("login");
    });

    //Renderiza el registro
    this.get("/register", ["PUBLIC"], (req, res) => {
      res.render("register");
    });

    //Renderiza la sección del perfil del usuario
    this.get(
      "/profile",
      ["USER"],
      passportCall("jwt", { session: false }),
      (req, res) => {
        res.render("profile", req.user);
      }
    );
  }
}

module.exports = ViewRouter;

// routerViews.get("/", async (req, res) => {
//   try {
//     const products = await productManager.getProducts();

//     console.log(products.payload.docs);
//     res.render("home", {
//       products: products.payload.docs,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(404).send("Page not found");
//   }
// });

// routerViews.get("/realtimeproducts", async (req, res) => {
//   try {
//     const products = await productManager.getProducts();
//     res.render("realTimeProducts", {
//       products: products.payload.docs,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(404).send("Page not found");
//   }
// });

// //Renderiza la sección del chat
// routerViews.get("/chat", ["USER"], (req, res) => {
//   res.render("chat");
// });

// //Renderiza el login
// routerViews.get("/login", (req, res) => {
//   res.render("login");
// });

// //Renderiza el registro
// routerViews.get("/register", (req, res) => {
//   res.render("register");
// });

// //Renderiza la sección del perfil del usuario
// routerViews.get(
//   "/profile",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.render("profile", req.user);
//   }
// );

// // exporto routerViews
// module.exports = routerViews;
