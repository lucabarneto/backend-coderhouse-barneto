const mongoose = require("mongoose"),
  paginate = require("mongoose-paginate-v2");

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  thumbnails: Array,
  code: {
    type: Number,
    require: true,
    unique: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
    require: true,
    enum: ["Anime", "Paisajes", "Sci-Fi", "Abstracto", "Retratos"],
  },
});

productSchema.plugin(paginate);
const ProductModel = mongoose.model(productCollection, productSchema);

module.exports = ProductModel;
