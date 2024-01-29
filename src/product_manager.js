const fs = require("fs");

class ProductManager {
  //Vuelvo a los elementos del constructor privados, para que no se puedan acceder desde las instancias
  #path;

  constructor() {
    //Creo el archivo json donde se guarda el array de productos.
    this.#path = "products.json";

    if (!fs.existsSync(this.#path)) {
      fs.writeFileSync(this.#path, "[]", {
        encoding: "utf-8",
      });
    }
  }

  addProducts = async ({
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    category,
  }) => {
    try {
      //Si no se llenan estos parámetros salta este error
      if (!title || !description || !price || !code || !stock || !category) {
        console.log(new Error("Deben completarse todos los campos"));
        return false;
      }

      //Leo el archivo json
      const db = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));

      if (!db.some((p) => p.code === code)) {
        // Añado un id autoincrementable al producto
        let pid;
        if (db.length === 0) {
          pid = 1;
        } else {
          pid = db[db.length - 1].pid + 1;
        }

        //Agrego el producto al array
        const newDb = [
          ...db,
          {
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            pid,
            category,
            status: true,
          },
        ];

        //añado el producto al array
        fs.promises
          .writeFile(this.#path, JSON.stringify(newDb, null, 2), "utf-8")
          .then(() =>
            console.log(`El producto se ha agregado correctamente:`, newDb)
          )
          .catch((err) => console.log(err));

        return true;
      } else {
        console.log(
          new Error(
            `El producto ${title} (código ${code}) ya se encuentra dentro de la base de datos`
          )
        );
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  };

  getProducts = async () => {
    //Leo el archivo json
    const db = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));

    return db;
  };

  getProductById = async (pid) => {
    try {
      //Leo el archivo json
      const db = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));

      const product = db.find((p) => p.pid === pid);

      if (!product) {
        console.log(new Error("Producto no encontrado"));
        return false;
      }

      console.log(product);
      return product;
    } catch (err) {
      console.log(err);
    }
  };

  deleteProduct = async (pid) => {
    try {
      //Leo el archivo json
      const db = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));

      //Encuentro el producto con el id especificado
      const product = db.find((p) => p.pid === pid);

      if (!product) {
        console.log(new Error("Producto no encontrado"));
        return false;
      }

      //Creo un nuevo array sin el producto
      const newDb = await db.filter((p) => p !== product);

      fs.promises
        .writeFile(this.#path, JSON.stringify(newDb, null, 2), "utf-8")
        .then(() =>
          console.log(`El producto se ha eliminado correctamente:`, newDb)
        )
        .catch((err) => console.log(err));

      return true;
    } catch (err) {
      console.log(err);
    }
  };

  updateProduct = async (pid, update) => {
    try {
      //Leo el archivo json
      const db = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));

      const product = db.find((p) => p.pid === pid);

      if (!product) {
        console.log(new Error("Producto no encontrado"));
        return false;
      }

      //Actualizo el producto
      for (const key in product) {
        if (update.hasOwnProperty(key)) {
          product[key] = update[key];
        }
      }

      fs.promises
        .writeFile(this.#path, JSON.stringify(db, null, 2), "utf-8")
        .then(() =>
          console.log(`El producto se ha actualizado correctamente:`, product)
        )
        .catch((err) => console.log(err));
      return true;
    } catch (err) {
      console.log(err);
    }
  };
}

//Exporto ProductManager
module.exports = ProductManager;
