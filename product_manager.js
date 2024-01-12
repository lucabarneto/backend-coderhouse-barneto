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
    thumbnail,
    code,
    stock,
  }) => {
    try {
      //Si no se llenan todos los parámetros salta este error
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("Deben completarse todos los campos");
      }

      //Leo el archivo json
      const db = await fs.promises
        .readFile(this.#path, "utf-8")
        .then((res) => JSON.parse(res));

      if (!db.some((p) => p.code === code)) {
        // Añado un id autoincrementable al producto
        let id;
        if (db.lenght === 0) {
          id = 1;
        } else {
          id = db[db.lenght - 1].id + 1;
        }

        //Agrego el producto al array
        const newDb = [
          ...db,
          {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id,
          },
        ];

        //añado el producto al array
        fs.promises
          .writeFile(this.#path, JSON.stringify(newDb, null, 2), "utf-8")
          .then(() =>
            console.log(`El producto se ha agregado correctamente:`, newDb)
          )
          .catch((err) => console.log(err));
      } else {
        throw new Error(
          `El producto ${title} (código ${code}) ya se encuentra dentro de la base de datos`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  getProducts = async () => {
    //Leo el archivo json
    const db = await fs.promises
      .readFile(this.#path, "utf-8")
      .then((res) => JSON.parse(res));

    console.log(db);
    return db;
  };

  getProductById = async (id) => {
    try {
      //Leo el archivo json
      const db = await fs.promises
        .readFile(this.#path, "utf-8")
        .then((res) => JSON.parse(res));

      const product = db.find((p) => p.id === id);

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      console.log(product);
      return product;
    } catch (err) {
      console.log(err);
    }
  };

  deleteProduct = async (id) => {
    try {
      //Leo el archivo json
      const db = await fs.promises
        .readFile(this.#path, "utf-8")
        .then((res) => JSON.parse(res));

      //Encuentro el producto con el id especificado
      const product = db.find((p) => p.id === id);

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      //Creo un nuevo array sin el producto
      const newDb = await db.filter((p) => p !== product);

      fs.promises
        .writeFile(this.#path, JSON.stringify(newDb, null, 2), "utf-8")
        .then(() =>
          console.log(`El producto se ha eliminado correctamente:`, newDb)
        )
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  updateProduct = async (id, key, value) => {
    try {
      if (
        key === "title" ||
        key === "description" ||
        key === "price" ||
        key === "thumbnail" ||
        key === "stock" ||
        key === "code"
      ) {
        //Leo el archivo json
        const db = await fs.promises
          .readFile(this.#path, "utf-8")
          .then((res) => JSON.parse(res));

        let product = db.find((p) => p.id === id);

        if (!product) {
          throw new Error("Producto no encontrado");
        }

        //Creo un nuevo array sin el producto
        const newDb = await db.filter((p) => p !== product);

        product = { ...product, [key]: value };

        fs.promises
          .writeFile(
            this.#path,
            JSON.stringify([...newDb, product], null, 2),
            "utf-8"
          )
          .then(() =>
            console.log(`El producto se ha actualizado correctamente:`, product)
          )
          .catch((err) => console.log(err));
      } else {
        throw new Error("Elija un campo válido");
      }
    } catch (err) {
      console.log(err);
    }
  };
}
