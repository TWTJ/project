const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  date: Date
});

//product 는 product 모듈을 만듬
module.exports = mongoose.model('product', productSchema);
