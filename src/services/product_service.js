const ProductDAO = require("../dao/mongo/product.mongo");

const productDAO = new ProductDAO();

class ProductService {
  constructor() {}

  //Obtiene un producto
  getProductById = async (pid) => {
    try {
      const product = await productDAO.getById(pid);
      return product;
    } catch (err) {
      console.error(err);
    }
  };

  //Obtiene todos los productos
  getProducts = async () => {
    try {
      const products = await productDAO.get();
      return products;
    } catch (err) {
      console.error(err);
    }
  };

  //Añade un producto
  addProduct = async (data) => {
    try {
      const product = await productDAO.create(data);
      return product;
    } catch (err) {
      console.error(err);
    }
  };

  //Actualiza un producto
  updateProduct = async (data, update) => {
    try {
      const product = await productDAO.update(data, update);
      return product;
    } catch (err) {
      console.error(err);
    }
  };

  //Elimina un producto
  deleteProduct = async (data) => {
    try {
      const product = await productDAO.delete(data);
      return product;
    } catch (err) {
      console.error(err);
    }
  };

  paginateProducts = async (queries, options) => {
    try {
      const products = await productDAO.paginate(queries, options);
      return products;
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = ProductService;
