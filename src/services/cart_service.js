const CartDAO = require("../dao/mongo/cart.mongo");

const cartDAO = new CartDAO();

class CartService {
  constructor() {}

  getCart = async (cart) => {
    const found = await cartDAO.get(cart);
    return found;
  };

  //Obtiene un cart
  getCartById = async (cid) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!cid) {
        throw new Error("No cid provided");
      }
      const cart = await cartDAO.getById(cid);

      if (cart.status) {
        return { status: true, payload: cart.payload };
      } else {
        throw new Error(cart.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };

  //Añade un cart
  addCart = async (cart = {}) => {
    try {
      const createdCart = await cartDAO.create(cart);

      if (createdCart.status) {
        return { status: true, payload: createdCart.payload };
      } else {
        throw new Error(createdCart.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };

  //Añade un producto a un cart
  addProductToCart = async (cart, product, quantity = 1) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!cart) {
        throw new Error("Cart not provided");
      }
      if (!product) {
        throw new Error("Product not provided");
      }
      if (typeof quantity !== "number")
        throw new TypeError("Product's quantity must be a number");
      if (quantity <= 0)
        throw new RangeError(
          "Product's quantity must not be neither 0 nor a negative number"
        );

      //Verifico que la cantidad agregada no sobrepase el stock del producto
      if (quantity > product.stock)
        throw new RangeError(
          `Product's quantity cannot be greater than it's stock \n inserted quantity: ${quantity} - product's stock: ${product.stock}`
        );

      const newcart = await cartDAO.get(cart);

      if (!newcart.status) throw new Error(newcart.error);

      newcart.payload.products.push({
        product: product._id,
        quantity,
      });

      const update = await cartDAO.update(cart, newcart.payload);

      if (update.status) {
        return { status: true, payload: update.payload };
      } else {
        throw new Error(update.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };

  //Elimina todos los productos del cart
  deleteAllProducts = async (cart) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!cart) {
        throw new Error("Cart not provided");
      }

      const update = await cartDAO.update(cart, {
        $set: { products: [] },
      });

      if (update.status) {
        return { status: true, payload: update.payload };
      } else {
        throw new Error(update.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };

  //Elimina un producto de cart
  deleteProduct = async (cart, product) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!cart) {
        throw new Error("Cart not provided");
      }
      if (!product) {
        throw new Error("Product not provided");
      }

      const update = await cartDAO.update(cart, {
        $pull: { products: { product: product._id } },
      });

      if (update.status) {
        return { status: true, payload: update.payload };
      } else {
        throw new Error(update.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };

  //Actualiza un producto
  updateProductQuantity = async (cart, product, quantity = undefined) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!cart) {
        throw new Error("Cart not provided");
      }
      if (!product) {
        throw new Error("Product not provided");
      }
      if (quantity === undefined) {
        throw new Error("No new quantity provided");
      }
      if (typeof quantity !== "number") {
        throw new TypeError("Product's quantity must be a number");
      }
      if (quantity <= 0)
        throw new RangeError(
          "Product's quantity must not be neither 0 nor a negative number"
        );

      const newcart = await cartDAO.get(cart);

      if (!newcart.status) throw new Error(newcart.error);

      //Aumento la cantidad del producto con el pid específico
      const productToUpdate = newcart.payload.products.find(
        (p) => p.product._id.toString() === product._id.toString()
      );

      if (quantity > productToUpdate.stock)
        throw new RangeError(
          `Product's new quantity cannot be greater than it's stock \n inserted quantity: ${quantity} - product's stock: ${product.stock}`
        );

      productToUpdate.quantity = quantity;

      const update = await cartDAO.update(cart, newcart.payload);

      if (update.status) {
        return { status: true, payload: update.payload };
      } else {
        throw new Error(update.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };

  //Actualiza el carrito
  updateCart = async (cart, arr) => {
    try {
      //Verifico que se hayan pasado los parámetros
      if (!cart) {
        throw new Error("Cart not provided");
      }
      if (!arr) {
        throw new Error("No array provided");
      }
      //Verifico que el cuerpo pasado sea un array
      if (!(arr instanceof Array)) {
        throw new TypeError("Body must be an array");
      }

      for (const object of arr) {
        for (const key in object) {
          if (key !== "product" && key !== "quantity")
            throw new Error(
              "Products passed inside the array must follow the pattern: {product: 'id', quantity: number}"
            );
        }
      }

      const update = await cartDAO.update(cart, {
        $addToSet: { products: { $each: arr } },
      });

      if (update.status) {
        return { status: true, payload: update.payload };
      } else {
        throw new Error(update.error);
      }
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message ? err.message : err };
    }
  };
}

module.exports = CartService;
