const fs = require("fs");

class ProductManager {
  constructor() {
    this.products = [];
    this.id = 0;
    //Creo el archivo json donde se guarda el array de productos.
    this.path = fs.promises
      .writeFile(
        "./desafio_2/products_fs.json",
        JSON.stringify(this.products, null, 2),
        "utf-8"
      )
      .then((res) => console.log("El archivo se ha creado correctamente"))
      .catch((err) => console.log("Ocurrió el siguiente error:", err));
  }

  readProducts = async () => {
    try {
      let res = await fs.promises.readFile(
        "./desafio_2/products_fs.json",
        "utf-8"
      );
      let resToArray = await JSON.parse(res);
      return resToArray;
    } catch (err) {
      console.log("Error:", err);
    }
  };

  addProducts = async ({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  }) => {
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        //Si no se llenan todos los parámetros salta este error
        console.log("Error: Deben completarse todos los campos");
      } else {
        const db = await this.readProducts();
        if (!db.some((p) => p.code === code)) {
          //añado el producto al array
          db.push({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: this.id++,
          });
          fs.promises
            .writeFile(
              "./desafio_2/products_fs.json",
              JSON.stringify(db, null, 2),
              "utf-8"
            )
            .then((res) =>
              console.log(`El producto se ha agregado correctamente:`, db)
            )
            .catch((err) => console.log("Ocurrió el siguiente error:", err));
        } else {
          console.log(
            //Si el producto ya se encuentra dentro del array salta este error
            `El producto ${title} (código ${code}) ya se encuentra dentro de la base de datos`
          );
        }
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  getProducts = async () => {
    //muestra todos los productos del array
    try {
      const db = await this.readProducts();
      console.log(db);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  getProductById = async (id) => {
    try {
      const db = await this.readProducts();
      const findById = db.find((p) => p.id === id);
      if (findById) {
        console.log("Mostrando el producto:", findById);
      } else {
        //Si no se encuentra ningún producto que matchee el solicitado salta este mensaje
        console.log("Producto no encontrado");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  deleteProduct = async (id) => {
    try {
      const db = await this.readProducts();
      const findById = db.find((p) => p.id === id);
      if (findById) {
        const newDb = await db.filter((p) => p.id !== id);
        fs.promises
          .writeFile(
            "./desafio_2/products_fs.json",
            JSON.stringify(newDb, null, 2),
            "utf-8"
          )
          .then((res) =>
            console.log(`El producto se ha eliminado correctamente:`, newDb)
          )
          .catch((err) => console.log("Ocurrió el siguiente error:", err));
      } else {
        console.log("Error: no se encuentra el producto que busca");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  updateProduct = async (id) => {
    try {
      const db = await this.readProducts();
      const findById = db.find((p) => p.id === id);
      if (findById) {
        //no se muy bien qué hacer :/
        console.log("Ayuda :(");
      } else {
        //Si no se encuentra ningún producto que matchee el solicitado salta este mensaje
        console.log("Producto no encontrado");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };
}

const product = new ProductManager();

const separador = "---------------------------------";

//Haciendo las respectivas verificaciones. Uso setTimeouts para simular asincronia entre los distintos métodos

setTimeout(() => {
  product.addProducts({
    title: "Mesa verde",
    description: "una mesa verde",
    price: 22000,
    thumbnail: "thumbnail",
    code: 312,
    stock: 5,
  });
  setTimeout(() => {
    product.addProducts({
      title: "Mesa azul",
      description: "una mesa azul",
      price: 22000,
      thumbnail: "thumbnail",
      code: 321,
      stock: 5,
    });
    setTimeout(() => {
      product.addProducts({
        title: "Mesa roja",
        description: "una mesa roja",
        price: 22000,
        thumbnail: "thumbnail",
        code: 123,
        stock: 5,
      });
      setTimeout(() => {
        console.log(separador);
        product.getProducts();
        product.getProductById(0);
        product.getProductById(9);
        setTimeout(() => {
          console.log(separador);
          product.deleteProduct(2);
          product.deleteProduct(9);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
