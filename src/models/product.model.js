const mongoose = require("mongoose"),
  paginate = require("mongoose-paginate-v2");

const PRODUCT_COLLECTION = "products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
    match: /^[a-zñáéíóúü0-9-\+/#,\.\$&\(\)\s]+$/i,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
    match: /^(?!0)\d+$/,
  },
  thumbnails: Array,
  code: {
    type: Number,
    require: true,
    unique: true,
    match: /^\d{5}$/,
  },
  stock: {
    type: Number,
    require: true,
    match: /^(?!0)\d+$/,
  },
  category: {
    type: String,
    require: true,
    enum: ["Anime", "Paisajes", "Sci-Fi", "Abstracto", "Retratos"],
  },
  owner: {
    type: String,
    require: true,
    default: "admin",
    match: /(admin|(^[a-f\d]{24}$))/i,
  },
});

productSchema.plugin(paginate);
const ProductModel = mongoose.model(PRODUCT_COLLECTION, productSchema);

module.exports = ProductModel;
