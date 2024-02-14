const fs = require("fs");

class CartManager {
  //Vuelvo a los elementos del constructor privados, para que no se puedan acceder desde las instancias
  #path;

  constructor() {
    //Creo el archivo json donde se guarda el cart
    this.#path = __dirname + "/carts.json";

    if (!fs.existsSync(this.#path)) {
      fs.writeFileSync(this.#path, "[]", {
        encoding: "utf-8",
      });
    }
  }

  addCart = async () => {
    try {
      //Leo el archivo json
      const db = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));

      // Añado un id autoincrementable al carrito
      let cid;
      if (db.length === 0) {
        cid = 1;
      } else {
        cid = db[db.length - 1].cid + 1;
      }

      //Agrego el cart al array
      const newDb = [
        ...db,
        {
          cid,
          //los productos que se agregan son los que están en products.json
          products: [],
        },
      ];

      fs.promises
        .writeFile(this.#path, JSON.stringify(newDb, null, 2), "utf-8")
        .then(() => console.log(`Carrito creado correctamente:`, newDb))
        .catch((err) => console.log(err));

      return newDb;
    } catch (err) {
      console.log(err);
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      //Leo el archivo json
      const db = JSON.parse(await fs.promises.readFile(this.#path, "utf-8")),
        products = JSON.parse(
          await fs.promises.readFile("products.json", "utf-8")
        );

      const cart = db.find((c) => c.cid === cid),
        newProduct = products.find((p) => p.pid === pid);

      //Verifico que existan tanto el carrito como el producto a agregar
      if (!cart) {
        console.log(new Error("Carrito no encontrado"));
        return false;
      }
      if (!newProduct) {
        console.log(new Error(`El producto con el id ${pid} no existe`));
        return false;
      }

      //Verifico que el producto no esté ya en el carrito
      const productAlreadyInCart = cart.products.some(
        (p) => p.pid === newProduct.pid
      );

      if (productAlreadyInCart) {
        //Si ya está en el carrito sumo 1 a quantity
        const product = cart.products.find((p) => p.pid === newProduct.pid);
        product.quantity += 1;

        const newDb = db.filter((c) => c !== cart);
        fs.promises
          .writeFile(
            this.#path,
            JSON.stringify([...newDb, cart], null, 2),
            "utf-8"
          )
          .then(() => console.log(`Carrito creado correctamente:`, cart))
          .catch((err) => console.log(err));
      } else {
        //Si no está en el carrito lo agrego
        const newDb = db.filter((c) => c !== cart);
        cart.products.push({ pid: newProduct.pid, quantity: 1 });
        fs.promises
          .writeFile(
            this.#path,
            JSON.stringify([...newDb, cart], null, 2),
            "utf-8"
          )
          .then(() => console.log(`Producto agregado correctamente:`, cart))
          .catch((err) => console.log(err));
      }

      return true;
    } catch (err) {
      console.log(err);
    }
  };

  getCartsProducts = async (cid) => {
    try {
      //Leo el archivo json
      const db = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));

      const cart = db.find((c) => c.cid === cid);

      //Verifico que exista el carrito
      if (!cart) {
        console.log(new Error("Carrito no encontrado"));
        return false;
      }

      console.log(cart.products);
      return cart.products;
    } catch (err) {
      console.log(err);
    }
  };
}

//Exporto CartManager
module.exports = CartManager;
