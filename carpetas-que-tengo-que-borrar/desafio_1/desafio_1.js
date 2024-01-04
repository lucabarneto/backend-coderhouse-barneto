class ProductManager {
  constructor() {
    this.products = [];
    this.id = 0;
  }

  addProducts = ({ title, description, price, thumbnail, code, stock }) => {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      //Si no se llenan todos los parámetros salta este error
      console.log("Error: Deben completarse todos los campos");
    } else {
      if (!this.products.some((p) => p.code === code)) {
        //añado el producto al array
        this.products.push({
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          id: this.id++,
        });
        console.log(
          `El producto ${title} (código ${code}) se ha agregado correctamente`
        );
      } else {
        console.log(
          //Si el producto ya se encuentra dentro del array salta este error
          `El producto ${title} (código ${code}) ya se encuentra dentro de la base de datos`
        );
      }
    }
  };

  getProducts = () => {
    //muestra todos los productos del array
    console.log(this.products);
    return this.products;
  };

  getProductById = (id) => {
    const findById = this.products.find((p) => p.id === id);
    if (findById) {
      console.log("Mostrando el producto:", findById);
    } else {
      //Si no se encuentra ningún producto que matchee el solicitado salta este mensaje
      console.log("Producto no encontrado");
    }
  };
}

const product = new ProductManager();

//Verificando funcionamiento correcto de métodos

const separador = "---------------------------------";

console.log("Verificando validación de parámetros");
product.addProducts("Faltan otros parámetros");
product.addProducts({
  title: "Mesa blanca",
  description: "una mesa blanca",
  price: 23000,
  code: 999,
  stock: 5,
  // No tiene thumbnail
}); //Funciona
console.log(separador);

console.log("Verificando agregado correcto de productos y id único");
product.addProducts({
  title: "Mesa blanca",
  description: "una mesa blanca",
  price: 23000,
  thumbnail: "thumbnail",
  code: 999,
  stock: 5,
});
product.addProducts({
  description: "una mesa gris",
  title: "Mesa gris",
  price: 25000,
  stock: 5,
  thumbnail: "thumbnail",
  code: 888,
});
product.addProducts({
  title: "Mesa negra",
  thumbnail: "thumbnail",
  description: "una mesa negra",
  stock: 5,
  code: 777,
  price: 32000,
});
product.getProducts(); //Funciona
console.log(separador);

console.log("Verificando no agregado de productos repetidos");
product.addProducts({
  title: "Mesa gris",
  description: "una mesa gris",
  price: 25000,
  thumbnail: "thumbnail",
  code: 888,
  stock: 5,
}); //Funciona
product.getProducts();
console.log(separador);

console.log("Verificando no encontrado de un producto");
product.getProductById(2); //Funciona
product.getProductById(8); //Funciona
console.log(separador);
