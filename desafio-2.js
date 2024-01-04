const fs = require("fs");

class ProductManager {
  constructor() {
    this.products = [];
    this.id = 0;
    //Creo el archivo json donde se guarda el array de productos.
    this.path = fs.existsSync("./products.json")
      ? fs.promises
          .readFile("./products.json", "utf-8")
          .then(() => console.log("El archivo se ha abierto correctamente"))
          .catch((err) => console.log("Ocurrió el siguiente error:", err))
      : fs.promises
          .writeFile(
            "./products.json",
            JSON.stringify(this.products, null, 2),
            "utf-8"
          )
          .then(() => console.log("El archivo se ha creado correctamente"))
          .catch((err) => console.log("Ocurrió el siguiente error:", err));
  }

  readProducts = async () => {
    try {
      let res = await fs.promises.readFile("./products.json", "utf-8");
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
          const newDb = [
            ...db,
            {
              title,
              description,
              price,
              thumbnail,
              code,
              stock,
              id: this.id++,
            },
          ];
          //añado el producto al array
          fs.promises
            .writeFile(
              "./products.json",
              JSON.stringify(newDb, null, 2),
              "utf-8"
            )
            .then(() =>
              console.log(`El producto se ha agregado correctamente:`, newDb)
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
          .writeFile("./products.json", JSON.stringify(newDb, null, 2), "utf-8")
          .then(() =>
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
        const db = await this.readProducts();
        let findById = db.find((p) => p.id === id);
        if (findById) {
          const newDb = db.filter((p) => p.id !== id);
          findById = { ...findById, [key]: value };
          fs.promises
            .writeFile(
              "./products.json",
              JSON.stringify([...newDb, findById], null, 2),
              "utf-8"
            )
            .then(() =>
              console.log(
                `El producto se ha actualizado correctamente:`,
                findById
              )
            )
            .catch((err) => console.log("Ocurrió el siguiente error:", err));
        } else {
          //Si no se encuentra ningún producto que matchee el solicitado salta este mensaje
          console.log("Producto no encontrado");
        }
      } else {
        throw console.log("Error: elija un campo válido");
      }
    } catch (err) {
      console.log("Error:", err || "Revisar código");
    }
  };
}

const product = new ProductManager();

const separador = "---------------------------------";

console.log("agregando productos");
product.addProducts({
  title: "Mesa roja",
  description: "una mesa roja",
  price: 22000,
  thumbnail: "thumbnail",
  code: 123,
  stock: 5,
});
product.addProducts({
  title: "Mesa azul",
  description: "una mesa azul",
  price: 22000,
  thumbnail: "thumbnail",
  code: 321,
  stock: 5,
});
// product.addProducts({
//   title: "Mesa verde",
//   description: "una mesa verde",
//   price: 22000,
//   thumbnail: "thumbnail",
//   code: 312,
//   stock: 5,
// });
console.log(separador);
