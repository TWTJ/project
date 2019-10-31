const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  date: Date
});

module.exports = mongoose.model('product', productSchema);
