//Importo las dependencias
const Router = require("./custom_router.js"),
  ProductManager = require("../dao/db/managers/product_manager");

const productManager = new ProductManager();

class ProductRouter extends Router {
  init() {
    //Manipulo el pid pasado como parámetro
    this.router.param("pid", async (req, res, next, pid) => {
      const product = await productManager.getProductById(pid);

      if (!product.status) {
        req.product = null;
      } else {
        req.product = product.payload;
      }

      next();
    });

    //Muestra todos los productos
    this.get("/", ["PUBLIC"], async (req, res) => {
      try {
        let limit = req.query.limit,
          page = req.query.page,
          sort = req.query.sort,
          queries = req.query;

        const queryProducts = await productManager.getProducts(
          limit,
          page,
          sort,
          queries
        );

        if (queryProducts.status) {
          return res.sendSuccess(queryProducts.payload);
        } else {
          return res.sendUserError(queryProducts.error);
        }
      } catch (err) {
        return res.sendServerError(err);
      }
    });

    //Muestra un producto específico
    this.get("/:pid", ["PUBLIC"], async (req, res) => {
      try {
        return req.product
          ? res.sendSuccess(req.product)
          : res.sendNotFoundError("Product not found");
      } catch (err) {
        return res.sendServerError(err);
      }
    });

    //Agrega un producto
    this.post("/", ["PUBLIC"], async (req, res) => {
      try {
        const product = await productManager.addProduct(req.body);

        if (product.status) {
          return res.sendCreatedSuccess(product.payload);
        } else {
          return res.sendUserError(product.error);
        }
      } catch (err) {
        return res.sendServerError(err);
      }
    });

    //Actualiza un producto
    this.put("/:pid", ["PUBLIC"], async (req, res) => {
      try {
        if (!req.product) {
          return res.sendNotFoundError("Product not found");
        }

        const product = await productManager.updateProduct(
          req.product,
          req.body
        );

        if (product.status) {
          return res.sendCreatedSuccess(product.payload);
        } else {
          return res.sendUserError(product.error);
        }
      } catch (err) {
        return res.sendServerError(err);
      }
    });

    //Elimina un producto
    this.delete("/:pid", ["PUBLIC"], async (req, res) => {
      try {
        if (!req.product) {
          return res.sendNotFoundError("Product not found");
        }

        const product = await productManager.deleteProduct(req.product);

        if (product.status) {
          return res.sendSuccess(product.payload);
        } else {
          return res.sendUserError(product.error);
        }
      } catch (err) {
        return res.sendServerError(err);
      }
    });
  }
}

module.exports = ProductRouter;

// //Muestro los productos
// routerProducts.get("/", async (req, res) => {
//   try {
//     let limit = req.query.limit,
//       page = req.query.page,
//       sort = req.query.sort,
//       queries = req.query;

//     const queryProducts = await productManager.getProducts(
//       limit,
//       page,
//       sort,
//       queries
//     );

//     if (queryProducts.status) {
//       res.status(200).send(queryProducts.payload);
//     } else {
//       throw new Error(queryProducts.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

// //Muestro el producto con el id específico
// routerProducts.get("/:pid", async (req, res) => {
//   try {
//     let pid = req.params.pid;
//     const product = await productManager.getProductById(pid);

//     if (product.status) {
//       res.status(200).send(product.payload);
//     } else {
//       throw new Error(product.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

// //Agrego un producto
// routerProducts.post("/", async (req, res) => {
//   try {
//     const product = await productManager.addProduct(req.body);

//     if (product.status) {
//       res.status(201).send("Product created successfully");
//     } else {
//       throw new Error(product.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

// //Actualizo un producto
// routerProducts.put("/:pid", async (req, res) => {
//   try {
//     let pid = req.params.pid;

//     const product = await productManager.updateProduct(pid, req.body);
//     if (product.status) {
//       res.status(201).send("Product updated successfully");
//     } else {
//       throw new Error(product.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

// //Elimino un producto
// routerProducts.delete("/:pid", async (req, res) => {
//   try {
//     let pid = req.params.pid;
//     const product = await productManager.deleteProduct(pid);

//     if (product.status) {
//       res.status(200).send("Product deleted successfully");
//     } else {
//       throw new Error(product.error);
//     }
//   } catch (err) {
//     res.status(400).send("An error has occurred: " + err);
//   }
// });

// //Exporto routerProducts
// module.exports = routerProducts;
