class ProductManager {
  constructor() {
    this.products = [];
    this.id = 0;
  }

  addProducts = (title, description, price, thumbnail, code, stock) => {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      //Si no se llenan todos los parámetros salta este error
      console.log("Error: Deben completarse todos los campos");
    } else {
      if (!this.products.some((p) => p.code === code)) {
        //le agrego un id al producto y actualizo el valor del this.id
        const id = this.id + 1;
        this.updateId();
        //añado el producto al array
        this.products.push({
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          id,
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
      return findById;
    } else {
      //Si no se encuentra ningún producto que matchee el solicitado salta este mensaje
      console.log("Producto no encontrado");
    }
  };

  //Actualiza el valor de this.id para que cada producto tenga un id único
  updateId = () => this.id++;
}

const product = new ProductManager();

//Verificando funcionamiento correcto de métodos

const separador = "---------------------------------";

console.log("Verificando validación de parámetros");
product.addProducts("Faltan otros parámetros"); //Funciona
console.log(separador);

console.log("Verificando agregado correcto de productos y id único");
product.addProducts(
  "Mesa blanca",
  "una mesa blanca",
  23000,
  "thumbnail",
  999,
  5
);
product.addProducts("Mesa gris", "una mesa gris", 25000, "thumbnail", 888, 5);
product.addProducts("Mesa negra", "una mesa negra", 32000, "thumbnail", 777, 5);
product.getProducts(); //Funciona
console.log(separador);

console.log("Verificando no agregado de productos repetidos");
product.addProducts("Mesa gris", "una mesa gris", 25000, "thumbnail", 888, 5); //Funciona
product.getProducts();
console.log(separador);

console.log("Verificando no encontrado de un producto");
product.getProductById(2); //Funciona
product.getProductById(8); //Funciona
console.log(separador);
