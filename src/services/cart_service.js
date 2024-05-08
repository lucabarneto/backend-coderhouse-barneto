const CartDAO = require("../dao/mongo/cart.mongo");

const cartDAO = new CartDAO();

class CartService {
  constructor() {}

  getCart = async (data) => {
    const cart = await cartDAO.get(data);
    return cart;
  };

  //Obtiene un cart
  getCartById = async (cid) => {
    try {
      const cart = await cartDAO.getById(cid);
      return cart;
    } catch (err) {
      console.error(err);
    }
  };

  //Añade un cart
  addCart = async (data = {}) => {
    try {
      const cart = await cartDAO.create(data);
      return cart;
    } catch (err) {
      console.error(err);
    }
  };

  //Añade un producto a un cart
  addProductToCart = async (data, product, quantity = 1) => {
    try {
      const cart = await cartDAO.get(data);

      if (!cart.status) throw new Error(cart.error);

      cart.payload.products.push({
        product: product._id,
        quantity,
      });

      const update = await cartDAO.update(data, cart.payload);
      return update;
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
    }
  };

  //Elimina todos los productos del cart
  deleteAllProducts = async (data) => {
    try {
      const update = await cartDAO.update(data, {
        $set: { products: [] },
      });
      return update;
    } catch (err) {
      console.error(err);
    }
  };

  //Elimina un producto de cart
  deleteProduct = async (data, product) => {
    try {
      const update = await cartDAO.update(data, {
        $pull: { products: { product: product._id } },
      });
      return update;
    } catch (err) {
      console.error(err);
    }
  };

  //Actualiza un producto
  updateProductQuantity = async (data, product, quantity, state) => {
    try {
      const cart = await cartDAO.get(data);

      if (!cart.status) throw new Error(cart.error);

      //Aumento la cantidad del producto con el pid específico
      const productToUpdate = cart.payload.products.find(
        (p) => p.product._id.toString() === product._id.toString()
      );

      if (state === "add") {
        productToUpdate.quantity += quantity;
      } else if (state === "edit") {
        productToUpdate.quantity = quantity;
      }

      const update = await cartDAO.update(data, cart.payload);
      return update;
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
    }
  };

  //Actualiza el carrito
  updateCart = async (data, arr) => {
    try {
      const update = await cartDAO.update(data, {
        $addToSet: { products: { $each: arr } },
      });
      return update;
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = CartService;
