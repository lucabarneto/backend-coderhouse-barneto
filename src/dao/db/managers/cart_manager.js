const Cart = require("../models/cart.model.js");

class CartManager {
  constructor() {}

  //Obtiene un cart
  getCartById = async (cid) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!cid) {
        throw new Error("No cid provided");
      }
      const cart = await Cart.find({ _id: cid });

      //Verifico que el producto exista
      if (!cart) {
        throw new Error("Cart not found");
      }

      return { status: true, payload: cart[0] };
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
    }
  };

  //Añade un cart
  addCart = async (cart = {}) => {
    try {
      const createdCart = await Cart.create(cart);

      return { status: true, payload: createdCart };
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
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

      const newcart = await Cart.find(cart);

      newcart[0].products.push({
        product: product._id,
        quantity,
      });
      await Cart.updateOne(cart, newcart[0]);

      return { status: true, payload: newcart[0] };
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
    }
  };

  //Elimina todos los productos del cart
  deleteAllProducts = async (cart) => {
    try {
      //Verifico que se haya pasado el parámetro
      if (!cart) {
        throw new Error("Cart not provided");
      }

      await Cart.updateOne(cart, {
        $set: { products: [] },
      });

      return { status: true, payload: "Products deleted successfully" };
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
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

      await Cart.updateOne(cart, {
        $pull: { products: { product: product._id } },
      });

      return { status: true, payload: "Product deleted successfully" };
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
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

      const newcart = await Cart.find(cart);

      //Aumento la cantidad del producto con el pid específico
      const productToUpdate = newcart[0].products.find(
        (p) => p.product._id.toString() === product._id.toString()
      );

      if (quantity > productToUpdate.stock)
        throw new RangeError(
          `Product's new quantity cannot be greater than it's stock \n inserted quantity: ${quantity} - product's stock: ${product.stock}`
        );

      productToUpdate.quantity = quantity;

      await Cart.updateOne(cart, newcart[0]);

      return {
        status: true,
        payload: "Product's quantity updated successfully",
      };
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
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

      await Cart.updateOne(cart, {
        $addToSet: { products: { $each: arr } },
      });

      return { status: true, payload: "Cart updated successfully" };
    } catch (err) {
      console.error(err);
      return { status: false, error: err.message };
    }
  };
}

module.exports = CartManager;
