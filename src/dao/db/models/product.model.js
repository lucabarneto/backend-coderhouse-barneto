const mongoose = require("mongoose");

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

const productModel = mongoose.model(productCollection, productSchema);

module.exports = productModel;
